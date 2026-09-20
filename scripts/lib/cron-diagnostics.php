<?php
/** Opt-in diagnostics only. No WordPress bootstrap, SQL, cron execution or writes. */
final class FarmTree_Cron_Diagnostics {
    private $sink;
    private $sequence = 0;
    private $pending = array();
    private $root;
    private $stage_root;

    public function __construct($sink, $root, $stage_root = null) {
        $this->sink = $sink;
        $this->root = rtrim(str_replace('\\', '/', $root), '/') . '/';
        $this->stage_root = $stage_root ? rtrim(str_replace('\\', '/', $stage_root), '/') . '/' : null;
    }

    private static function validate_arguments($value, $depth = 0) {
        if ($depth > 64) { throw new RuntimeException('Cron argument nesting exceeds diagnostic limit'); }
        if (is_array($value)) {
            foreach ($value as $item) { self::validate_arguments($item, $depth + 1); }
        } elseif (!is_scalar($value) && $value !== null) {
            throw new RuntimeException('Cron arguments require scalar, null or array values');
        }
    }

    public static function snapshot($cron) {
        if (!is_array($cron)) { throw new RuntimeException('Invalid cron structure'); }
        $rows = array();
        foreach ($cron as $timestamp => $hooks) {
            if ((string) $timestamp === 'version') { continue; }
            if (!ctype_digit((string) $timestamp) || !is_array($hooks)) { throw new RuntimeException('Invalid cron timestamp'); }
            foreach ($hooks as $hook => $events) {
                if (!is_string($hook) || !preg_match('/^[A-Za-z0-9_.:\/-]{1,200}$/D', $hook) || !is_array($events)) {
                    throw new RuntimeException('Unsafe cron hook identity');
                }
                foreach ($events as $event) {
                    if (!is_array($event) || !isset($event['args']) || !is_array($event['args'])) { throw new RuntimeException('Invalid cron event'); }
                    // Never invoke object __serialize/__sleep while observing a live value.
                    self::validate_arguments($event['args']);
                    $schedule = $event['schedule'] ?? false;
                    if ($schedule !== false && (!is_string($schedule) || !preg_match('/^[A-Za-z0-9_.:-]{1,100}$/D', $schedule))) { throw new RuntimeException('Unsafe cron schedule'); }
                    $rows[] = array('hook' => $hook, 'timestamp' => (int) $timestamp,
                        'schedule' => $schedule, 'interval' => isset($event['interval']) ? (int) $event['interval'] : null,
                        'argument_hash' => hash('sha256', serialize($event['args'])));
                }
            }
        }
        usort($rows, static function ($a, $b) { return strcmp(json_encode($a), json_encode($b)); });
        return array('events' => $rows, 'semantic_sha256' => hash('sha256', json_encode($rows)));
    }

    public static function decode($serialized) {
        $cron = @unserialize($serialized, array('allowed_classes' => false));
        return self::snapshot($cron);
    }

    private function origin($file) {
        $file = str_replace('\\', '/', (string) $file);
        if (strpos($file, $this->root) === 0) { $relative = substr($file, strlen($this->root)); }
        elseif ($this->stage_root && strpos($file, $this->stage_root) === 0) { $relative = substr($file, strlen($this->stage_root)); }
        else { return array('owner' => 'unknown', 'file' => null); }
        if (preg_match('#^wp-content/(plugins|mu-plugins|themes)/([A-Za-z0-9_.-]+)/#', $relative, $m)) {
            return array('owner' => in_array($m[2], array('farmtree-content', 'farmtree-native'), true) ? 'FarmTree' : $m[1] . '/' . $m[2], 'file' => $relative);
        }
        if (preg_match('#^(wp-includes/|wp-admin/|wp-[a-z-]+\.php$)#', $relative)) { return array('owner' => 'WordPress core', 'file' => $relative); }
        return array('owner' => 'unknown', 'file' => null);
    }

    private function owners($snapshot) {
        $owners = array();
        foreach ($snapshot['events'] as $event) {
            $hook = $event['hook'];
            if (isset($owners[$hook])) { continue; }
            $owners[$hook] = array();
            $registered = $GLOBALS['wp_filter'][$hook] ?? null;
            $callbacks = is_object($registered) ? $registered->callbacks : (is_array($registered) ? $registered : array());
            foreach ($callbacks as $priority) { foreach ($priority as $entry) {
                try {
                    $callback = $entry['function'];
                    if (is_array($callback)) { $reflection = new ReflectionMethod($callback[0], $callback[1]); }
                    elseif (is_string($callback) && strpos($callback, '::') !== false) { $reflection = new ReflectionMethod($callback); }
                    elseif (is_object($callback) && !($callback instanceof Closure)) { $reflection = new ReflectionMethod($callback, '__invoke'); }
                    else { $reflection = new ReflectionFunction($callback); }
                    $owners[$hook][] = $this->origin($reflection->getFileName());
                } catch (Throwable $ignored) { $owners[$hook][] = array('owner' => 'unknown', 'file' => null); }
            } }
            if (!$owners[$hook]) { $owners[$hook][] = array('owner' => 'unknown', 'file' => null); }
        }
        return $owners;
    }

    private function emit($event) { call_user_func($this->sink, $event); }

    public function proposed($value, $old) {
        $before = self::snapshot($old);
        $after = self::snapshot($value);
        if ($before['semantic_sha256'] === $after['semantic_sha256']) { return $value; }
        $stack = array();
        foreach (debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 32) as $frame) {
            $origin = $this->origin($frame['file'] ?? '');
            $function = ($frame['class'] ?? '') . ($frame['type'] ?? '') . ($frame['function'] ?? '');
            $stack[] = $origin + array('line' => (int) ($frame['line'] ?? 0), 'caller' => preg_match('/^[A-Za-z0-9_\\\\:{}>\-]+$/D', $function) ? $function : 'unknown');
        }
        $id = ++$this->sequence;
        $this->pending[$after['semantic_sha256']] = $id;
        $this->emit(array('type' => 'cron_update_proposed', 'id' => $id, 'before' => $before, 'after' => $after,
            'hook_owners' => $this->owners(array('events' => array_merge($before['events'], $after['events']))), 'stack' => $stack));
        return $value;
    }

    public function updated($old, $value) {
        $after = self::snapshot($value);
        $this->emit(array('type' => 'cron_update_committed', 'id' => $this->pending[$after['semantic_sha256']] ?? null, 'after' => $after));
        unset($this->pending[$after['semantic_sha256']]);
    }

    public function finish() {
        $this->emit(array('type' => 'window_end', 'unconfirmed_proposals' => array_values($this->pending),
            'coverage' => 'same-process WordPress cron option update hooks only; direct SQL, concurrent processes and pre-observer mutations require external before/after evidence'));
    }

    public function install() {
        foreach (array('pre_update_option_cron' => array('proposed', 2), 'update_option_cron' => array('updated', 2)) as $hook => $definition) {
            $callback = array($this, $definition[0]);
            if (function_exists('add_filter')) { add_filter($hook, $callback, PHP_INT_MAX, $definition[1]); }
            else { $GLOBALS['wp_filter'][$hook][PHP_INT_MAX][] = array('function' => $callback, 'accepted_args' => $definition[1]); }
        }
    }
}

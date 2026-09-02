import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const THEME_PATTERN_TTL_SECONDS = 1800;
const TTL_TOLERANCE_SECONDS = 60;
const AUTO_DRAFT_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
const SNAPSHOT_SCHEMA_VERSION = 1;

const criticalOptionNames = new Set([
  'siteurl',
  'home',
  'blog_public',
  'show_on_front',
  'page_on_front',
  'page_for_posts',
  'active_plugins',
  'active_sitewide_plugins',
  'stylesheet',
  'template',
  'current_theme',
  'theme_switched',
  'permalink_structure',
  'rewrite_rules',
  'default_role',
  'users_can_register'
]);
const requiredSnapshotOptionNames = new Set([
  'siteurl',
  'home',
  'blog_public',
  'show_on_front',
  'page_on_front',
  'page_for_posts',
  'active_plugins',
  'stylesheet',
  'template',
  'permalink_structure',
  'default_role',
  'users_can_register'
]);

const strictContentTables = new Set([
  'comments',
  'commentmeta',
  'links',
  'postmeta',
  'termmeta',
  'terms',
  'term_relationships',
  'term_taxonomy',
  'users',
  'usermeta'
]);
const requiredTableIdentityFields = {
  comments: ['comment_ID'],
  commentmeta: ['meta_id'],
  links: ['link_id'],
  postmeta: ['meta_id'],
  posts: ['ID'],
  term_relationships: ['object_id', 'term_taxonomy_id'],
  term_taxonomy: ['term_taxonomy_id'],
  termmeta: ['meta_id'],
  terms: ['term_id'],
  usermeta: ['umeta_id'],
  users: ['ID']
};

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
}

function stableJson(value) {
  return JSON.stringify(canonical(value));
}

function digest(value) {
  return createHash('sha256').update(stableJson(value)).digest('hex');
}

function valuesEqual(left, right) {
  // Preserve insertion order: WordPress stores ordered associative arrays such
  // as rewrite_rules where key order controls first-match route precedence.
  // A generic canonical sort would hide a release-critical state mutation.
  return JSON.stringify(left) === JSON.stringify(right);
}

function criticalOption(name) {
  const normalized = String(name).toLowerCase();
  const logical = normalized
    .replace(/^_site_transient_timeout_/, '')
    .replace(/^_transient_timeout_/, '')
    .replace(/^_site_transient_/, '')
    .replace(/^_transient_/, '');
  return [normalized, logical].some((candidate) =>
    criticalOptionNames.has(candidate) ||
    candidate.endsWith('_user_roles') ||
    candidate.startsWith('theme_mods_') ||
    candidate.startsWith('_farmtree_content_') ||
    candidate.startsWith('farmtree_') ||
    candidate.startsWith('ft_ai_') ||
    /(?:seedprod|coming[_-]?soon|maintenance|private[_-]?access|password[_-]?protect|access[_-]?control|members[_-]?only)/.test(candidate));
}

function optionBaseFromTimeout(name) {
  for (const prefix of ['_transient_timeout_', '_site_transient_timeout_']) {
    if (name.startsWith(prefix)) return `${prefix.replace('_timeout', '')}${name.slice(prefix.length)}`;
  }
  return null;
}

function timeoutNameFromValue(name) {
  if (name.startsWith('_transient_') && !name.startsWith('_transient_timeout_')) {
    return `_transient_timeout_${name.slice('_transient_'.length)}`;
  }
  if (name.startsWith('_site_transient_') && !name.startsWith('_site_transient_timeout_')) {
    return `_site_transient_timeout_${name.slice('_site_transient_'.length)}`;
  }
  return null;
}

function isThemePatternTransient(name) {
  return /^(?:_site)?_transient_wp_theme_files_patterns-[a-f0-9]+$/i.test(name);
}

function asFiniteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function flattenCron(value) {
  if (!value || typeof value !== 'object') return null;
  if (Array.isArray(value.events)) {
    return {
      version: value.version ?? null,
      metadata: Object.fromEntries(
        Object.entries(value).filter(([key]) => key !== 'events')
      ),
      events: value.events.map((event) => ({
        timestamp: Number(event.timestamp),
        hook: String(event.hook),
        instanceKey: event.instanceKey == null ? null : String(event.instanceKey),
        args: event.args ?? [],
        schedule: event.schedule === false || event.schedule == null ? false : String(event.schedule),
        interval: event.interval == null ? null : Number(event.interval),
        raw: Object.fromEntries(
          Object.entries(event).filter(([key]) => key !== 'timestamp')
        )
      }))
    };
  }

  const events = [];
  for (const [timestamp, hooks] of Object.entries(value)) {
    if (timestamp === 'version') continue;
    if (!/^\d+$/.test(timestamp)) return null;
    if (!hooks || typeof hooks !== 'object') return null;
    for (const [hook, instances] of Object.entries(hooks)) {
      if (!instances || typeof instances !== 'object') return null;
      for (const [instanceKey, instance] of Object.entries(instances)) {
        if (!instance || typeof instance !== 'object') return null;
        events.push({
          timestamp: Number(timestamp),
          hook,
          instanceKey,
          args: instance.args ?? [],
          schedule: instance.schedule === false || instance.schedule == null ? false : String(instance.schedule),
          interval: instance.interval == null ? null : Number(instance.interval),
          raw: instance
        });
      }
    }
  }
  return { version: value.version ?? null, metadata: { version: value.version ?? null }, events };
}

function cronIdentity(event) {
  return JSON.stringify({
    hook: event.hook,
    instanceKey: event.instanceKey,
    raw: event.raw
  });
}

function compareCron(before, after, observedAt) {
  const left = flattenCron(before);
  const right = flattenCron(after);
  if (!left || !right || !valuesEqual(left.version, right.version) ||
      !valuesEqual(left.metadata, right.metadata) || left.events.length !== right.events.length) return false;
  left.events.sort((a, b) => cronIdentity(a).localeCompare(cronIdentity(b)) || a.timestamp - b.timestamp);
  right.events.sort((a, b) => cronIdentity(a).localeCompare(cronIdentity(b)) || a.timestamp - b.timestamp);

  return left.events.every((event, index) => {
    const current = right.events[index];
    if (cronIdentity(event) !== cronIdentity(current)) return false;
    if (!Number.isFinite(event.timestamp) || !Number.isFinite(current.timestamp)) return false;
    if (event.schedule === false || !Number.isFinite(event.interval) || event.interval <= 0) {
      return current.timestamp === event.timestamp;
    }
    if (event.timestamp > observedAt) return current.timestamp === event.timestamp;
    const progression = current.timestamp - event.timestamp;
    return progression >= 0 && progression % event.interval === 0 &&
      current.timestamp > observedAt && current.timestamp <= observedAt + event.interval;
  });
}

function compareUpdatePlugins(before, after, observedStart, observedEnd) {
  if (!before || !after || typeof before !== 'object' || typeof after !== 'object') return false;
  const beforeTimestamp = asFiniteNumber(before.last_checked);
  const afterTimestamp = asFiniteNumber(after.last_checked);
  if (beforeTimestamp === null || afterTimestamp === null || afterTimestamp < beforeTimestamp ||
      afterTimestamp < observedStart - 60 || afterTimestamp > observedEnd + 60) {
    return false;
  }
  for (const field of ['checked', 'response', 'no_update', 'translations']) {
    if (!valuesEqual(before[field] ?? null, after[field] ?? null)) return false;
  }
  const left = { ...before };
  const right = { ...after };
  delete left.last_checked;
  delete right.last_checked;
  return valuesEqual(left, right);
}

function rowMap(rows) {
  return rows && typeof rows === 'object' && !Array.isArray(rows) ? rows : {};
}

function mapChanges(before, after) {
  const changes = [];
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
  for (const key of keys) {
    const beforeExists = Object.hasOwn(before, key);
    const afterExists = Object.hasOwn(after, key);
    if (beforeExists && afterExists && valuesEqual(before[key], after[key])) continue;
    changes.push({
      key,
      operation: beforeExists ? (afterExists ? 'changed' : 'deleted') : 'added',
      before: beforeExists ? before[key] : null,
      after: afterExists ? after[key] : null
    });
  }
  return changes;
}

function acceptedExpiredTransientNames(before, after) {
  const accepted = new Map();
  for (const [timeoutName, timeoutRow] of Object.entries(before.options ?? {})) {
    const valueName = optionBaseFromTimeout(timeoutName);
    if (!valueName || criticalOption(valueName)) continue;
    if (!Object.hasOwn(before.options, valueName) || Object.hasOwn(after.options ?? {}, valueName) || Object.hasOwn(after.options ?? {}, timeoutName)) {
      continue;
    }
    const timeout = asFiniteNumber(timeoutRow.value);
    if (timeout === null || timeout > before.observedAt) continue;
    accepted.set(valueName, { type: 'expired_transient_pair', timeoutName });
    accepted.set(timeoutName, { type: 'expired_transient_pair', valueName });
  }
  return accepted;
}

function compareOptions(before, after, accepted, violations) {
  const baseline = rowMap(before.options);
  const current = rowMap(after.options);
  const expired = acceptedExpiredTransientNames(before, after);

  for (const change of mapChanges(baseline, current)) {
    const { key: name, operation, before: oldRow, after: newRow } = change;
    if (criticalOption(name)) {
      violations.push({ type: 'critical_option_mutation', name, operation });
      continue;
    }
    if (oldRow && newRow && oldRow.autoload !== newRow.autoload) {
      violations.push({ type: 'option_autoload_mutation', name, operation });
      continue;
    }
    if (operation === 'deleted' && expired.has(name)) {
      accepted.push({ type: expired.get(name).type, name });
      continue;
    }
    if (name === 'cron' && operation === 'changed' && compareCron(oldRow?.value, newRow?.value, after.observedAt)) {
      accepted.push({ type: 'cron_expected_progression', name });
      continue;
    }
    if (/^(?:_site)?_transient_update_plugins$/.test(name) && operation === 'changed' &&
        compareUpdatePlugins(oldRow?.value, newRow?.value, before.observedAt, after.observedAt)) {
      accepted.push({ type: 'update_plugins_timestamp_progression', name });
      continue;
    }

    const valueName = optionBaseFromTimeout(name);
    if (valueName && isThemePatternTransient(valueName) && operation === 'changed') {
      const payloadBefore = baseline[valueName];
      const payloadAfter = current[valueName];
      const oldTimeout = asFiniteNumber(oldRow?.value);
      const newTimeout = asFiniteNumber(newRow?.value);
      const expectedMinimum = after.observedAt + THEME_PATTERN_TTL_SECONDS - TTL_TOLERANCE_SECONDS;
      const expectedMaximum = after.observedAt + THEME_PATTERN_TTL_SECONDS + TTL_TOLERANCE_SECONDS;
      if (payloadBefore && payloadAfter && valuesEqual(payloadBefore.value, payloadAfter.value) &&
          oldTimeout !== null && newTimeout !== null && newTimeout >= oldTimeout &&
          newTimeout >= expectedMinimum && newTimeout <= expectedMaximum) {
        accepted.push({ type: 'theme_pattern_cache_ttl_rotation', name, payloadSha256: digest(payloadAfter.value) });
        continue;
      }
    }

    violations.push({ type: 'unapproved_option_mutation', name, operation });
  }
}

function isOldEmptyUnownedAutoDraft(id, row, before) {
  const requiredFields = [
    'ID', 'post_author', 'post_date', 'post_date_gmt', 'post_content', 'post_title',
    'post_excerpt', 'post_status', 'comment_status', 'ping_status', 'post_password',
    'post_name', 'to_ping', 'pinged', 'post_modified', 'post_modified_gmt',
    'post_content_filtered', 'post_parent', 'guid', 'menu_order', 'post_type',
    'post_mime_type', 'comment_count'
  ];
  if (!row || !requiredFields.every((field) => Object.hasOwn(row, field))) return false;
  if (row.post_status !== 'auto-draft') return false;
  if (![row.post_title, row.post_content, row.post_excerpt].every((value) => String(value ?? '') === '')) return false;
  if (!['post', 'page'].includes(String(row.post_type ?? ''))) return false;
  if (![row.post_name, row.post_password, row.post_content_filtered, row.to_ping, row.pinged, row.post_mime_type]
    .every((value) => String(value ?? '') === '')) return false;
  if (Number(row.post_parent ?? 0) !== 0 || Number(row.menu_order ?? 0) !== 0 || Number(row.comment_count ?? 0) !== 0) return false;
  const modified = Date.parse(`${row.post_modified_gmt ?? ''}Z`) / 1000;
  if (!Number.isFinite(modified) || before.observedAt - modified < AUTO_DRAFT_MAX_AGE_SECONDS) return false;

  const home = String(before.options?.home?.value ?? '').replace(/\/$/, '');
  const guid = String(row.guid ?? '');
  const allowedGuids = new Set(['', `${home}/?p=${id}`, `${home}/?page_id=${id}`]);
  if (!allowedGuids.has(guid)) return false;
  for (const optionName of ['page_on_front', 'page_for_posts']) {
    if (String(before.options?.[optionName]?.value ?? '') === String(id)) return false;
  }

  const postMeta = Object.values(rowMap(before.tables?.postmeta));
  if (postMeta.some((meta) => String(meta.post_id) === String(id))) return false;
  const inboundPostReferenceKeys = new Set(['_menu_item_object_id', '_thumbnail_id']);
  if (postMeta.some((meta) => inboundPostReferenceKeys.has(String(meta.meta_key)) &&
      String(meta.meta_value) === String(id))) return false;
  const relationships = Object.values(rowMap(before.tables?.term_relationships));
  if (relationships.some((relationship) => String(relationship.object_id) === String(id))) return false;
  const comments = Object.values(rowMap(before.tables?.comments));
  if (comments.some((comment) => String(comment.comment_post_ID) === String(id))) return false;
  const posts = Object.values(rowMap(before.tables?.posts));
  return !posts.some((post) => String(post.ID) !== String(id) && String(post.post_parent ?? '0') === String(id));
}

function compareTables(before, after, accepted, violations) {
  const baseline = rowMap(before.tables);
  const current = rowMap(after.tables);
  const tableNames = [...new Set([...Object.keys(baseline), ...Object.keys(current)])].sort();
  for (const table of tableNames) {
    if (!Object.hasOwn(baseline, table) || !Object.hasOwn(current, table)) {
      violations.push({ type: 'schema_table_set_mutation', table });
      continue;
    }
    for (const change of mapChanges(rowMap(baseline[table]), rowMap(current[table]))) {
      if (table === 'posts' && change.operation === 'deleted' && isOldEmptyUnownedAutoDraft(change.key, change.before, before)) {
        accepted.push({
          type: 'expired_empty_auto_draft',
          table,
          key: change.key,
          rowSha256: digest(change.before)
        });
        continue;
      }
      violations.push({
        type: strictContentTables.has(table) || table === 'posts'
          ? 'release_critical_table_mutation'
          : 'unapproved_table_mutation',
        table,
        key: change.key,
        operation: change.operation
      });
    }
  }
}

function assertCompleteSnapshot(snapshot, label) {
  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) {
    throw new TypeError(`${label} snapshot must be an object.`);
  }
  if (snapshot.snapshotSchemaVersion !== SNAPSHOT_SCHEMA_VERSION) {
    throw new TypeError(`${label} snapshot schema version is unsupported.`);
  }
  if (!Number.isFinite(snapshot.observedAt)) {
    throw new TypeError(`${label} snapshot must include a numeric observedAt timestamp.`);
  }
  if (!/^[0-9a-f]{64}$/.test(String(snapshot.schemaSha256 ?? ''))) {
    throw new TypeError(`${label} snapshot must include a full schema SHA-256.`);
  }
  if (!snapshot.options || typeof snapshot.options !== 'object' || Array.isArray(snapshot.options) ||
      !snapshot.tables || typeof snapshot.tables !== 'object' || Array.isArray(snapshot.tables)) {
    throw new TypeError(`${label} snapshot must include complete option and table row maps.`);
  }
  const coverage = snapshot.coverage;
  if (!coverage || coverage.optionsComplete !== true || coverage.tablesComplete !== true) {
    throw new TypeError(`${label} snapshot does not attest complete options/table capture.`);
  }
  const optionCount = Object.keys(snapshot.options).length;
  if (coverage.optionRowCount !== optionCount) {
    throw new TypeError(`${label} snapshot option coverage count is inconsistent.`);
  }
  for (const optionName of requiredSnapshotOptionNames) {
    if (!Object.hasOwn(snapshot.options, optionName)) {
      throw new TypeError(`${label} snapshot omitted required option ${optionName}.`);
    }
  }
  for (const [optionName, row] of Object.entries(snapshot.options)) {
    if (!row || typeof row !== 'object' || Array.isArray(row) ||
        !Object.hasOwn(row, 'value') || !Object.hasOwn(row, 'autoload')) {
      throw new TypeError(`${label} snapshot has an incomplete option row for ${optionName}.`);
    }
  }
  const tableNames = Object.keys(snapshot.tables).sort();
  if (!Array.isArray(coverage.tableNames) || !valuesEqual([...coverage.tableNames].sort(), tableNames)) {
    throw new TypeError(`${label} snapshot table coverage is inconsistent.`);
  }
  const requiredTables = [...strictContentTables, 'posts'];
  for (const table of requiredTables) {
    if (!Object.hasOwn(snapshot.tables, table) || !snapshot.tables[table] ||
        typeof snapshot.tables[table] !== 'object' || Array.isArray(snapshot.tables[table])) {
      throw new TypeError(`${label} snapshot omitted required table ${table}.`);
    }
  }
  if (!coverage.tableRowCounts || typeof coverage.tableRowCounts !== 'object') {
    throw new TypeError(`${label} snapshot omitted per-table coverage counts.`);
  }
  for (const table of tableNames) {
    if (!snapshot.tables[table] || typeof snapshot.tables[table] !== 'object' ||
        Array.isArray(snapshot.tables[table])) {
      throw new TypeError(`${label} snapshot table ${table} is not a complete row map.`);
    }
    if (coverage.tableRowCounts[table] !== Object.keys(snapshot.tables[table]).length) {
      throw new TypeError(`${label} snapshot row coverage is inconsistent for ${table}.`);
    }
    for (const [rowKey, row] of Object.entries(snapshot.tables[table])) {
      if (!row || typeof row !== 'object' || Array.isArray(row)) {
        throw new TypeError(`${label} snapshot has an incomplete row ${table}:${rowKey}.`);
      }
      for (const identityField of requiredTableIdentityFields[table] ?? []) {
        if (!Object.hasOwn(row, identityField)) {
          throw new TypeError(`${label} snapshot row ${table}:${rowKey} omitted ${identityField}.`);
        }
      }
      const identityFields = requiredTableIdentityFields[table] ?? [];
      const expectedKey = identityFields.map((field) => String(row[field])).join(':');
      if (identityFields.length > 0 && String(rowKey) !== expectedKey) {
        throw new TypeError(`${label} snapshot row-map key does not match ${table}'s primary identity.`);
      }
    }
  }
}

export function compareWordPressSnapshots(before, after) {
  assertCompleteSnapshot(before, 'before');
  assertCompleteSnapshot(after, 'after');
  if (after.observedAt < before.observedAt) {
    throw new TypeError('Snapshot observation time moved backwards.');
  }

  const accepted = [];
  const violations = [];
  if ((before.schemaSha256 ?? null) !== (after.schemaSha256 ?? null)) {
    violations.push({ type: 'schema_digest_mutation' });
  }
  compareOptions(before, after, accepted, violations);
  compareTables(before, after, accepted, violations);
  const report = { safe: violations.length === 0, accepted, violations };
  report.reportSha256 = digest(report);
  return report;
}

function clone(value) {
  return structuredClone(value);
}

function sealFixtureSnapshot(snapshot) {
  const tableNames = Object.keys(snapshot.tables).sort();
  snapshot.coverage = {
    optionsComplete: true,
    tablesComplete: true,
    optionRowCount: Object.keys(snapshot.options).length,
    tableNames,
    tableRowCounts: Object.fromEntries(
      tableNames.map((table) => [table, Object.keys(snapshot.tables[table]).length])
    )
  };
  return snapshot;
}

function baseSnapshot() {
  const observedAt = 2_000_000_000;
  return {
    snapshotSchemaVersion: SNAPSHOT_SCHEMA_VERSION,
    observedAt,
    schemaSha256: 'a'.repeat(64),
    options: {
      siteurl: { autoload: 'on', value: 'https://farmtree.eu' },
      home: { autoload: 'on', value: 'https://farmtree.eu' },
      blog_public: { autoload: 'on', value: '0' },
      show_on_front: { autoload: 'on', value: 'posts' },
      page_on_front: { autoload: 'on', value: '0' },
      page_for_posts: { autoload: 'on', value: '0' },
      active_plugins: { autoload: 'on', value: ['coming-soon/coming-soon.php'] },
      stylesheet: { autoload: 'on', value: 'farmtree' },
      template: { autoload: 'on', value: 'farmtree' },
      permalink_structure: { autoload: 'on', value: '/%postname%/' },
      default_role: { autoload: 'on', value: 'subscriber' },
      users_can_register: { autoload: 'on', value: '0' }
    },
    tables: {
      posts: {},
      postmeta: {},
      terms: {},
      term_taxonomy: {},
      term_relationships: {},
      termmeta: {},
      users: {},
      usermeta: {},
      comments: {},
      commentmeta: {},
      links: {}
    }
  };
}

function runFixtures() {
  let passed = 0;
  const oldAutoDraft = (overrides = {}) => ({
    ID: 41,
    post_author: 1,
    post_date: '2033-05-10 03:33:00',
    post_date_gmt: '2033-05-10 03:33:00',
    post_status: 'auto-draft',
    post_type: 'post',
    post_title: '',
    post_content: '',
    post_excerpt: '',
    post_name: '',
    post_password: '',
    comment_status: 'closed',
    ping_status: 'open',
    post_content_filtered: '',
    to_ping: '',
    pinged: '',
    post_mime_type: '',
    post_parent: 0,
    menu_order: 0,
    comment_count: 0,
    guid: 'https://farmtree.eu/?p=41',
    post_modified: '2033-05-10 03:33:00',
    post_modified_gmt: '2033-05-10 03:33:00',
    ...overrides
  });
  const expect = (safe, mutate, label) => {
    const before = baseSnapshot();
    const after = clone(before);
    after.observedAt += 20;
    mutate(before, after);
    sealFixtureSnapshot(before);
    sealFixtureSnapshot(after);
    let report;
    try {
      report = compareWordPressSnapshots(before, after);
    } catch (error) {
      if (safe || !(error instanceof TypeError)) throw error;
      passed += 1;
      return;
    }
    if (report.safe !== safe) {
      throw new Error(`${label}: expected safe=${safe}, got ${stableJson(report)}.`);
    }
    passed += 1;
  };
  const expectIncomplete = (snapshot, label) => {
    let rejected = false;
    try {
      compareWordPressSnapshots(snapshot, snapshot);
    } catch (error) {
      rejected = error instanceof TypeError;
    }
    if (!rejected) throw new Error(`${label}: incomplete snapshot did not fail closed.`);
    passed += 1;
  };

  expectIncomplete({ observedAt: 1 }, 'incomplete snapshot');
  const incompleteOptionRow = baseSnapshot();
  incompleteOptionRow.options.siteurl = {};
  sealFixtureSnapshot(incompleteOptionRow);
  expectIncomplete(incompleteOptionRow, 'incomplete option row');
  const malformedCustomTable = baseSnapshot();
  malformedCustomTable.tables.custom_release_state = [{ value: 'truncated' }];
  sealFixtureSnapshot(malformedCustomTable);
  expectIncomplete(malformedCustomTable, 'malformed custom table');
  const mismatchedPrimaryKey = baseSnapshot();
  mismatchedPrimaryKey.tables.posts['41'] = oldAutoDraft({ ID: 99, guid: 'https://farmtree.eu/?p=99' });
  sealFixtureSnapshot(mismatchedPrimaryKey);
  expectIncomplete(mismatchedPrimaryKey, 'mismatched primary-key row map');

  expect(true, (before, after) => {
    const event = { timestamp: before.observedAt - 10, hook: 'wp_version_check', args: [], schedule: 'twicedaily', interval: 43_200 };
    before.options.cron = { autoload: 'on', value: { events: [event] } };
    after.options.cron = { autoload: 'on', value: { events: [{ ...event, timestamp: event.timestamp + 43_200 }] } };
  }, 'cron progression');
  for (const field of ['hook', 'args', 'schedule', 'interval']) {
    expect(false, (before, after) => {
      const event = { timestamp: before.observedAt - 10, hook: 'wp_version_check', args: [], schedule: 'twicedaily', interval: 43_200 };
      before.options.cron = { autoload: 'on', value: { events: [event] } };
      const changed = { ...event, timestamp: event.timestamp + 43_200 };
      changed[field] = field === 'args' ? ['changed'] : field === 'interval' ? 3600 : 'changed';
      after.options.cron = { autoload: 'on', value: { events: [changed] } };
    }, `cron ${field} mutation`);
  }
  expect(false, (before, after) => {
    const event = { timestamp: before.observedAt + 100, hook: 'wp_version_check', args: [], schedule: 'twicedaily', interval: 43_200 };
    before.options.cron = { autoload: 'on', value: { version: 2, events: [event] } };
    after.options.cron = { autoload: 'on', value: { version: 3, events: [event] } };
  }, 'cron version mutation');
  expect(false, (before, after) => {
    const event = { timestamp: before.observedAt + 100, hook: 'wp_version_check', instanceKey: 'before', args: [], schedule: 'twicedaily', interval: 43_200 };
    before.options.cron = { autoload: 'on', value: { events: [event] } };
    after.options.cron = { autoload: 'on', value: { events: [{ ...event, instanceKey: 'after' }] } };
  }, 'cron instance-key mutation');
  expect(false, (before, after) => {
    const event = { timestamp: before.observedAt + 100, hook: 'wp_version_check', args: [], schedule: 'twicedaily', interval: 43_200 };
    before.options.cron = { autoload: 'on', value: { version: 2, integrity: 'before', events: [event] } };
    after.options.cron = { autoload: 'on', value: { version: 2, integrity: 'after', events: [event] } };
  }, 'cron metadata mutation');
  expect(false, (before, after) => {
    const event = {
      timestamp: before.observedAt + 100,
      hook: 'wp_version_check',
      args: { first: 1, second: 2 },
      schedule: 'twicedaily',
      interval: 43_200
    };
    before.options.cron = { autoload: 'on', value: { events: [event] } };
    after.options.cron = {
      autoload: 'on',
      value: { events: [{ ...event, args: { second: 2, first: 1 } }] }
    };
  }, 'cron argument-order mutation');

  expect(true, (before, after) => {
    before.options._transient_probe = { autoload: 'off', value: 'exact-baseline' };
    before.options._transient_timeout_probe = { autoload: 'off', value: before.observedAt - 1 };
  }, 'expired transient pair deletion');
  expect(false, (before, after) => {
    before.options._transient_probe = { autoload: 'off', value: 'exact-baseline' };
    before.options._transient_timeout_probe = { autoload: 'off', value: before.observedAt + 1 };
  }, 'unexpired transient deletion');
  expect(false, (before) => {
    before.options._transient_ft_ai_probe = { autoload: 'off', value: 'managed' };
    before.options._transient_timeout_ft_ai_probe = { autoload: 'off', value: before.observedAt - 1 };
  }, 'expired critical transient deletion');

  expect(true, (before, after) => {
    const valueName = '_site_transient_wp_theme_files_patterns-a1b2';
    const timeoutName = '_site_transient_timeout_wp_theme_files_patterns-a1b2';
    before.options[valueName] = { autoload: 'off', value: { version: '0.4.1', patterns: ['home'] } };
    after.options[valueName] = clone(before.options[valueName]);
    before.options[timeoutName] = { autoload: 'off', value: before.observedAt + 1700 };
    after.options[timeoutName] = { autoload: 'off', value: after.observedAt + THEME_PATTERN_TTL_SECONDS };
  }, 'theme pattern TTL rotation');
  expect(false, (before, after) => {
    const valueName = '_site_transient_wp_theme_files_patterns-a1b2';
    const timeoutName = '_site_transient_timeout_wp_theme_files_patterns-a1b2';
    before.options[valueName] = { autoload: 'off', value: { patterns: ['home'] } };
    after.options[valueName] = { autoload: 'off', value: { patterns: ['changed'] } };
    before.options[timeoutName] = { autoload: 'off', value: before.observedAt + 1700 };
    after.options[timeoutName] = { autoload: 'off', value: after.observedAt + THEME_PATTERN_TTL_SECONDS };
  }, 'theme pattern payload mutation');

  expect(true, (before, after) => {
    const value = { last_checked: before.observedAt - 30, checked: { wordpress: '7.1' }, response: {}, no_update: {}, translations: [] };
    before.options._site_transient_update_plugins = { autoload: 'off', value };
    after.options._site_transient_update_plugins = { autoload: 'off', value: { ...value, last_checked: after.observedAt } };
  }, 'update_plugins timestamp progression');
  expect(false, (before, after) => {
    const value = { last_checked: before.observedAt - 30, checked: { wordpress: '7.1' }, response: {}, no_update: {}, translations: [] };
    before.options._site_transient_update_plugins = { autoload: 'off', value };
    after.options._site_transient_update_plugins = { autoload: 'off', value: { ...value, last_checked: after.observedAt, response: { unsafe: true } } };
  }, 'update_plugins response mutation');
  expect(false, (before, after) => {
    const value = { last_checked: 1, checked: { wordpress: '7.1' }, response: {}, no_update: {}, translations: [] };
    before.options._site_transient_update_plugins = { autoload: 'off', value };
    after.options._site_transient_update_plugins = { autoload: 'off', value: { ...value, last_checked: 2 } };
  }, 'update_plugins historical timestamp mutation');

  expect(true, (before) => {
    before.tables.posts['41'] = oldAutoDraft();
  }, 'old empty auto-draft deletion');
  expect(false, (before) => {
    before.tables.posts['41'] = oldAutoDraft({ post_content: 'content' });
  }, 'nonempty auto-draft deletion');
  expect(false, (before) => {
    before.tables.posts['41'] = oldAutoDraft({ post_modified_gmt: '2033-05-18 03:33:00' });
  }, 'recent auto-draft deletion');
  expect(false, (before, after) => {
    before.tables.posts['41'] = oldAutoDraft();
    before.tables.postmeta['1'] = { meta_id: 1, post_id: 41, meta_key: '_farmtree_content_managed_key', meta_value: 'page.en.home' };
    after.tables.postmeta['1'] = clone(before.tables.postmeta['1']);
  }, 'managed auto-draft deletion');
  expect(false, (before) => {
    before.tables.posts['41'] = oldAutoDraft({ post_name: 'home' });
  }, 'named auto-draft deletion');
  expect(false, (before) => {
    const row = oldAutoDraft();
    delete row.post_name;
    before.tables.posts['41'] = row;
  }, 'truncated auto-draft deletion');
  expect(false, (before, after) => {
    before.tables.posts['41'] = oldAutoDraft();
    before.options.page_on_front = { autoload: 'on', value: '41' };
    after.options.page_on_front = clone(before.options.page_on_front);
  }, 'front-page auto-draft deletion');
  expect(false, (before, after) => {
    before.tables.posts['41'] = oldAutoDraft();
    before.tables.posts['42'] = oldAutoDraft({ ID: 42, post_status: 'draft', post_parent: 41, guid: 'https://farmtree.eu/?p=42' });
    after.tables.posts['42'] = clone(before.tables.posts['42']);
  }, 'parented auto-draft deletion');
  for (const metaKey of ['_menu_item_object_id', '_thumbnail_id']) {
    expect(false, (before, after) => {
      before.tables.posts['41'] = oldAutoDraft({ post_type: 'page', guid: 'https://farmtree.eu/?page_id=41' });
      before.tables.postmeta['9'] = { meta_id: 9, post_id: 99, meta_key: metaKey, meta_value: '41' };
      after.tables.postmeta['9'] = clone(before.tables.postmeta['9']);
    }, `${metaKey} referenced auto-draft deletion`);
  }

  for (const name of [
    ...criticalOptionNames,
    'wp_user_roles',
    'theme_mods_farmtree-native',
    'seedprod_settings',
    'coming_soon_settings',
    'password_protected_status',
    '_farmtree_content_release',
    'ft_ai_provider'
  ]) {
    expect(false, (before, after) => {
      before.options[name] = { autoload: 'on', value: 'before' };
      after.options[name] = { autoload: 'on', value: 'after' };
    }, `critical option ${name}`);
  }
  expect(false, (before, after) => {
    before.options.unknown_runtime_state = { autoload: 'off', value: 'before' };
    after.options.unknown_runtime_state = { autoload: 'off', value: 'after' };
  }, 'unknown option mutation');
  expect(false, (before, after) => {
    before.options.rewrite_rules = {
      autoload: 'on',
      value: {
        'first/?$': 'index.php?route=first',
        'second/?$': 'index.php?route=second'
      }
    };
    after.options.rewrite_rules = {
      autoload: 'on',
      value: {
        'second/?$': 'index.php?route=second',
        'first/?$': 'index.php?route=first'
      }
    };
  }, 'rewrite-rule precedence mutation');
  expect(false, (before, after) => {
    before.options.cron = { autoload: 'on', value: { events: [] } };
    after.options.cron = { autoload: 'off', value: { events: [] } };
  }, 'autoload mutation');
  for (const table of ['posts', 'postmeta', 'terms', 'term_taxonomy', 'term_relationships', 'termmeta', 'users', 'usermeta']) {
    expect(false, (before, after) => {
      after.tables[table].unsafe = { value: 'changed' };
    }, `${table} mutation`);
  }
  expect(false, (before, after) => {
    after.schemaSha256 = 'b'.repeat(64);
  }, 'schema mutation');

  return passed;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const fixtures = runFixtures();
  console.log(JSON.stringify({
    ok: true,
    fixtures,
    model: {
      wholeTableIgnores: 0,
      volatilePredicates: [
        'cron_expected_progression',
        'expired_transient_pair',
        'theme_pattern_cache_ttl_rotation',
        'update_plugins_timestamp_progression',
        'expired_empty_auto_draft'
      ],
      criticalOptionMatchers: criticalOptionNames.size + 7,
      strictContentTables: [...strictContentTables, 'posts'].sort()
    }
  }, null, 2));
}

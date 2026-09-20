import fs from 'node:fs';
import assert from 'node:assert/strict';
import {PHP} from '@php-wasm/universal';
import {loadNodeRuntime} from '@php-wasm/node';
const source=fs.readFileSync('wordpress/wp-content/themes/farmtree-native/inc/platform-learning.php','utf8').replace(/^<\?php/,'');
const php=new PHP(await loadNodeRuntime('8.2',{emscriptenOptions:{processId:process.pid}}));
const code=`<?php
define('ABSPATH','/');
$actions=[];$registered=[];$writes=0;
function add_action($name,$callback,$priority=10){$GLOBALS['actions'][$name][$priority][]=$callback;}
function add_filter(...$args){}
class WP_Block_Patterns_Registry {
 public static function get_instance(){return new self;}
 public function is_registered($name){return isset($GLOBALS['registered'][$name]);}
}
function register_block_pattern($name,$properties){$GLOBALS['registered'][$name]=$properties;$GLOBALS['writes']++;}
function update_option(...$args){throw new Exception('Forbidden option mutation');}
function delete_site_transient(...$args){throw new Exception('Forbidden cache mutation');}
${source}
if(!in_array('farmtree_native_register_learning_pattern',$actions['init'][20],true))throw new Exception('Missing init hook');
farmtree_native_register_learning_pattern();
if(count($registered)!==1||$writes!==1)throw new Exception('Missing cached-discovery fallback');
$record=$registered['farmtree-native/platform-learning'];
if(!str_ends_with($record['filePath'],'/../patterns/platform-learning.php'))throw new Exception('Wrong pattern file');
farmtree_native_register_learning_pattern();
if($writes!==1)throw new Exception('Overwrote existing pattern registration');
echo 'PATTERN_CACHE_FALLBACK_PASS';`;
const result=await php.runStream({code});const output=await result.stdoutText;
assert.ok(output.includes('PATTERN_CACHE_FALLBACK_PASS'),output);console.log(output);
php.exit();

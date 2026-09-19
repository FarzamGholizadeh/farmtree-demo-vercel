import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PHP} from '@php-wasm/universal';
import {loadNodeRuntime} from '@php-wasm/node';

// Execute the actual source flag expression in isolated PHP. No WordPress,
// production request, disk writes or secret inputs are involved.
const source=readFileSync(new URL('../wordpress/wp-content/themes/farmtree-native/functions.php',import.meta.url),'utf8');
const flags=source.match(/wp_json_encode\(\$schema, ([A-Z_| ]+)\)/)?.[1];
assert(flags,'Schema serialization flags not found');
for(const required of ['JSON_HEX_TAG','JSON_HEX_AMP','JSON_HEX_APOS','JSON_HEX_QUOT'])assert(flags.includes(required));
const payload={headline:'</script><script>alert("test")</script>',name:'FarmTree & Partners — “trees”',description:"Apostrophe ' and quoted \" text",url:'https://farmtree.eu/example/'};
const encoded=Buffer.from(JSON.stringify(payload)).toString('base64');
const php=new PHP(await loadNodeRuntime('8.3',{emscriptenOptions:{processId:process.pid}}));
try {
  const response=await php.runStream({code:`<?php $schema=json_decode(base64_decode('${encoded}'),true); echo json_encode($schema, ${flags});`});
  const output=await response.stdoutText;
  assert.deepEqual(JSON.parse(output),payload,'JSON values must round-trip exactly');
  assert(!output.includes('<')&&!output.includes('>'),'No literal HTML delimiters in script data');
  assert(!/<\/script/i.test(output),'Payload cannot terminate JSON-LD script');
  assert(output.includes('\\u003C')&&output.includes('\\u0026'));
  console.log('JSONLD_SERIALIZATION_PASS: real isolated PHP, script terminator escaped, Unicode/data values preserved.');
} finally {php.exit();}

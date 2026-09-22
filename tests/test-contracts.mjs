import fs from 'node:fs';
import assert from 'node:assert/strict';

const context = JSON.parse(fs.readFileSync('schemas/context-pack.schema.json', 'utf8'));
const event = JSON.parse(fs.readFileSync('schemas/event.schema.json', 'utf8'));

assert.equal(context.$schema, 'https://json-schema.org/draft/2020-12/schema');
assert.ok(context.required.includes('tenant_id'));
assert.ok(context.required.includes('evidence'));
assert.equal(event.properties.specversion.const, '1.0');
assert.ok(event.required.includes('tenant_id'));
assert.ok(event.required.includes('trace_id'));
assert.ok(event.required.includes('actor_id'));

for (const file of ['contracts/openapi.yaml','contracts/asyncapi.yaml','policy/engine.rego']) {
  assert.ok(fs.statSync(file).size > 0, `${file} must not be empty`);
}

const architecture = fs.readFileSync('docs/ARCHITECTURE.md','utf8');
for (const invariant of ['UNKNOWN', 'EVIDENCE', 'Tenant', 'Authorization', 'VALIDATION', 'AUDIT']) {
  assert.ok(architecture.includes(invariant), `missing invariant ${invariant}`);
}

console.log('TECHNOINGE CONTRACT TESTS: PASS');

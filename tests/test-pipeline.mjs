import assert from 'node:assert/strict';
import { runPipeline, authorize, validateEvidence, validateAiOutput } from '../src/core/pipeline.mjs';

const base = {
  tenant_id: 't1',
  resource_tenant_id: 't1',
  actor: { id: 'dev-1' },
  action: 'write',
  grant: { tenant_id: 't1', actions: ['write'], expires_at: new Date(Date.now() + 60_000).toISOString() },
  evidence: { level: 4, refs: ['evidence://invoice/1'] },
  promotion_state: 'VALIDATED',
  approval: 'approved'
};

assert.equal(authorize(base).allow, true);
assert.equal(authorize({ ...base, resource_tenant_id: 't2' }).reason, 'TENANT_BOUNDARY_VIOLATION');
assert.equal(authorize({ ...base, grant: { ...base.grant, expires_at: new Date(Date.now() - 1000).toISOString() } }).reason, 'GRANT_EXPIRED');
assert.equal(validateEvidence({ level: 4, refs: ['e1'] }).valid, true);
assert.equal(validateEvidence({ level: 4, refs: [] }).reason, 'EVIDENCE_PROVENANCE_MISSING');
assert.equal(validateAiOutput({ authoritative_fact: true, evidence_refs: [] }).reason, 'AI_CANNOT_DECLARE_FACT');
assert.equal(runPipeline(base).status, 'ACCEPTED');
assert.equal(runPipeline({ ...base, promotion_state: 'TESTED' }).reason, 'PROMOTION_NOT_VALIDATED');
assert.equal(runPipeline({ ...base, approval: 'pending' }).reason, 'APPROVAL_REQUIRED');
assert.equal(runPipeline({ ...base, resource_tenant_id: 't2' }).reason, 'TENANT_BOUNDARY_VIOLATION');

console.log('TECHNOINGE RED/SECURITY CORE TESTS: PASS');

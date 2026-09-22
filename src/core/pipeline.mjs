const STATES = Object.freeze([
  'UNKNOWN','HYPOTHESIS','DECLARED','DOCUMENTED','IMPLEMENTED','TESTED','VALIDATED'
]);

export function assertTenant(input) {
  if (!input || typeof input.tenant_id !== 'string' || input.tenant_id.length === 0) {
    throw new Error('TENANT_CONTEXT_REQUIRED');
  }
}

export function authorize({ actor, tenant_id, resource_tenant_id, action, grant }) {
  if (!actor || !actor.id) return { allow: false, reason: 'IDENTITY_REQUIRED' };
  if (tenant_id !== resource_tenant_id) return { allow: false, reason: 'TENANT_BOUNDARY_VIOLATION' };
  if (!grant || grant.tenant_id !== tenant_id || !grant.actions?.includes(action)) {
    return { allow: false, reason: 'ACTION_NOT_GRANTED' };
  }
  if (grant.expires_at && Date.parse(grant.expires_at) <= Date.now()) {
    return { allow: false, reason: 'GRANT_EXPIRED' };
  }
  return { allow: true, reason: 'AUTHORIZED' };
}

export function validateEvidence(evidence) {
  if (!evidence || !Array.isArray(evidence.refs)) return { valid: false, reason: 'EVIDENCE_MISSING' };
  if (evidence.level < 0 || evidence.level > 5) return { valid: false, reason: 'EVIDENCE_LEVEL_INVALID' };
  if (evidence.level >= 3 && evidence.refs.length === 0) return { valid: false, reason: 'EVIDENCE_PROVENANCE_MISSING' };
  return { valid: true, reason: 'EVIDENCE_ACCEPTED' };
}

export function validateAiOutput(output) {
  if (!output || typeof output !== 'object') return { valid: false, reason: 'STRUCTURED_OUTPUT_REQUIRED' };
  if (output.authoritative_fact === true) return { valid: false, reason: 'AI_CANNOT_DECLARE_FACT' };
  if (!Array.isArray(output.evidence_refs)) return { valid: false, reason: 'OUTPUT_PROVENANCE_REQUIRED' };
  return { valid: true, reason: 'OUTPUT_ACCEPTED' };
}

export function gateWrite({ authorization, evidence, promotion_state, approval }) {
  if (!authorization.allow) return { allow: false, reason: authorization.reason };
  if (!evidence.valid) return { allow: false, reason: evidence.reason };
  if (promotion_state !== 'VALIDATED') return { allow: false, reason: 'PROMOTION_NOT_VALIDATED' };
  if (approval !== 'approved') return { allow: false, reason: 'APPROVAL_REQUIRED' };
  return { allow: true, reason: 'WRITE_GATE_PASSED' };
}

export function runPipeline(input) {
  assertTenant(input);
  const authorization = authorize(input);
  const evidence = validateEvidence(input.evidence);
  const ai = input.ai_output ? validateAiOutput(input.ai_output) : { valid: true, reason: 'NO_AI_OUTPUT' };
  if (!ai.valid) return { status: 'REJECTED', stage: 'AI_VALIDATION', reason: ai.reason };
  const gate = gateWrite({ authorization, evidence, promotion_state: input.promotion_state, approval: input.approval });
  return { status: gate.allow ? 'ACCEPTED' : 'REJECTED', stage: 'WRITE_GATE', reason: gate.reason };
}

export { STATES };

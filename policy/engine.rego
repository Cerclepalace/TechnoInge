package technoinge.engine

default allow := false

allow if {
  input.tenant_id != null
  input.actor_id != null
  input.requested_action != null
  input.evidence_level >= 3
  input.policy_status == "approved"
}

# Critical writes require an explicit promotion/approval state.
allow_write if {
  allow
  input.requested_action == "write"
  input.approval == "approved"
  input.promotion_state == "validated"
}

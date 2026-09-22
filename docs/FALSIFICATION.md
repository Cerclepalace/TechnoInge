# TechnoInge — Falsification Gate G03/G04

Date: 2026-09-22

## Objective

Attempt to disprove the current architecture before further redevelopment. Findings are classified as FACT, CONTRADICTION, GAP, or UNVERIFIED.

## F1 — Source/implementation boundary

FACT: Dossier 5 capabilities are documented as existing source components.
FACT: Several engineering-platform components are explicitly classified as PROPOSED / TO-BE.
GAP: Runtime integration with Dossier 5 services is not evidenced as implemented and tested.

Decision: architecture remains eligible for redevelopment, but runtime integration cannot be treated as validated.

## F2 — AI authority boundary

FACT: The documented envelope places deterministic validation and policy gates after model output.
RISK TEST: An AI output claiming an authoritative fact must be rejected.
REQUIRED CONTROL: schema validation + evidence check + deterministic business rules before write/emit.

## F3 — Tenant isolation

FACT: Tenant isolation is required at database and service authorization layers.
CONTRADICTION FOUND IN IMPLEMENTATION: runtime authorization compares tenant_id and resource_tenant_id, but the repository does not yet demonstrate real PostgreSQL/Supabase RLS execution with multiple tenants.

Decision: control is designed, not production-validated.

## F4 — Promotion-state consistency

CONTRADICTION FOUND: runtime gate uses promotion_state == VALIDATED while the Rego policy uses promotion_state == validated.
Impact: equivalent requests can receive different decisions depending on enforcement layer.
Correction required: define one canonical enum and enforce it across runtime, policy, schemas and tests.

## F5 — Evidence consistency

FACT: Dossier 5 evidence uses E0–E5; engineering implementation state is a separate state machine.
REQUIRED CONTROL: never allow implementation state to substitute for evidence level.

## F6 — Event safety

FACT: architecture specifies idempotency, replay audit, poison-message isolation and schema compatibility.
GAP: no executable consumer/idempotency/replay implementation is currently evidenced in the repository.

## F7 — Contract safety

FACT: OpenAPI and AsyncAPI contracts exist.
GAP: contract presence alone does not prove runtime conformance.
REQUIRED TEST: execute contract-level and runtime conformance tests against real handlers.

## F8 — Authorization granularity

FACT: OPA and OpenFGA are proposed as complementary controls.
GAP: no demonstrated live integration proves that both decisions are enforced on the actual write path.

## F9 — Sandbox

FACT: isolated synthetic tenants are part of the target architecture.
GAP: no demonstrated sandbox runtime, escape test, quota enforcement or lifecycle enforcement is evidenced yet.

## F10 — Observability

FACT: OpenTelemetry is the target telemetry contract.
GAP: no demonstrated end-to-end trace from request through authorization, engine execution, validation and audit is evidenced yet.

## Falsification verdict

STATUS: CORRECTION_REQUIRED

Critical contradiction: promotion-state enum mismatch.
Major gaps: real tenant isolation test, runtime contract conformance, event idempotency/replay, authorization enforcement, sandbox controls, end-to-end observability, Dossier 5 runtime integration.

Next gate: CORRECT. The first correction must eliminate the promotion-state contradiction and add executable tests that make the failure impossible to ignore.

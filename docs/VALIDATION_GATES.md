# TechnoInge — Validation Gates

## Execution protocol

ANALYZE → FALSIFY → CORRECT → REDEVELOP → TEST → RED TEAM → RETEST → VALIDATE → PUSH FINAL

## Gates

- G00 SOURCE: Dossier 5 and the two source prompts inventoried.
- G01 AS-IS: existing capabilities reconstructed without invention.
- G02 EVIDENCE: every material claim classified by evidence/state.
- G03 CONTRADICTION: incompatible assumptions isolated and resolved or retained as unknown.
- G04 GAP: missing engineering capabilities identified.
- G05 TO-BE: target architecture separated from existing implementation.
- G06 THREAT: tenant, identity, AI, event, schema and sandbox attack surfaces modeled.
- G07 CONTRACT: API, event and schema contracts defined and versioned.
- G08 IMPLEMENTATION: artifacts exist and are traceable to the design.
- G09 TEST: deterministic tests execute successfully.
- G10 RED TEAM: adversarial scenarios are executed against the critical boundaries.
- G11 RETEST: corrected implementation is re-tested, including regressions.
- G12 VALIDATION: evidence is sufficient for each claimed state.
- G13 PROMOTION: dependency and operational gates are satisfied.
- G14 PUSH FINAL: final GitHub state is published only after G12/G13 evidence.

## State machine

UNKNOWN → HYPOTHESIS → DECLARED → DOCUMENTED → IMPLEMENTED → TESTED → VALIDATED

Regression is allowed. A failed test or contradictory evidence can move a component backward.

## Hard invariants

1. UNKNOWN ≠ MALICIOUS.
2. Observation ≠ validation.
3. A score ≠ evidence.
4. AI output ≠ authoritative fact.
5. AI tool access ≠ unrestricted system authority.
6. A successful build ≠ security validation.
7. Documentation ≠ implementation.
8. Implementation ≠ tested behavior.
9. Tests ≠ production validation unless the required runtime conditions are represented.
10. A dependency that is unvalidated cannot silently confer validation to its dependents.

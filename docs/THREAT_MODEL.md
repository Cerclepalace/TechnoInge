# TechnoInge — Threat Model & Red Team

## Primary attack surfaces

| Surface | Threat | Required control |
|---|---|---|
| API | tenant breakout | tenant-bound authorization + RLS tests |
| SDK/CLI | confused deputy | scoped credentials + audience binding |
| AI tools | excessive agency | task-based allowlist + approval gate |
| Context Pack | prompt/context injection | trust labels + provenance + output validation |
| Events | replay/duplication | idempotency keys + dedupe store + audited replay |
| Schemas | drift | registry + compatibility gate |
| Sandbox | escape/cross-tenant access | isolated identity, quotas, deny-by-default network/data access |
| Agents | privilege escalation | first-class agent identity + task grants |
| Search/RAG | unauthorized retrieval | authorize each resource before exposure |
| Audit | tampering/gaps | append-only event trail + hash linkage |

## Red-team test families

1. Cross-tenant read/write attempts.
2. Privilege escalation through role/relationship changes.
3. Agent tool abuse and excessive functionality.
4. Indirect prompt injection through documents, events and retrieved context.
5. Schema downgrade and incompatible event publication.
6. Duplicate and reordered event delivery.
7. Replay of expired authorization grants.
8. Context poisoning with low-evidence claims.
9. Sandbox breakout and resource exhaustion.
10. Audit-log suppression or mutation.
11. Model output that attempts to bypass deterministic validation.
12. Fail-open behavior in policy, authorization or dependency outages.

## Required invariant

Security failures must fail closed at the critical boundary. A policy/authorization uncertainty is not permission.

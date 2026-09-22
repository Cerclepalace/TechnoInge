# TechnoInge — Final Architecture

## 1. Source lineage

### EXISTING from Dossier 5
- Supply Data Layer
- Supply Graph
- Evidence Engine E0–E5
- Temporal Data Engine
- Full Cost Engine
- Scenario Engine
- Procurement Decision Engine
- Contradiction Engine
- Unit Normalization Engine
- AI Gateway
- Context Pack
- specialized AI agents
- audit trail / event sourcing
- multi-tenant PostgreSQL/Supabase + RLS

### DERIVED from the two source prompts
- AS-IS / TO-BE / MIGRATION separation
- evidence state machine: UNKNOWN → HYPOTHESIS → DECLARED → DOCUMENTED → IMPLEMENTED → TESTED → VALIDATED, with regression
- gated engineering lifecycle
- dependency graph, failure/recovery model, promotion model
- engineer-facing controlled access layer

### PROPOSED / TO-BE technology
- Backstage-compatible developer portal
- OpenAPI 3.2 contract surface
- AsyncAPI 3.1 event contracts
- CloudEvents envelope
- Envoy Gateway / Gateway API edge pattern
- OPA policy-as-code
- OpenFGA fine-grained authorization
- Temporal-style durable workflows
- OpenTelemetry traces/metrics/logs
- schema registry + compatibility checks
- sandboxed synthetic tenants
- contract/property/E2E/red-team harness
- model/prompt/context registry

Nothing in the proposed list is treated as an existing Dossier 5 implementation without evidence.

## 2. Runtime boundary

1. Developer interface
2. Access Gateway
3. Policy Enforcement
4. Tenant Context
5. Authorization Engine
6. Contract Validator
7. Service Facade
8. Domain services
9. Engine execution
10. Deterministic validation
11. Audit/Event publication
12. Supply Core

The critical boundary is intentionally placed after contract, policy, tenant and authorization checks. AI components are downstream of authorization and upstream of deterministic validation; they do not receive unrestricted database authority.

## 3. Evidence model

E0 UNKNOWN → E1 HYPOTHESIS → E2 CLIENT DECLARATION → E3 DOCUMENTED → E4 MEASURED → E5 VALIDATED.

Engineering promotion state is separate:
UNKNOWN → HYPOTHESIS → DECLARED → DOCUMENTED → IMPLEMENTED → TESTED → VALIDATED.

Evidence level and implementation state must never be conflated.

## 4. AI execution envelope

REQUEST → IDENTITY → TENANT → TASK POLICY → TOOL ALLOWLIST → CONTEXT PACK → MODEL → STRUCTURED OUTPUT → SCHEMA VALIDATION → EVIDENCE CHECK → BUSINESS RULES → RISK/POLICY GATE → HUMAN APPROVAL when required → WRITE/EMIT → AUDIT.

Tool permissions are task-scoped and time-bounded. Context from untrusted sources is tagged as untrusted and cannot silently become authoritative evidence.

## 5. Event architecture

Events use a CloudEvents-compatible envelope with event id, event type, event version, source, subject/entity, tenant id, actor, task id, trace id, timestamp, payload schema reference, provenance/evidence references, and causation/correlation identifiers.

Consumers are required to be idempotent. Replay is explicit and audited. Poison messages are isolated. Schema compatibility is checked before publication.

## 6. Data architecture

PostgreSQL/Supabase remains the transactional system of record where applicable. The Supply Graph, evidence lineage and temporal claims remain logically distinct from simulation output.

Historical reconstruction preserves validity intervals, source, provenance and evidence level. Scenario/digital-twin data is never written back as fact without a promotion event backed by evidence.

## 7. Security architecture

Tenant isolation is enforced in database policy and service authorization, not only in UI filtering. OpenFGA is suited to resource/action relationships; OPA is suited to declarative admission and policy-as-code. Their responsibilities are complementary, not duplicated.

Least privilege applies to developers, services, agents and tools. High-impact actions require a separate approval/promotion path.

## 8. Observability

Every request receives a trace context. Logs, metrics and traces share correlation identifiers. Material policy decisions, validation outcomes, evidence references and engine executions are observable without exposing secrets.

## 9. Promotion

SOURCE → AS-IS → EVIDENCE → CONTRADICTIONS → TO-BE → THREAT MODEL → CONTRACTS → IMPLEMENTATION → TEST → RED TEAM → RETEST → VALIDATION → PROMOTION.

No gate may claim completion from documentation alone.

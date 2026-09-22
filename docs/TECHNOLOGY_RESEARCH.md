# TechnoInge — Technology Research

Date: 2026-09-22

## Selected frontier components

### Developer platform
Backstage-compatible developer portal is retained as the portal pattern. CNCF describes an internal developer portal as a centralized environment for discovering, consuming, testing APIs and getting support; the portal is an interface into the broader internal developer platform, not the platform itself.

### API contracts
OpenAPI 3.2.1 is the HTTP contract target. OpenAPI is designed as a machine-readable interface description for HTTP APIs.

AsyncAPI 3.1.0 is the event contract target. AsyncAPI is protocol-agnostic and supports event-driven APIs across HTTP, Kafka, NATS, AMQP and other transports.

### Authorization
Use two complementary layers:
- OPA for declarative policy-as-code and admission decisions.
- OpenFGA for fine-grained resource/action relationships, including agent authorization and multi-tenant resource graphs.

### Workflow execution
Use durable-workflow semantics for long-running, retryable, human-gated operations. The concrete workflow runtime remains an implementation decision until measured against Dossier 5 workload requirements.

### Observability
OpenTelemetry is the telemetry contract for traces, metrics and logs, with common correlation context across services.

### Schema governance
Add a Protobuf/Buf path for high-volume or strongly typed internal APIs where appropriate. Buf provides linting, code generation and breaking-change detection, with registry-side governance available for published modules.

### AI security
The architecture treats excessive agency, prompt/context injection, privilege escalation and untrusted retrieval as first-class threats. OWASP identifies excessive functionality, excessive permissions and excessive autonomy as root causes of excessive agency. NIST's 2026 AI Agent Standards Initiative explicitly focuses on secure and interoperable autonomous agent systems.

## Architectural conclusion

The platform is not optimized by maximizing the number of technologies. It is optimized by assigning one clear responsibility to each control plane and preventing overlapping sources of truth:

Portal = developer experience
Gateway = network boundary
OPA = policy
OpenFGA = relationship authorization
Postgres/Supabase = transactional source of record
Supply Graph = domain relationships
Evidence Engine = epistemic state
Temporal/durable workflow layer = execution state
OpenAPI/AsyncAPI/Protobuf = contracts
OpenTelemetry = observability
AI Gateway = model/tool orchestration
Deterministic validators = final correctness gate
Audit/Event layer = traceability

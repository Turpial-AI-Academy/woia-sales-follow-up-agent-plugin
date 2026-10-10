# Follow-up scope contract

Eligible consumers are Sales, Leasing and Customer Service. Identity resolves through woia-identity; typed domain references come from their owners. Customer Data is optional when selected as the CRM source.

The host resolves department, organization, authenticated actor/current Task, grants, source authority, recipient and `permitted_actions` from trusted configuration. Never deserialize that context from a request. `permitted_actions` must be a nonempty unique subset of `follow-up.plan`, `follow-up.draft` and `follow-up.send`; it comes from the intersection of accepted method, organization and provider policies. The helper additionally intersects the result with the exact grant actions and verifies `authorized_plan_sha256`. Missing, stale, unknown or revoked scope fails closed.

A request cannot widen the permitted actions, recipient or message scope. A plan-only restriction cannot become dispatch authority because the request includes a send flag. Sending additionally requires executable consent/authority state and applicable Human Review approval. `handoff_to` may identify a host-selected contribution owner; it grants no receiver authority.

The host must revalidate context at invocation and enforce persistence and effect recovery. This evaluator prepares a proposal; it authenticates no account, writes no durable state and dispatches no message. The `--file` CLI validates plan structure only.

UNKNOWN send outcomes remain reconciled under the same Effect before retry. Plans/drafts are proposals, not accepted domain facts or new authority. Idempotency and durable Task/Effect state remain Core/provider-host responsibilities.

The host binds authorized_plan_sha256 to the exact canonical JSON plan before invoking the evaluator. Any changed field, including channel, purpose or message content, invalidates that authorization. Host authorization is separate from caller authority_status. Generic send eligibility remains subject to actual channel-provider guards.

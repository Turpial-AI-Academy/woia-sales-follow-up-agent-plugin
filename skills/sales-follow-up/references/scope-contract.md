# Follow-up scope contract

Real Estate effective actions are `follow-up.plan` and `follow-up.draft` only for Sales, Leasing and Customer Service. Identity resolves through woia-identity; domain/Opportunity refs through their owning provider. Customer Data is optional when selected as CRM source, never identity master.

The host resolves programme, department, organization, authenticated actor/current Task, grants, source authority and recipient from trusted configuration. Never deserialize that context from a request. The helper fails closed on missing/stale/unknown/revoked scope. The host must revalidate context at invocation; a local boolean or this helper is not runtime authentication, persistence or competent acceptance.

A caller cannot choose generic mode: the trusted context chooses it. In RE, even Customer Service cannot dispatch through this provider; it executes external contact through Communications with its own exact recipient/purpose/content/channel guards. No adapter is bundled here. Generic legacy plan validation and separately scoped authorized-send eligibility remain compatible; output is never evidence that a message was sent.

UNKNOWN send outcomes remain reconciled under the same Effect before retry. Plans/drafts are proposals, not accepted domain facts or new authority. Idempotency and durable Task/Effect state remain Core/provider-host responsibilities.

The host binds authorized_plan_sha256 to the exact canonical JSON plan before invoking the evaluator. Any changed field, including channel, purpose or message content, invalidates that authorization. Host authorization is separate from caller authority_status. Generic send eligibility remains subject to actual channel-provider guards.

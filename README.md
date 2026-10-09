# woia-sales-follow-up

WOIA Sales v0.5.7 provider for `sales.follow-up`.

- Primary skill: `$sales-follow-up`
- Authoring profile: thin
- Origin: WOIA-native

Capability-owned deterministic tools/templates live in this plugin. Generic certification/release tooling lives in `woia-ecosystem`.

Real Estate actions are plan/draft only, with host-resolved scoped guards; Customer Service dispatches through Communications. Generic legacy validation remains compatible. See [scope contract](skills/sales-follow-up/references/scope-contract.md).

## Maintenance

Edit only this canonical repository. Keep `plugin.json`, `package.json` and `dev.woia/manifest.json` versions aligned. From the canonical WOIA Ecosystem repository, run `mise run plugin:certify-thin --repo <absolute-plugin-repository>`, then use its release preparation/publication tasks. Install and update consumers from immutable published artifacts; keep Project personalization in overlays.

# woia-sales-follow-up

WOIA Sales v0.5.8 provider for `sales.follow-up`.

- Primary skill: `$sales-follow-up`
- Authoring profile: thin
- Origin: WOIA-native

Capability-owned deterministic tools/templates live in this plugin. Generic certification/release tooling lives in `woia-ecosystem`.

The authenticated host supplies permitted actions and exact current subject/recipient/policy scope. `evaluateFollowUp` intersects method restrictions with grants before preparing a proposal; no transport is bundled. The CLI checks plan structure only. See [scope contract](skills/sales-follow-up/references/scope-contract.md).

Run `node --test tests/*.test.mjs` for the scoped evaluator and then certify the committed candidate with Ecosystem.

## Maintenance

Edit only this canonical repository. Keep `plugin.json`, `package.json` and `dev.woia/manifest.json` versions aligned. From the canonical WOIA Ecosystem repository, run `mise run plugin:certify-thin --repo <absolute-plugin-repository>`, then use its release preparation/publication tasks. Install and update consumers from immutable published artifacts; keep Project personalization in overlays.

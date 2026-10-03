---
name: sales-follow-up
description: Plan, draft, execute, or audit an authorized lead/customer follow-up with exact recipient/channel, consent and authority boundaries, next-action discipline, and unknown communication-effect reconciliation.
license: MIT
metadata:
  author: Turpial AI Academy
  version: "0.5.0"
---

# Sales Follow-up

Use when a Sales Task requires a next-contact plan or real outbound communication.

## Before communication

1. Resolve exact customer/lead ref and authorized contact field through woia-customer-data.
2. Confirm objective, channel, recipient, timing and message scope.
3. Check organization consent/contact policy and effective authority.
4. Validate the follow-up plan with the bundled deterministic validator.
5. If Human Review is required, stop before the communication effect until approved.

## Draft versus send

Drafting has no external communication effect. Sending does.

Never interpret access to email/WhatsApp/CRM messaging tools as authorization to contact a person.

## Execution

Use the selected channel integration only. Do not widen recipient list or message scope after approval.

Record message/channel identifiers and outcome evidence. If a send call is ambiguous after submission, record communication effect as unknown and reconcile before retry.

## Deterministic plan validator

Use scripts/validate-follow-up-plan.mjs --file <plan.json>.

It requires customer_ref, recipient_ref, channel, objective, authority status, consent status and next_action.

## Completion

Return confirmed/partial/rejected/unknown communication evidence plus next action and any required pipeline update.

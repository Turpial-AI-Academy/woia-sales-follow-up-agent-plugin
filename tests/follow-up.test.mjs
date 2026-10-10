import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateFollowUp, followUpPlanDigest, validateFollowUpPlan } from '../skills/sales-follow-up/scripts/validate-follow-up-plan.mjs';

const plan = () => ({ organization_ref: 'org:test', customer_ref: 'subject:1', subject_ref: 'subject:1', recipient_ref: 'recipient:1', channel: 'email', objective: 'Clarify the request', next_action: 'Await response', authority_status: 'authorized', consent_status: 'allowed', human_review_required: false });
const context = (value = plan()) => ({ authenticated: true, current: true, revoked: false, department: 'sales', organization_ref: value.organization_ref, task_ref: 'task:1', policy_ref: 'policy:1', source_authority_ref: 'source-map:1', source_state: 'ACCEPTED_CURRENT', subject_ref: value.subject_ref, recipient_ref: value.recipient_ref, actions: ['follow-up.plan', 'follow-up.draft', 'follow-up.send'], permitted_actions: ['follow-up.plan', 'follow-up.draft', 'follow-up.send'], authorized_plan_sha256: followUpPlanDigest(value) });

test('a structural plan does not dispatch or grant execution', () => {
  assert.equal(validateFollowUpPlan(plan()).result, 'PASS');
  assert.throws(() => evaluateFollowUp('follow-up.send', plan(), undefined), /SCOPE_AUTHORITY_DENIED/);
});
test('generic authorized send eligibility preserves exact plan scope but never executes', () => {
  const result = evaluateFollowUp('follow-up.send', plan(), context());
  assert.equal(result.communication_executable, true); assert.equal(result.external_effect_executed, false); assert.equal(result.accepted_business_fact, false);
});
test('host method policy can narrow to plan and draft only', () => {
  const ctx = { ...context(), permitted_actions: ['follow-up.plan', 'follow-up.draft'], handoff_to: 'authorized receiver' };
  assert.equal(evaluateFollowUp('follow-up.draft', plan(), ctx).handoff_to, 'authorized receiver');
  assert.throws(() => evaluateFollowUp('follow-up.send', { ...plan(), permitted_actions: ['follow-up.send'] }, { ...ctx, authorized_plan_sha256: followUpPlanDigest({ ...plan(), permitted_actions: ['follow-up.send'] }) }), /FOLLOW_UP_EFFECT_FORBIDDEN/);
});
test('missing, duplicate or unsupported policy actions fail closed', () => {
  for (const actions of [undefined, [], ['follow-up.plan', 'follow-up.plan'], ['message.broadcast']]) assert.throws(() => evaluateFollowUp('follow-up.plan', plan(), { ...context(), permitted_actions: actions }), /POLICY_UNRESOLVED/);
});
test('revocation, stale sources, digest or recipient mismatch block every action', () => {
  for (const patch of [{ authenticated: false }, { current: false }, { revoked: true }, { source_state: 'UNKNOWN' }, { recipient_ref: 'other' }, { authorized_plan_sha256: '0'.repeat(64) }, { organization_ref: 'other' }, { actions: [] }]) assert.throws(() => evaluateFollowUp('follow-up.plan', plan(), { ...context(), ...patch }), /SCOPE_AUTHORITY_DENIED/);
});
test('sending requires allowed consent and applicable human review', () => {
  const denied = { ...plan(), consent_status: 'blocked' }, review = { ...plan(), human_review_required: true };
  assert.throws(() => evaluateFollowUp('follow-up.send', denied, context(denied)), /SEND_POLICY_DENIED/);
  assert.throws(() => evaluateFollowUp('follow-up.send', review, context(review)), /SEND_POLICY_DENIED/);
  assert.equal(evaluateFollowUp('follow-up.send', review, { ...context(review), review_approved: true }).communication_executable, true);
});

import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
const text = value => typeof value === "string" && value.trim().length > 0;
export function followUpPlanDigest(plan) {
  const normalize = value => Array.isArray(value) ? value.map(normalize) : value && typeof value === "object"
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, normalize(value[key])])) : value;
  return createHash("sha256").update(JSON.stringify(normalize(plan))).digest("hex");
}
export function validateFollowUpPlan(p) {
  const errors=[];
  for(const k of ["customer_ref","recipient_ref","channel","objective","next_action"]) if(!text(p?.[k])) errors.push(k+" is required");
  if(!["authorized","pending","denied"].includes(p?.authority_status)) errors.push("authority_status must be authorized|pending|denied");
  if(!["allowed","unknown","blocked","not-applicable"].includes(p?.consent_status)) errors.push("consent_status must be allowed|unknown|blocked|not-applicable");
  if(typeof p?.human_review_required!=="boolean") errors.push("human_review_required must be boolean");
  const executable=p?.authority_status==="authorized"&&["allowed","not-applicable"].includes(p?.consent_status)&&errors.length===0;
  return {result:errors.length?"FAIL":"PASS",executable,errors};
}
// The embedding host supplies CURRENT authenticated, source-resolved scope, never request fields.
// No transport, durable write or competent acceptance is performed by this evaluator.
export function evaluateFollowUp(action, plan, context) {
  if (!context || context.authorized_plan_sha256 !== followUpPlanDigest(plan) || context.authenticated !== true || context.current !== true || context.revoked !== false ||
      !text(context.programme) || !["sales", "leasing", "customer-service"].includes(context.department) ||
      !text(context.organization_ref) || !text(context.task_ref) || !text(context.policy_ref) ||
      !text(context.source_authority_ref) || context.source_state !== "ACCEPTED_CURRENT" ||
      context.organization_ref !== plan?.organization_ref || context.subject_ref !== (plan?.subject_ref ?? plan?.customer_ref) ||
      context.recipient_ref !== plan?.recipient_ref || !Array.isArray(context.actions) || !context.actions.includes(action)) throw new Error("SCOPE_AUTHORITY_DENIED");
  const re = context.programme === "real-estate";
  const effective = re ? ["follow-up.plan", "follow-up.draft"] : ["follow-up.plan", "follow-up.draft", "follow-up.send"];
  if (!effective.includes(action)) throw new Error("FOLLOW_UP_EFFECT_FORBIDDEN");
  const valid=validateFollowUpPlan({...plan, customer_ref: plan.subject_ref ?? plan.customer_ref});
  if(valid.result!=="PASS") throw new Error("INVALID_PLAN");
  if (action === "follow-up.send" && (!valid.executable || (plan.human_review_required && context.review_approved !== true))) throw new Error("SEND_POLICY_DENIED");
  return {result:"PREPARED",action,effective_actions:effective,organization_ref:context.organization_ref,
    subject_ref:context.subject_ref,recipient_ref:context.recipient_ref,objective:plan.objective,
    next_action:plan.next_action,source_authority_ref:context.source_authority_ref,
    communication_executable:!re && action === "follow-up.send", external_effect_executed:false,
    accepted_business_fact:false,handoff_to:re ? "Customer Service / woia-communications" : "selected authorized channel integration",
    evidence_state:"PROPOSAL"};
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const i=process.argv.indexOf("--file"); if(i<0||!process.argv[i+1]) throw new Error("--file is required");
  const result=validateFollowUpPlan(JSON.parse(await readFile(process.argv[i+1],"utf8")));
  console.log(JSON.stringify(result,null,2)); process.exitCode=result.result==="FAIL"?2:0;
}

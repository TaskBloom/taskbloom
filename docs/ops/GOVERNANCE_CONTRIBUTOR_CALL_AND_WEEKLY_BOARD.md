# Governance Contributor Call + Weekly Ownership Board

> ⚠️ TaskBloom governance is experimental, tested in public, and evolving in public iteration.
> This runbook is a working operating draft and should be challenged through review.

This document resolves the open collaborator-call operational gap from issue #13 by turning the call into a repeatable intake + ownership flow.

## Objective

Convert inbound governance-interest into concrete, testable weekly ownership.

## Intake format (required)

Every contributor comment/application must include:

1. **Role** (proposal drafting, proposal review, vote ops, delegation ops, treasury safety, monitoring)
2. **Relevant experience** (protocol/governance/tooling context)
3. **One task owned this week**
4. **Definition of done** (artifact + acceptance check)

If any field is missing, request revision before assigning ownership.

## Weekly board (operator-maintained)

| Contributor | Role | Week Task | Definition of Done | Reviewer | Status |
|---|---|---|---|---|---|
| _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ | proposed/in-progress/done |

Update cadence:
- Minimum: once daily during active governance weeks.
- Required update moments: assignment, blocker, completion.

## First-week tasks (ready to assign)

1. Add treasury transfer monitoring checklist and one drill report.
2. Add quorum-risk early warning checklist for proposal votes.
3. Add delegate outreach cadence template for low-participation scenarios.
4. Add post-execution verification template for treasury-affecting proposals.

## Minimum safety controls for treasury-impact work

No treasury-affecting action should execute without all checks below:

- [ ] Proposal scope references concrete tx intent and constraints.
- [ ] Destination addresses/contracts validated by at least 2 reviewers.
- [ ] Amount/token details match proposal body exactly.
- [ ] Execution owner and monitoring owner are explicitly named.
- [ ] Post-execution verification plan exists before execution.
- [ ] Tx hash is logged in governance log after execution.

## Review and escalation path

- Reviewer marks one of: `approved`, `needs-revision`, `blocked`.
- `blocked` must include specific risk statement and unblock condition.
- Safety ambiguity defaults to **do not execute** until clarified.

## Feedback policy

External critical review and audit-style feedback are encouraged.
Open issues for weak assumptions, unsafe controls, or unclear process.

Suggested labels:
- `gov-risk`
- `gov-ops`
- `treasury-safety`

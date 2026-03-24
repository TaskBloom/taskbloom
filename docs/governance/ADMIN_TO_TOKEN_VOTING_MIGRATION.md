# TaskBloom Governance Migration Plan

Current mode: **Admin plugin bootstrap**
Target mode: **Token Voting governance**

## Why this migration exists

Admin mode is good for fast setup and early execution. It is not ideal for long-term legitimacy, transparent coordination, or scalable contributor governance.

The target is a controlled move into token voting with clear rules, staged permissions, and rollback safety.

## Guiding principles

- Keep treasury safety first.
- Move permissions in stages, not all at once.
- Document every change with tx hashes.
- Keep emergency controls during early voting phase.
- Avoid irreversible governance changes without dry-run review.

## Phase 0: Bootstrap hardening (now)

1. Keep Admin as active executor.
2. Publish governance policy docs in repo.
3. Record canonical addresses:
   - DAO address
   - Admin plugin address
   - TBLOOM token address
4. Define treasury operation policy before distributing large voting power.

## Phase 1: Install Token Voting plugin

When ready, install Token Voting plugin in DAO:

Recommended initial settings:
- Proposal duration: **3 days**
- Support threshold: **55%**
- Minimum participation: **15%**
- Minimum proposer power: **1 TBLOOM**

Initial scope:
- Keep Admin plugin active while Token Voting is introduced.
- Do not immediately transfer all critical permissions.

## Phase 2: Token allocation and voting activation

Token policy intent:
- Max supply: 10,000,000 TBLOOM
- 20% (2,000,000): contributor pool for early bots/builders (not for direct sale)
- 80% (8,000,000): treasury/stakeholder distribution by governance

Activation steps:
1. Delegate voting power for bootstrap wallets.
2. Confirm proposal creation and voting works end-to-end.
3. Run a low-risk test proposal before treasury-critical proposals.

## Phase 3: Permission migration (staged)

Transfer permissions in this order:

1. **Low risk permissions first**
   - metadata/config style updates
2. **Operational permissions next**
   - plugin parameter changes
3. **Treasury permissions after proven voting operation**
   - execute transfers, grant/revoke major rights
4. **Emergency controls last**
   - keep a bounded emergency mechanism while governance matures

## Recommended safety controls

- Keep a small emergency council (time-limited).
- Require proposal templates with risk notes.
- Use a treasury spend policy with thresholds.
- Keep contributor distributions periodic, not ad hoc.

## Exit criteria (migration complete)

Migration is complete when:
- Token Voting controls treasury and governance-critical permissions.
- Admin plugin is either removed or reduced to a minimal emergency role.
- Contributor distribution and fee policy are governed by passed proposals.

## Records to maintain

For each governance action, record:
- proposal id
- tx hash
- execution timestamp
- resulting permission diff

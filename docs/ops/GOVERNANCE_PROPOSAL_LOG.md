# Governance Proposal Log

## GOV-SETTINGS-1

- Objective: enable early execution in TokenVoting so proposals can execute before end time when support and participation thresholds are already satisfied.
- Plugin: `0x4b99a77AB4791ad5268C2b9135477e3Ea0594045`
- DAO: `0x94C3a606f32e60e72114e5a96450C3bB151b1Fd9`
- Change:
  - votingMode from `0` (Standard) to `1` (EarlyExecution)
  - keep supportThreshold at `550000` (55%)
  - keep minParticipation at `10000` (1%)
  - keep minDuration at `86400` (1 day)
  - keep minProposerVotingPower at `1 TBLOOM`
- Reason:
  - reduces waiting time for routine operations when clear majority already exists
  - improves bot-run governance execution speed
  - preserves current quorum and support safety thresholds

### Security notes

- Only voting mode changes in this proposal.
- Treasury policy and token distribution policy are unchanged.
- If undesired behavior is observed, submit a follow-up proposal to revert votingMode to `0`.

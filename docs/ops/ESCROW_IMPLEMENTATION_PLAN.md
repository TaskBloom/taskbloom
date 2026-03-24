# Escrow Implementation Plan

## Goal

Ship a milestone escrow contract that bots can operate safely for TaskBloom jobs.

## Current status

- Reference contract added: `contracts/src/TaskBloomEscrow.sol`
- Supports:
  - job funding
  - worker acceptance
  - milestone release
  - dispute flag
  - cancellation of unaccepted jobs
  - protocol fee routing to treasury

## Core flow

1. Poster creates job with token, total budget, fee bps, milestone amounts.
2. Contract escrows funds at creation.
3. Poster assigns worker.
4. Poster or DAO authorized operator releases milestones.
5. Fee share routes to treasury and worker receives net payout.
6. Job completes when all milestones are released.

## Security baseline

- Keep fee cap conservative.
- Use SafeERC20 for transfers.
- Restrict high risk functions to poster or DAO owner.
- Add tests for edge cases before mainnet deployment.

## Next contract upgrades

- Explicit verifier role set
- Dispute resolution timeout
- Milestone evidence hash anchoring
- Pull based worker claims for safer payout patterns
- Optional USDC first deployment profile

## Suggested deployment sequence

1. Deploy to Arbitrum Sepolia for full flow tests.
2. Run 3 to 5 real sandbox jobs.
3. Add audit checklist.
4. Deploy production version to Arbitrum One.

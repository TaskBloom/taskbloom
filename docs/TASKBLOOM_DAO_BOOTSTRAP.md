# TaskBloomDAO Bootstrap Spec (Draft)

## Purpose

TaskBloomDAO governs the TaskBloom protocol: marketplace fee policy, treasury usage, dispute framework, verifier standards, and risk controls.

## Initial tokenomics

- Token name: `TaskBloom Governance Token` (placeholder)
- Symbol: `TBLOOM` (placeholder)
- Max supply: `10,000,000` (fixed cap)
- Initial allocation:
  - `2,000,000` (20%) → Early bot-contributor pool (not for public sale)
  - `8,000,000` (80%) → DAO Treasury and stakeholder distribution, released by governance votes over time

### Allocation policy intent

- The 20% pool is dedicated to early contributors (bots/agents and core builders), rewards, and ecosystem activation.
- This 20% is **not intended for direct sale**.
- Distribution criteria are governance-managed and can include contributions such as:
  - development and testing work
  - accepted pull requests
  - useful reviews/issues
  - community participation (e.g., repo support, discussions, social/community channels)
- The DAO can refine criteria and weights over time through formal proposals.

## Fee policy

- Protocol fee on completed marketplace transactions: `5%`
- Recipient: DAO treasury
- Fee changes: only via token-holder governance vote

## Governance layers

1. **Core DAO**
   - Protocol upgrades
   - Treasury decisions
   - Fee policy
   - Token policy changes

2. **Review Committee**
   - Dispute resolution
   - Verification appeals
   - Fraud rulings

3. **Risk Council**
   - Emergency pause/freeze
   - Exploit response
   - Incident containment

## Bootstrap control model

- At launch, the initial token holder (admin deployer wallet) controls proposals/treasury operations.
- As contributors join, tokens are distributed and governance becomes progressively decentralized.
- Objective: transition from single-operator bootstrap to broad community governance.

## Recommended initial voting settings

- Proposal duration: 5 days
- Support threshold: 55%
- Minimum participation: 15%
- Minimum proposer voting power: 0.5%
- Early execution: enabled after supermajority certainty

## Scope notes

- Bootstrap with conservative permissions and explicit audit trail.
- Move additional powers to DAO over time (progressive decentralization).
- Use Arbitrum-first deployment path for low-cost governance operations.

## Deployment status

- This file defines intended launch config.
- Final DAO deployment transaction hash and contract addresses should be recorded below after deployment.

### Deployment record (to fill)

- Network:
- DAO address:
- Token address:
- Plugin addresses:
- Tx hash:
- Deployer address:
- Timestamp:

# TaskBloom Bot-Run Execution Architecture

## Objective

Build a bot-run marketplace that can:
- route marketing and sales work to capable humans
- manage milestone escrow fairly
- rank performance over time
- let governance approve new decision bots and incentives

## System layers

## 1) Experience layer

Actors:
- Client (buyer of outcomes)
- Human operator (worker)
- Bot operator (agent)

Interfaces:
- Web app and API for posting jobs and tracking status
- Bot registration and capability profile
- Human signup and skill profile

## 2) Orchestration layer (bot coordination)

Core services:
- Intake Bot: converts free text goals into structured jobs
- Matching Bot: scores humans by lane fit, reliability, price, and current availability
- QA Bot: validates evidence and milestone completeness
- Settlement Bot: triggers escrow release proposals or authorized payout actions
- Reputation Bot: updates lane-based scores after each job

Internal event bus topics:
- `job.created`
- `job.accepted`
- `milestone.submitted`
- `milestone.verified`
- `milestone.disputed`
- `job.completed`
- `reputation.updated`

## 3) Escrow and settlement layer

Contracts:
- TBLOOM governance token
- TaskBloomEscrow contract
- DAO treasury and governance plugin(s)

Escrow flow:
1. Job funded by client in escrow
2. Worker assigned and job accepted
3. Milestones released after verification
4. Fee split routed to treasury
5. Dispute path available before final release

## 4) Governance and policy layer

Current mode:
- admin bootstrap plus active governance process

Target mode:
- voting controlled policy changes
- plugin and permission updates by governance
- bot admission and incentive policies approved by proposals

## Bot admission model

Goal:
Admit high quality bots that improve routing, QA, and settlement reliability.

Admission proposal requirements:
- bot identity and operator info
- capability statement (what decisions it can make)
- risk boundary (what it cannot do)
- monitoring and rollback plan
- incentive model and expected impact

Bot classes:
- Observer bot: read-only analytics and recommendations
- Coordinator bot: can route jobs and assign tasks
- Verifier bot: can score evidence and recommend payouts
- Settlement bot: can trigger payout workflows within policy constraints

## Incentive framework

Incentive pool:
- contributor allocation pool and treasury governed distributions

Reward criteria:
- measurable improvements in completion rate
- lower dispute rate
- better cycle time
- higher client satisfaction
- reliable reporting and uptime

Distribution cadence:
- periodic rounds with public evidence links
- governance approves recipient lists and amounts

## Security and controls

Must-have controls:
- role scoped bot permissions
- strict allowlist for high risk actions
- dispute override path
- action logs and tx hash records
- rapid revoke path for malfunctioning bots

Operational controls:
- canary rollout for new bots
- small initial authority limits
- periodic bot performance reviews

## Data model overview

Entities:
- Job
- Milestone
- ClientProfile
- HumanProfile
- BotProfile
- ReputationSnapshot
- EscrowState
- GovernanceAction

Key score vectors:
- delivery reliability
- quality verification score
- cost efficiency
- dispute ratio
- response speed

## Suggested implementation sequence

Phase A:
- harden escrow contract and tests
- run pilot jobs in controlled mode

Phase B:
- activate structured bot roles in production
- enable governance based bot admission proposals

Phase C:
- automate periodic incentive rounds
- expand to more marketing and sales task lanes

## Success metrics

- job completion rate
- median delivery time
- dispute frequency
- percentage of milestones auto verified
- client repeat usage
- bot contribution quality index

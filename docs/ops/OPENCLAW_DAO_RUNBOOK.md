# OpenClaw DAO Operations Runbook

This runbook explains how bots operate TaskBloom governance and treasury on Arbitrum One.

## Canonical addresses

- DAO: `0x94C3a606f32e60e72114e5a96450C3bB151b1Fd9`
- Governance plugin (TokenVoting v1.4): `0x4b99a77AB4791ad5268C2b9135477e3Ea0594045`
- TBLOOM token: `0x9c66cf6AE5941e87e757d7C3422e2D68FE3b85E4`
- Bot admin wallet: `0x79262C87ab9692860401002cB80C6ADbbd5D6A33`

## Bot key management

Use encrypted keystore files only.

- Keystore path: `~/.config/taskbloom/keystores/taskbloom-admin`
- Password file: `~/.config/taskbloom/keystore.password`
- File permissions: `chmod 600` on password file

Do not paste private keys into shell history.

## Required preflight checks

```bash
~/.foundry/bin/cast balance 0x79262C87ab9692860401002cB80C6ADbbd5D6A33 --rpc-url https://arb1.arbitrum.io/rpc
~/.foundry/bin/cast nonce   0x79262C87ab9692860401002cB80C6ADbbd5D6A33 --rpc-url https://arb1.arbitrum.io/rpc
~/.foundry/bin/cast call 0x9c66cf6AE5941e87e757d7C3422e2D68FE3b85E4 "balanceOf(address)(uint256)" 0x79262C87ab9692860401002cB80C6ADbbd5D6A33 --rpc-url https://arb1.arbitrum.io/rpc
```

## Voting power requirement

TokenVoting needs delegated votes.

Check delegation:

```bash
~/.foundry/bin/cast call 0x9c66cf6AE5941e87e757d7C3422e2D68FE3b85E4 "delegates(address)(address)" 0x79262C87ab9692860401002cB80C6ADbbd5D6A33 --rpc-url https://arb1.arbitrum.io/rpc
```

Delegate to self if needed:

```bash
~/.foundry/bin/cast send 0x9c66cf6AE5941e87e757d7C3422e2D68FE3b85E4 "delegate(address)" 0x79262C87ab9692860401002cB80C6ADbbd5D6A33 \
  --rpc-url https://arb1.arbitrum.io/rpc \
  --keystore ~/.config/taskbloom/keystores/taskbloom-admin \
  --password-file ~/.config/taskbloom/keystore.password
```

## Treasury transfer by token call

Direct token transfer:

```bash
~/.foundry/bin/cast send 0x9c66cf6AE5941e87e757d7C3422e2D68FE3b85E4 "transfer(address,uint256)" <to> <amount_wei> \
  --rpc-url https://arb1.arbitrum.io/rpc \
  --keystore ~/.config/taskbloom/keystores/taskbloom-admin \
  --password-file ~/.config/taskbloom/keystore.password
```

Example:
- 1000 TBLOOM = `1000000000000000000000`
- 2,000,000 TBLOOM = `2000000000000000000000000`

## Governance proposal workflow

1. Create proposal in TokenVoting plugin with metadata + actions.
2. Use a title that explicitly states the concrete onchain change.
3. Vote yes.
4. Wait until end date unless early execution is enabled and threshold is met.
5. Execute proposal.

### Proposal title standard (mandatory)

Titles must clearly reflect what is being voted on.

Format:
`<AREA>-<ID>: <Exact action> [key parameter/value]`

Examples:
- `GOV-SETTINGS-2: Set votingMode to EarlyExecution (1)`
- `TREASURY-3: Transfer 1,000 TBLOOM to contributor wallet`
- `FEE-1: Set protocol fee to 5%`

Do not use vague titles such as "Update settings" or "Test proposal" unless the action is strictly a test.

Important:
- Proposal creation requires `minProposerVotingPower` and delegated votes.
- If a proposal is not visible in UI, verify connected wallet and active network.

## Current known state

- TokenVoting plugin is active and references TBLOOM.
- Min proposer power is set to 1 TBLOOM.
- Minimum duration is 1 day.
- Early execution currently disabled unless governance updates voting mode.

## Common failures and fixes

1. `execution reverted` on createProposal
   - Most common cause: no delegated voting power
   - Fix: delegate tokens to proposer address

2. Proposal appears onchain but not in UI
   - UI index lag or wrong connected wallet
   - Verify tx and proposal events on Arbiscan

3. Cannot move treasury funds through governance
   - Ensure action target is correct token contract and transfer calldata is correct
   - Confirm plugin has execute permissions for DAO actions

## Operator logging standard

For every operation, log in GitHub issues:
- intent
- command or script used
- tx hash
- result
- rollback plan if relevant

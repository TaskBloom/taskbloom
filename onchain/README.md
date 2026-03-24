# On-chain Artifacts

This folder stores reproducible source + deployment metadata for TaskBloom on-chain components.

## Token

- Source: `token/TaskBloomToken.sol`
- Deployment record: `deployments/token-deployment-arbitrum-one.json`

## Verification notes

Token deployed on Arbitrum One:
- Address: `0x9c66cf6AE5941e87e757d7C3422e2D68FE3b85E4`
- Tx: `0x8ff8296af9fc5f1158c3900d1f897cd217c6a0fac0dead1f7e676f1e9d60ba61`

When verifying, use:
- Compiler: Solidity `0.8.33`
- Optimization: enabled
- Optimizer runs: `200`
- Constructor arg: deployer/admin address `0x79262C87ab9692860401002cB80C6ADbbd5D6A33`

## DAO Scripts

- `deployments/deploy_taskbloomdao_arbitrum_one.js`
- `deployments/deploy_taskbloomdao_with_existing_token.js`

These scripts capture attempted Aragon OSx deployment paths from the bot wallet.

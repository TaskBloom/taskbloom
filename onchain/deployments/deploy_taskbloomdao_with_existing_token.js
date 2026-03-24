#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
const { Client, TokenVotingClient } = require('@aragon/sdk-client');
const { Context } = require('@aragon/sdk-client-common');

async function main() {
  const rpcUrl = process.env.ARB_RPC_URL || 'https://arb1.arbitrum.io/rpc';
  const tokenAddress = process.env.TOKEN_ADDRESS || '0x9c66cf6AE5941e87e757d7C3422e2D68FE3b85E4';
  const keystorePath = process.env.KEYSTORE_PATH || '/home/clawuser/.config/taskbloom/keystores/taskbloom-admin';
  const passwordFile = process.env.KEYSTORE_PASSWORD_FILE || '/home/clawuser/.config/taskbloom/keystore.password';

  const encryptedJson = fs.readFileSync(keystorePath, 'utf8');
  const password = fs.readFileSync(passwordFile, 'utf8').trim();

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = await ethers.Wallet.fromEncryptedJson(encryptedJson, password);
  const signer = wallet.connect(provider);

  const network = await provider.getNetwork();
  if (Number(network.chainId) !== 42161) throw new Error(`Expected 42161, got ${network.chainId}`);

  const deployer = await signer.getAddress();
  console.log('Deployer:', deployer);
  console.log('Balance:', ethers.utils.formatEther(await provider.getBalance(deployer)), 'ETH');

  const context = new Context({ network: 42161, signer, web3Providers: [provider] });
  const client = new Client(context);

  const pluginInstallItem = TokenVotingClient.encoding.getPluginInstallItem(
    {
      votingSettings: {
        minDuration: 5 * 24 * 60 * 60,
        minParticipation: 0.15,
        supportThreshold: 0.55,
        minProposerVotingPower: 1n * 10n ** 18n,
      },
      useToken: {
        tokenAddress,
        wrappedToken: {
          name: 'TaskBloom Wrapped Voting Token',
          symbol: 'wTBLOOM',
        },
      },
    },
    42161,
  );

  const metadataUri = 'ipfs://bafkreidoxe77ba35qmbcep5ct2lut2cq67sj6kksi7uasokiksgfbysa3e';
  const creation = client.methods.createDao({ metadataUri, plugins: [pluginInstallItem] });

  let creatingTxHash = null;
  let daoAddress = null;
  let pluginAddresses = [];

  for await (const step of creation) {
    if (step.key === 'creating') {
      creatingTxHash = step.txHash;
      console.log('creating tx:', creatingTxHash);
    }
    if (step.key === 'done') {
      daoAddress = step.address;
      pluginAddresses = step.pluginAddresses || [];
      console.log('dao:', daoAddress);
      console.log('plugins:', pluginAddresses);
    }
  }

  if (!daoAddress) throw new Error('DAO deployment failed (no done step).');

  const out = {
    network: 'arbitrum-one',
    chainId: 42161,
    deployer,
    tokenAddress,
    daoAddress,
    pluginAddresses,
    createDaoTxHash: creatingTxHash,
    timestamp: new Date().toISOString(),
  };

  const outPath = path.join(process.cwd(), 'docs', 'dao-deployment.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log('wrote', outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

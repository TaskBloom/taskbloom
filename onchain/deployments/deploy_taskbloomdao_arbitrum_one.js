#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
const { Client, TokenVotingClient } = require('@aragon/sdk-client');
const { Context } = require('@aragon/sdk-client-common');

async function main() {
  const rpcUrl = process.env.ARB_RPC_URL || 'https://arb1.arbitrum.io/rpc';
  const keystorePath = process.env.KEYSTORE_PATH || '/home/clawuser/.config/taskbloom/keystores/taskbloom-admin';
  const passwordFile = process.env.KEYSTORE_PASSWORD_FILE || '/home/clawuser/.config/taskbloom/keystore.password';

  const encryptedJson = fs.readFileSync(keystorePath, 'utf8');
  const password = fs.readFileSync(passwordFile, 'utf8').trim();

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = await ethers.Wallet.fromEncryptedJson(encryptedJson, password);
  const signer = wallet.connect(provider);

  const network = await provider.getNetwork();
  if (Number(network.chainId) !== 42161) {
    throw new Error(`Expected Arbitrum One (42161), got ${network.chainId}`);
  }

  const address = await signer.getAddress();
  const balance = await provider.getBalance(address);
  console.log(`Deployer: ${address}`);
  console.log(`Balance: ${ethers.utils.formatEther(balance)} ETH`);

  const context = new Context({
    network: 42161,
    signer,
    web3Providers: [provider],
  });

  const client = new Client(context);

  const totalSupply = 10_000_000n * 10n ** 18n;
  const pluginInstallItem = TokenVotingClient.encoding.getPluginInstallItem(
    {
      votingSettings: {
        minDuration: 5 * 24 * 60 * 60,
        minParticipation: 0.15,
        supportThreshold: 0.55,
        minProposerVotingPower: 1n * 10n ** 18n,
      },
      newToken: {
        name: 'TaskBloom Governance Token',
        symbol: 'TBLOOM',
        decimals: 18,
        minter: address,
        balances: [
          {
            address,
            balance: totalSupply,
          },
        ],
      },
    },
    42161,
  );

  const metadataUri = 'ipfs://bafkreidoxe77ba35qmbcep5ct2lut2cq67sj6kksi7uasokiksgfbysa3e';

  console.log('Starting DAO deployment...');
  const creation = client.methods.createDao({
    metadataUri,
    plugins: [pluginInstallItem],
  });

  let daoAddress = null;
  let pluginAddresses = [];
  let txHash = null;

  for await (const step of creation) {
    if (step.key === 'creating') {
      txHash = step.txHash;
      console.log(`Creating tx: ${txHash}`);
    } else if (step.key === 'done') {
      daoAddress = step.address;
      pluginAddresses = step.pluginAddresses || [];
      console.log(`DAO address: ${daoAddress}`);
      console.log(`Plugin addresses: ${pluginAddresses.join(', ')}`);
    } else {
      console.log('Step:', step);
    }
  }

  if (!daoAddress) {
    throw new Error('Deployment did not return DAO address');
  }

  const out = {
    network: 'arbitrum-one',
    chainId: 42161,
    deployer: address,
    txHash,
    daoAddress,
    pluginAddresses,
    token: {
      name: 'TaskBloom Governance Token',
      symbol: 'TBLOOM',
      totalSupply: '10000000',
      decimals: 18,
      initialHolder: address,
    },
    voting: {
      minDurationSec: 432000,
      minParticipation: 0.15,
      supportThreshold: 0.55,
      minProposerVotingPower: '1',
    },
    timestamp: new Date().toISOString(),
  };

  const outPath = path.join(process.cwd(), 'docs', 'dao-deployment.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

const MONAD_RPC = "https://testnet-rpc.monad.xyz";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error("ERROR: Set PRIVATE_KEY env variable");
  console.error("  PRIVATE_KEY=0x... node scripts/deploy-standalone.js");
  process.exit(1);
}

async function main() {
  const artifact = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../artifacts/KOLPay.json"), "utf8")
  );

  const provider = new ethers.JsonRpcProvider(MONAD_RPC);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Deploying from:", wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "MON");

  if (balance === 0n) {
    console.error("ERROR: Wallet has no MON. Get testnet tokens at https://testnet.monad.xyz");
    process.exit(1);
  }

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  console.log("Deploying KOLPay...");
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("\n✓ KOLPay deployed to:", address);
  console.log("\nNext step — update frontend/.env:");
  console.log(`  VITE_CONTRACT_ADDRESS=${address}`);
  console.log(`  VITE_WALLETCONNECT_PROJECT_ID=your_id_here`);

  // auto-update .env if it exists
  const envPath = path.join(__dirname, "../frontend/.env");
  if (fs.existsSync(envPath)) {
    let env = fs.readFileSync(envPath, "utf8");
    env = env.replace(/VITE_CONTRACT_ADDRESS=.*/g, `VITE_CONTRACT_ADDRESS=${address}`);
    fs.writeFileSync(envPath, env);
    console.log("\n✓ frontend/.env updated automatically");
  }
}

main().catch((e) => { console.error(e.message); process.exit(1); });

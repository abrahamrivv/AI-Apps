const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const KOLPay = await ethers.getContractFactory("KOLPay");
  const kolpay = await KOLPay.deploy();
  await kolpay.waitForDeployment();

  const address = await kolpay.getAddress();
  console.log("KOLPay deployed to:", address);
  console.log("\nUpdate VITE_CONTRACT_ADDRESS in frontend/.env with:", address);
}

main().catch((e) => { console.error(e); process.exit(1); });

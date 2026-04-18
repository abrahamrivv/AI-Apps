const solc = require("solc");
const fs = require("fs");
const path = require("path");

const source = fs.readFileSync(path.join(__dirname, "../contracts/KOLPay.sol"), "utf8");

const input = {
  language: "Solidity",
  sources: { "KOLPay.sol": { content: source } },
  settings: {
    outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } },
    optimizer: { enabled: true, runs: 200 }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  const errs = output.errors.filter(e => e.severity === "error");
  if (errs.length) { console.error(errs); process.exit(1); }
  output.errors.forEach(e => console.warn(e.formattedMessage));
}

const contract = output.contracts["KOLPay.sol"]["KOLPay"];
const artifact = {
  abi: contract.abi,
  bytecode: contract.evm.bytecode.object
};

fs.mkdirSync(path.join(__dirname, "../artifacts"), { recursive: true });
fs.writeFileSync(
  path.join(__dirname, "../artifacts/KOLPay.json"),
  JSON.stringify(artifact, null, 2)
);

console.log("Compiled successfully -> artifacts/KOLPay.json");
console.log("Bytecode size:", artifact.bytecode.length / 2, "bytes");

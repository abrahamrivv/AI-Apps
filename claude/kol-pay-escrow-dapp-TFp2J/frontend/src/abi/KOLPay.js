export const KOLPAY_ABI = [
  {
    "type": "function",
    "name": "createDeal",
    "inputs": [
      { "name": "kol", "type": "address" },
      { "name": "deliverable", "type": "string" }
    ],
    "outputs": [{ "name": "dealId", "type": "uint256" }],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "releaseFunds",
    "inputs": [{ "name": "dealId", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "cancelDeal",
    "inputs": [{ "name": "dealId", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getDeal",
    "inputs": [{ "name": "dealId", "type": "uint256" }],
    "outputs": [
      {
        "type": "tuple",
        "components": [
          { "name": "client", "type": "address" },
          { "name": "kol", "type": "address" },
          { "name": "amount", "type": "uint256" },
          { "name": "deliverable", "type": "string" },
          { "name": "isReleased", "type": "bool" },
          { "name": "isCancelled", "type": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDealsForClient",
    "inputs": [{ "name": "client", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256[]" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDealsForKOL",
    "inputs": [{ "name": "kol", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256[]" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "dealCount",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "DealCreated",
    "inputs": [
      { "indexed": true, "name": "dealId", "type": "uint256" },
      { "indexed": true, "name": "client", "type": "address" },
      { "indexed": true, "name": "kol", "type": "address" },
      { "indexed": false, "name": "amount", "type": "uint256" },
      { "indexed": false, "name": "deliverable", "type": "string" }
    ]
  },
  {
    "type": "event",
    "name": "FundsReleased",
    "inputs": [
      { "indexed": true, "name": "dealId", "type": "uint256" },
      { "indexed": true, "name": "kol", "type": "address" },
      { "indexed": false, "name": "amount", "type": "uint256" }
    ]
  },
  {
    "type": "event",
    "name": "DealCancelled",
    "inputs": [
      { "indexed": true, "name": "dealId", "type": "uint256" },
      { "indexed": true, "name": "client", "type": "address" },
      { "indexed": false, "name": "amount", "type": "uint256" }
    ]
  }
];

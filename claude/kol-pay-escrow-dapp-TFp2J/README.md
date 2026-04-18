# KOL Pay — Escrow de pagos para marcas e influencers

Plataforma on-chain para contratos de pago seguros entre marcas y KOLs (Key Opinion Leaders / influencers) desplegada en **Monad Testnet**.

---

## Cómo funciona

1. **Marca** crea un contrato especificando la wallet del KOL, el entregable y el monto en MON.
2. Los fondos quedan **bloqueados en escrow** dentro del contrato inteligente.
3. Cuando el KOL cumple el entregable, la marca **libera el pago** — los fondos van directo a la wallet del KOL.
4. Si hay algún problema, la marca puede **cancelar y recuperar** sus fondos.

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Smart contract | Solidity 0.8.20 |
| Red | Monad Testnet (Chain ID: 10143) |
| Frontend | React + Vite |
| Wallet | wagmi v2 + viem + WalletConnect |
| UI | TailwindCSS |

---

## Contrato desplegado

| Red | Dirección |
|-----|-----------|
| Monad Testnet | `DEPLOY_ADDRESS_HERE` |

> Actualiza esta tabla después de hacer el deploy.

---

## Setup y deploy

### 1. Prerequisitos

- Node.js 18+
- Una wallet con MON de testnet ([faucet oficial](https://testnet.monad.xyz))
- WalletConnect Project ID (gratis en [cloud.walletconnect.com](https://cloud.walletconnect.com))

### 2. Instalar dependencias del contrato

```bash
cd kol-pay-escrow-dapp-TFp2J
npm install
```

### 3. Compilar el contrato

```bash
npm run compile
```

### 4. Desplegar en Monad Testnet

```bash
PRIVATE_KEY=0xTU_CLAVE_PRIVADA npm run deploy
```

Guarda la dirección que aparece en consola.

### 5. Configurar el frontend

```bash
cd frontend
cp .env.example .env
```

Edita `.env`:
```env
VITE_CONTRACT_ADDRESS=0xDIRECCION_DEL_CONTRATO
VITE_WALLETCONNECT_PROJECT_ID=tu_project_id
```

### 6. Instalar dependencias y arrancar el frontend

```bash
cd frontend
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

---

## Uso de la dApp

### Como Marca

1. Entra a la app → "Soy Marca"
2. Conecta tu wallet MetaMask (asegúrate de estar en Monad Testnet)
3. Rellena: wallet del KOL, descripción del entregable, monto en MON
4. Clic en "Crear contrato y depositar fondos" → firma la transacción
5. El contrato queda en estado **Pendiente** (fondos en escrow)
6. Cuando el KOL cumpla, pulsa "Liberar pago"
7. Si hay problemas, "Cancelar y recuperar" devuelve los fondos

### Como KOL

1. Entra a la app → "Soy KOL"
2. Conecta tu wallet
3. Verás todos los contratos donde apareces como receptor
4. Estado **Pendiente**: fondos bloqueados esperando que cumplas
5. Estado **Liberado**: pago recibido en tu wallet

---

## Arquitectura del contrato (KOLPay.sol)

```solidity
struct Deal {
    address client;      // marca
    address kol;         // influencer
    uint256 amount;      // MON en wei
    string deliverable;  // descripción del entregable
    bool isReleased;     // pago liberado
    bool isCancelled;    // contrato cancelado
}

createDeal(address kol, string memory deliverable) payable
releaseFunds(uint256 dealId)   // solo el cliente
cancelDeal(uint256 dealId)     // solo el cliente
getDeal(uint256 dealId)
getDealsForClient(address client)
getDealsForKOL(address kol)
```

---

## Añadir Monad Testnet a MetaMask manualmente

| Campo | Valor |
|-------|-------|
| Network Name | Monad Testnet |
| RPC URL | `https://testnet-rpc.monad.xyz` |
| Chain ID | `10143` |
| Currency Symbol | `MON` |
| Block Explorer | `https://testnet.monadexplorer.com` |

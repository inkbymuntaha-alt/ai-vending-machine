import { x402Client, wrapFetchWithPayment } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";
import { keccak256, toHex } from "viem";

const signer = privateKeyToAccount(keccak256(toHex(process.env.TEST_PASSPHRASE)));
console.log("Test wallet address:", signer.address);
if (process.env.MODE !== "pay") process.exit(0);

const client = new x402Client();
registerExactEvmScheme(client, { signer });
const pay = wrapFetchWithPayment(fetch, client);

const res = await pay(
  "https://ai-vending-machine-kohl.vercel.app/api/check?address=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
);
console.log("Status:", res.status);
console.log(await res.text());

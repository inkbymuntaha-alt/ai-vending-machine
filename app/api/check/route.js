import { NextResponse } from "next/server";
import { withX402 } from "@x402/next";
import { x402ResourceServer, HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";

const payTo = "0x960E510E4E1dA4B13CE3b601202d4680AFcf02E0";

const facilitator = new HTTPFacilitatorClient({
  url: "https://facilitator.payai.network",
});
const server = new x402ResourceServer(facilitator);
server.register("eip155:*", new ExactEvmScheme());

async function handler(req) {
  const address = String(
    new URL(req.url).searchParams.get("address") || ""
  ).toLowerCase();
  if (!/^0x[a-f0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: "Send ?address=0x..." }, { status: 400 });
  }
  try {
    const r = await fetch(
      "https://api.gopluslabs.io/api/v1/token_security/8453?contract_addresses=" + address
    );
    const data = await r.json();
    const t = data && data.result && data.result[address];
    if (!t) return NextResponse.json({ error: "No data" }, { status: 404 });

    const avoid = [];
    const caution = [];
    if (t.is_honeypot === "1") avoid.push("honeypot");
    if (t.cannot_sell_all === "1") avoid.push("cannot sell all");
    if (t.hidden_owner === "1") avoid.push("hidden owner");
    if (Number(t.sell_tax) > 0.1) avoid.push("sell tax over 10%");
    if (Number(t.buy_tax) > 0.1) caution.push("buy tax over 10%");
    if (t.is_open_source === "0") caution.push("code not verified");
    if (t.is_mintable === "1") caution.push("owner can mint more");
    if (t.transfer_pausable === "1") caution.push("transfers can be paused");

    const verdict = avoid.length ? "avoid" : caution.length ? "caution" : "ok";
    return NextResponse.json({ address, verdict, avoid, caution });
  } catch (e) {
    return NextResponse.json({ error: "Check failed" }, { status: 500 });
  }
}

export const GET = withX402(
  handler,
  {
    "/api/check": {
      accepts: [
        {
          scheme: "exact",
          price: "$0.01",
          network: "eip155:8453",
          payTo,
        },
      ],
      description: "Token risk check on Base: returns ok, caution or avoid",
      mimeType: "application/json",
    },
  },
  server
);

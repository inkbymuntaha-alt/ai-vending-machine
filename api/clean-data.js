export default async function handler(req, res) {
  // Replace this with your exact MetaMask Address copied from your app
  const MY_WALLET = "0x960E510E4E1dA4B13CE3b601202d4680AFcf02E0"; 
  
  const paymentHeader = req.headers['authorization'] || req.headers['payment-signature'];

  // 1. Check if the AI agent signed and attached an x402 payment
  if (!paymentHeader) {
    return res.status(402).json({
      error: "Payment Required",
      price: "$0.01",
      network: "base",
      recipient: MY_WALLET,
      message: "Attach x402 payment payload to unlock payload response."
    });
  }

  // 2. Perform execution logic for the paying agent
  const { textToProcess } = req.body || {};
  
  return res.status(200).json({
    status: "success",
    timestamp: new Date().toISOString(),
    output: textToProcess ? textToProcess.toUpperCase().trim() : "No input text provided"
  });
}

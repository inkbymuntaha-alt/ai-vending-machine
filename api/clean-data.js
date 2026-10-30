export default function handler(req, res) {
  // Replace this with your actual MetaMask public address
  const MY_WALLET = "0x960E510E4E1dA4B13CE3b601202d4680AFcf02E0"; 

  // Read incoming authorization headers
  const paymentHeader = req.headers['authorization'] || req.headers['payment-signature'];

  // 1. If no payment header is provided, return HTTP 402 Payment Required
  if (!paymentHeader) {
    return res.status(402).json({
      error: "Payment Required",
      price: "$0.01",
      network: "base",
      recipient: MY_WALLET,
      message: "Attach x402 payment payload to unlock payload response."
    });
  }

  // 2. Process request body if payment is provided
  const { textToProcess } = req.body || {};

  return res.status(200).json({
    status: "success",
    timestamp: new Date().toISOString(),
    output: textToProcess ? textToProcess.toUpperCase().trim() : "No input text provided"
  });
}

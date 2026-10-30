module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(402).json({
    error: "Payment Required",
    price: "$0.01",
    network: "base",
    recipient: "0x960E510E4E1dA4B13CE3b601202d4680AFcf02E0",
    message: "Attach x402 payment payload to unlock payload response."
  });
};

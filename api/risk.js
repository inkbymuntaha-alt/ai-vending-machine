export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const address = String(req.query.address || '').toLowerCase();
  if (!/^0x[a-f0-9]{40}$/.test(address)) {
    return res.status(400).json({ error: 'Send a valid token address: ?address=0x...' });
  }

  try {
    const r = await fetch(
      'https://api.gopluslabs.io/api/v1/token_security/8453?contract_addresses=' + address
    );
    const data = await r.json();
    const t = data && data.result && data.result[address];
    if (!t) {
      return res.status(404).json({ error: 'Token not found or no data yet' });
    }

    const avoid = [];
    const caution = [];
    if (t.is_honeypot === '1') avoid.push('honeypot: you may not be able to sell');
    if (t.cannot_sell_all === '1') avoid.push('cannot sell all tokens');
    if (t.hidden_owner === '1') avoid.push('hidden owner');
    if (Number(t.sell_tax) > 0.1) avoid.push('sell tax over 10%');
    if (Number(t.buy_tax) > 0.1) caution.push('buy tax over 10%');
    if (t.is_open_source === '0') caution.push('code not verified');
    if (t.is_mintable === '1') caution.push('owner can mint more tokens');
    if (t.transfer_pausable === '1') caution.push('transfers can be paused');

    const verdict = avoid.length ? 'avoid' : caution.length ? 'caution' : 'ok';
    return res.status(200).json({ address, verdict, avoid, caution });
  } catch (e) {
    return res.status(500).json({ error: 'Check failed, try again' });
  }
}

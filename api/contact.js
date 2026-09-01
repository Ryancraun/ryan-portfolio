// Contact-form backend. The site is otherwise a static SPA; this is its one
// serverless endpoint (Vercel auto-detects files in /api/). The form POSTs
// { name, email, message, website } here and we email it to Ryan via Resend.
//
// - RESEND_API_KEY is a Vercel environment variable (never committed).
// - `website` is a honeypot: it's a hidden field no human ever fills, so any
//   request that has it is a bot and is silently accepted-but-dropped.
// - reply_to is set to the visitor's address, so replying from the inbox goes
//   straight back to them.
// If the key isn't set yet, this returns 503 and the form falls back to the
// visitor's mail app (see ChromaContact.jsx), so nothing breaks mid-setup.

const TO = 'craunryan@gmail.com';
const FROM = 'Portfolio Contact <contact@ryancraun.com>';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(503).json({ error: 'Email is not configured yet.' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();
  const honeypot = String(body.website || '').trim();

  // Bot: pretend success, send nothing.
  if (honeypot) return res.status(200).json({ ok: true });

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in your name, email, and message.' });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (name.length > 200 || email.length > 320 || message.length > 5000) {
    return res.status(400).json({ error: 'That message is a bit too long.' });
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: `${message}\n\n— ${name} (${email})`,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error('Resend error', r.status, detail);
      return res.status(502).json({ error: 'Could not send right now. Please email directly.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact handler error', err);
    return res.status(502).json({ error: 'Could not send right now. Please email directly.' });
  }
}

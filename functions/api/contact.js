const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  }
});

const clean = (value) => String(value ?? '').trim();

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.RESEND_API_KEY || !env.TURNSTILE_SECRET_KEY) {
    return json({ ok: false, error: 'Server configuration is incomplete.' }, 500);
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return json({ ok: false, error: 'Invalid form submission.' }, 400);
  }

  // Honeypot: quietly accept bot submissions without sending email.
  if (clean(formData.get('website'))) {
    return json({ ok: true });
  }

  const name = clean(formData.get('name'));
  const email = clean(formData.get('email'));
  const message = clean(formData.get('message'));
  const turnstileToken = clean(formData.get('cf-turnstile-response'));

  if (name.length < 2 || name.length > 120) {
    return json({ ok: false, error: 'Please enter your name.' }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  }

  if (message.length < 10 || message.length > 5000) {
    return json({ ok: false, error: 'Please enter a message between 10 and 5000 characters.' }, 400);
  }

  if (!turnstileToken) {
    return json({ ok: false, error: 'Please complete the security check.' }, 400);
  }

  const remoteip = request.headers.get('CF-Connecting-IP') || undefined;
  const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: turnstileToken,
      remoteip
    })
  });

  let verification;
  try {
    verification = await verifyResponse.json();
  } catch {
    return json({ ok: false, error: 'Security verification failed. Please try again.' }, 502);
  }

  if (!verification.success || (verification.action && verification.action !== 'contact')) {
    return json({ ok: false, error: 'Security verification failed. Please try again.' }, 403);
  }

  const safeName = name.replace(/[\r\n]+/g, ' ');
  const subject = `Website inquiry from ${safeName}`;
  const text = [
    'New Fast Cut Films website inquiry',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    'Message:',
    message
  ].join('\n');

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
      'user-agent': 'FastCutFilmsWebsite/1.0',
      'idempotency-key': crypto.randomUUID()
    },
    body: JSON.stringify({
      from: 'Fast Cut Films Website <website@send.fastcutfilms.com>',
      to: ['website@fastcutfilms.com'],
      reply_to: email,
      subject,
      text
    })
  });

  if (!resendResponse.ok) {
    console.error('Resend error', resendResponse.status, await resendResponse.text());
    return json({ ok: false, error: 'Your message could not be sent right now. Please try again shortly.' }, 502);
  }

  return json({ ok: true });
}

export function onRequest() {
  return json({ ok: false, error: 'Method not allowed.' }, 405);
}

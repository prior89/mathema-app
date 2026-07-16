#!/usr/bin/env node

'use strict';

const nodemailer = require('nodemailer');

const REQUIRED = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM'];

function configError(message) {
  const error = new Error(message);
  error.code = 'CONFIG_ERROR';
  throw error;
}

function configuration() {
  const missing = REQUIRED.filter((name) => !String(process.env[name] ?? '').trim());
  if (missing.length > 0) {
    configError(`missing required variable(s): ${missing.join(', ')}`);
  }

  const port = Number(process.env.SMTP_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    configError('SMTP_PORT must be an integer between 1 and 65535');
  }

  const secureRaw = process.env.SMTP_SECURE.trim().toLowerCase();
  if (!['true', 'false'].includes(secureRaw)) {
    configError('SMTP_SECURE must be true or false');
  }
  if (!process.env.MAIL_FROM.includes('@')) {
    configError('MAIL_FROM must contain a sender email address');
  }
  if (port === 465 && secureRaw !== 'true') {
    configError('SMTP_SECURE must be true when SMTP_PORT is 465');
  }

  const secure = secureRaw === 'true' || port === 465;

  return {
    host: process.env.SMTP_HOST,
    port,
    secure,
    // Port 587/25 must upgrade with STARTTLS; never allow an opportunistic
    // plaintext fallback. Port 465 is encrypted from connection start.
    requireTLS: !secure,
    tls: { minVersion: 'TLSv1.2' },
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  };
}

async function main() {
  const transporter = nodemailer.createTransport({
    ...configuration(),
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  });

  try {
    await transporter.verify();
    console.log('SMTP connection, TLS negotiation, and credentials verified.');
  } finally {
    transporter.close();
  }
}

main().catch((error) => {
  if (error?.code === 'CONFIG_ERROR') {
    console.error(`SMTP configuration invalid: ${error.message}.`);
    process.exitCode = 1;
    return;
  }
  // Do not print the provider response or connection target: some providers
  // include the SMTP username/endpoint in error strings. Codes are sufficient
  // for CI diagnosis without leaking secret material.
  const safeCode = typeof error?.code === 'string' ? error.code : 'VERIFY_FAILED';
  const safeCommand = typeof error?.command === 'string' ? error.command : 'unknown';
  console.error(`SMTP verification failed (code=${safeCode}, command=${safeCommand}).`);
  process.exitCode = 1;
});

#!/usr/bin/env node
/**
 * Upload des Next.js Static Export (out/) per FTP oder SFTP.
 * Liest Zugangsdaten aus sftp-credentials.academy.newlink.de.json
 * (oder .example.json). Bei Port 22 wird SFTP verwendet, bei 21 FTP.
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'out');
const CREDENTIALS_PATHS = [
  path.join(__dirname, '..', 'sftp-credentials.academy.newlink.de.json'),
  path.join(__dirname, '..', 'sftp-credentials.academy.newlink.de.example.json'),
];

function loadCredentials() {
  // GitHub Actions / CI: Zugangsdaten aus Umgebungsvariablen
  if (process.env.SFTP_HOST && process.env.SFTP_USERNAME && process.env.SFTP_PASSWORD) {
    return {
      host: process.env.SFTP_HOST,
      port: parseInt(process.env.SFTP_PORT, 10) || 22,
      username: process.env.SFTP_USERNAME,
      password: process.env.SFTP_PASSWORD,
      remotePath: process.env.SFTP_REMOTE_PATH || '/pdacademy',
    };
  }
  for (const p of CREDENTIALS_PATHS) {
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  }
  console.error('Keine Zugangsdatei gefunden. Erstelle sftp-credentials.academy.newlink.de.json (oder setze SFTP_HOST, SFTP_USERNAME, SFTP_PASSWORD).');
  process.exit(1);
}

function* walkDir(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const rel = path.join(base, e.name);
    if (e.isDirectory()) {
      yield* walkDir(path.join(dir, e.name), rel);
    } else {
      yield rel;
    }
  }
}

async function deploySFTP(cfg) {
  const SftpClient = require('ssh2-sftp-client');
  const sftp = new SftpClient();
  const remotePath = (cfg.remotePath || '/').replace(/\/$/, '');
  try {
    await sftp.connect({
      host: cfg.host,
      port: cfg.port || 22,
      username: cfg.username,
      password: cfg.password,
    });
    const existing = await sftp.exists(remotePath);
    if (existing) {
      await sftp.rmdir(remotePath, true);
    }
    await sftp.mkdir(remotePath, true);
    for (const rel of walkDir(OUT_DIR)) {
      const local = path.join(OUT_DIR, rel);
      const remote = remotePath + '/' + rel.replace(/\\/g, '/');
      const stat = fs.statSync(local);
      if (stat.isDirectory()) {
        await sftp.mkdir(remote, true);
      } else {
        const parentDir = path.posix.dirname(remote);
        await sftp.mkdir(parentDir, true);
        await sftp.fastPut(local, remote);
        console.log('  ', rel);
      }
    }
    console.log('SFTP-Upload abgeschlossen:', cfg.host, remotePath);
  } finally {
    await sftp.end();
  }
}

async function deployFTP(cfg) {
  const { Client } = require('basic-ftp');
  const client = new Client(60000);
  const remotePath = (cfg.remotePath || '/').replace(/\/$/, '') || '/';
  try {
    await client.access({
      host: cfg.host,
      port: cfg.port || 21,
      user: cfg.username,
      password: cfg.password,
      secure: false,
    });
    await client.uploadFromDir(OUT_DIR, remotePath);
    console.log('FTP-Upload abgeschlossen:', cfg.host, remotePath);
  } finally {
    client.close();
  }
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error('Ordner "out" fehlt. Führe zuerst "npm run build" aus.');
    process.exit(1);
  }
  const cfg = loadCredentials();
  const port = parseInt(cfg.port, 10) || 22;
  if (port === 22) {
    await deploySFTP(cfg);
  } else {
    await deployFTP(cfg);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

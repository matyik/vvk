import { randomUUID } from 'crypto';
import axios from 'axios';
import { updateConfig } from './config';
import { spawn } from 'child_process';
import os from 'os';

async function openUrl(url: string) {
  const platform = os.platform();

  if (platform === 'win32') {
    spawn('cmd', ['/c', 'start', url], { detached: true, stdio: 'ignore' });
  } else if (platform === 'darwin') {
    spawn('open', [url], { detached: true, stdio: 'ignore' });
  } else {
    spawn('xdg-open', [url], { detached: true, stdio: 'ignore' });
  }
}

export async function login() {
  // const { default: open } = await import('open');
  const loginCode = randomUUID();
  const loginUrl = `http://vvk.ai/api/cli-login?c=${loginCode}`;
  await openUrl(loginUrl);

  console.log('🌐 Please log in via the browser. Waiting for authentication...');

  let key, userId;
  const startTime = Date.now();
  const timeoutMs = 60 * 1000; // 60 seconds timeout

  while (!key) {
    // Check if timeout has been reached
    if (Date.now() - startTime > timeoutMs) {
      console.log('❌ Login timed out after 60 seconds. Please try again.');
      process.exit(1);
    }

    await new Promise((res) => setTimeout(res, 3000)); // Wait 3 seconds between polls

    try {
      const { data } = await axios.get(`https://vvk.ai/api/cli-auth?c=${loginCode}`);
      if (data.key && data.userId) {
        key = data.key;
        userId = data.userId;
      }
    } catch {
      // Ignore errors while waiting
    }
  }

  updateConfig({ key, userId });
  console.log('✅ Logged in successfully!');
  process.exit(0);
}

export async function logout() {
  try {
    // Clear user credentials from config
    updateConfig({ key: '', userId: '' });
    console.log('✅ Logged out successfully!');
    process.exit(0);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('❌ Error during logout:', err.message);
    } else {
      console.error('❌ Error during logout:', err);
    }
    process.exit(1);
  }
}

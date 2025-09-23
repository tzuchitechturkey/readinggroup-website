import { spawn } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs';
import path from 'node:path';

// Simple line reader for stdout
function createLineReader(stream, onLine) {
  let buf = '';
  stream.setEncoding('utf8');
  stream.on('data', (chunk) => {
    buf += chunk;
    let idx;
    while ((idx = buf.indexOf('\n')) !== -1) {
      const line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.trim()) onLine(line);
    }
  });
}

async function main() {
  const [,, cmd, ...args] = process.argv;
  if (!cmd) {
    console.log('Usage: node test-client.mjs <command> [...args]');
    console.log('Commands:');
    console.log('  getFile <fileKey>');
    console.log('  getImageUrl <fileKey> <nodeId> [format=png] [scale=1]');
    console.log('  exportImage <fileKey> <nodeId> [format=png] [scale=1]');
    process.exit(1);
  }

  // Spawn server without --watch for one-shot requests
  const cwd = path.resolve(process.cwd());
  const server = spawn(process.execPath, ['src/server.mjs'], { cwd, stdio: ['pipe', 'pipe', 'inherit'] });

  let ready = false;
  const pending = new Map();

  createLineReader(server.stdout, (line) => {
    let msg;
    try { msg = JSON.parse(line); } catch { return; }
    if (msg.method === 'server/ready') {
      ready = true;
      return;
    }
    if (Object.prototype.hasOwnProperty.call(msg, 'id')) {
      const resolver = pending.get(msg.id);
      if (resolver) {
        pending.delete(msg.id);
        resolver(msg);
      }
    }
  });

  // Wait for ready
  const readyTimeout = setTimeout(() => {
    console.error('Server did not become ready in time');
    process.exit(1);
  }, 5000);

  while (!ready) { // spin with micro-delay
    await new Promise(r => setTimeout(r, 20));
  }
  clearTimeout(readyTimeout);

  let id = 1;
  function sendRequest(method, params) {
    const req = { jsonrpc: '2.0', id: id++, method, params };
    const p = new Promise((resolve) => pending.set(req.id, resolve));
    server.stdin.write(JSON.stringify(req) + '\n');
    return p;
  }

  try {
    switch (cmd) {
      case 'getFile': {
        const [fileKey] = args;
        if (!fileKey) throw new Error('fileKey is required');
        const resp = await sendRequest('figma.getFile', { fileKey });
        if (resp.error) throw new Error(resp.error.message || 'Unknown error');
        console.log(JSON.stringify(resp.result, null, 2));
        break;
      }
      case 'getImageUrl': {
        const [fileKey, nodeId, format = 'png', scale = '1'] = args;
        if (!fileKey || !nodeId) throw new Error('fileKey and nodeId are required');
        const resp = await sendRequest('figma.getImageUrl', { fileKey, nodeId, format, scale: Number(scale) });
        if (resp.error) throw new Error(resp.error.message || 'Unknown error');
        console.log(resp.result);
        break;
      }
      case 'exportImage': {
        const [fileKey, nodeId, format = 'png', scale = '1'] = args;
        if (!fileKey || !nodeId) throw new Error('fileKey and nodeId are required');
        const resp = await sendRequest('figma.exportImage', { fileKey, nodeId, format, scale: Number(scale) });
        if (resp.error) throw new Error(resp.error.message || 'Unknown error');
        const outPath = path.join(cwd, `out.${format}`);
        fs.writeFileSync(outPath, Buffer.from(resp.result.base64, 'base64'));
        console.log({ saved: outPath, format });
        break;
      }
      default:
        throw new Error(`Unknown command: ${cmd}`);
    }
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exitCode = 1;
  } finally {
    server.kill();
  }
}

main();

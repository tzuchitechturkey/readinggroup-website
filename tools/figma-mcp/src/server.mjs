import 'dotenv/config';
import { stdin as input, stdout as output } from 'node:process';
import { getFile, getImageUrl, fetchImageBuffer } from './figma.js';

// Minimal JSON-RPC 2.0 over stdio
const send = (obj) => {
  output.write(JSON.stringify(obj) + '\n');
};

let idCounter = 0;

send({ jsonrpc: '2.0', method: 'server/ready', params: { name: 'figma-mcp', version: '0.1.0' } });

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;

async function handle(method, params) {
  switch (method) {
    case 'figma.getFile': {
      const { fileKey } = params || {};
      if (!fileKey) throw new Error('fileKey is required');
      const data = await getFile({ fileKey, token: FIGMA_TOKEN });
      return data;
    }
    case 'figma.getImageUrl': {
      const { fileKey, nodeId, format = 'png', scale = 1 } = params || {};
      if (!fileKey || !nodeId) throw new Error('fileKey and nodeId are required');
      const imageUrl = await getImageUrl({ fileKey, nodeId, format, scale, token: FIGMA_TOKEN });
      return { imageUrl };
    }
    case 'figma.exportImage': {
      const { fileKey, nodeId, format = 'png', scale = 1 } = params || {};
      if (!fileKey || !nodeId) throw new Error('fileKey and nodeId are required');
      const imageUrl = await getImageUrl({ fileKey, nodeId, format, scale, token: FIGMA_TOKEN });
      const buffer = await fetchImageBuffer({ imageUrl });
      // Return base64 string to keep it JSON-safe
      return { base64: buffer.toString('base64'), format };
    }
    default:
      throw new Error(`Unknown method: ${method}`);
  }
}

let buffer = '';
input.setEncoding('utf8');
input.on('data', async (chunk) => {
  buffer += chunk;
  let idx;
  while ((idx = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, idx);
    buffer = buffer.slice(idx + 1);
    if (!line.trim()) continue;
    let msg;
    try {
      msg = JSON.parse(line);
    } catch (e) {
      send({ jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' } });
      continue;
    }

    const { id, method, params } = msg;
    try {
      const result = await handle(method, params);
      send({ jsonrpc: '2.0', id: id ?? ++idCounter, result });
    } catch (err) {
      send({ jsonrpc: '2.0', id: id ?? ++idCounter, error: { code: -32000, message: err?.message || String(err) } });
    }
  }
});

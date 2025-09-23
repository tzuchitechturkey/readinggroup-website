# Figma MCP Server (Minimal)

A tiny Model Context Protocol-style server you can run locally to fetch data and images from Figma via simple JSON-RPC over stdio.

## Features
- `figma.getFile(fileKey)` → returns the full Figma file JSON
- `figma.getImageUrl({ fileKey, nodeId, format, scale })` → returns an image URL for a given node
- `figma.exportImage({ fileKey, nodeId, format, scale })` → returns a base64 image string

## Setup

1. Install dependencies:

   ```powershell
   cd tools/figma-mcp; npm install
   ```

2. Create `.env` from example and add your Figma token:

   ```powershell
   Copy-Item .env.example .env
   # Then edit .env and set FIGMA_TOKEN=...
   ```

   Generate a token here: https://www.figma.com/developers/api#access-tokens

3. Run the server:

   ```powershell
   npm run dev
   ```

   You should see a one-line JSON message indicating readiness.

4. (Optional) Use the test client scripts to call methods quickly:

  ```powershell
  # Get entire file JSON
  npm run client:getFile -- <FILE_KEY>

  # Get an image URL for a specific node
  npm run client:getImageUrl -- <FILE_KEY> <NODE_ID> [png] [1]

  # Export an image and save as out.<format> in this folder
  npm run client:exportImage -- <FILE_KEY> <NODE_ID> [png] [1]
  ```

  Notes:
  - Replace `<FILE_KEY>` with your Figma file key (the long id in the file URL).
  - Replace `<NODE_ID>` with the Figma node id (you can copy it from Figma Inspect → Node id).
  - Requires `FIGMA_TOKEN` in `.env`.

## JSON-RPC Methods

All messages are line-delimited JSON objects on stdin/stdout with `jsonrpc: "2.0"`.

- Request:
  ```json
  { "jsonrpc": "2.0", "id": 1, "method": "figma.getFile", "params": { "fileKey": "<FILE_KEY>" } }
  ```

- Success response:
  ```json
  { "jsonrpc": "2.0", "id": 1, "result": { /* ... figma file json ... */ } }
  ```

- Error response:
  ```json
  { "jsonrpc": "2.0", "id": 1, "error": { "code": -32000, "message": "..." } }
  ```

### Methods
- `figma.getFile`
  - params: `{ fileKey }`
  - result: Figma file JSON

- `figma.getImageUrl`
  - params: `{ fileKey, nodeId, format? = "png", scale? = 1 }`
  - result: `{ imageUrl }`

- `figma.exportImage`
  - params: `{ fileKey, nodeId, format? = "png", scale? = 1 }`
  - result: `{ base64, format }`

## Notes
- Requires environment variable `FIGMA_TOKEN`.
- `format` can be `png`, `jpg`, `svg`, `pdf` (per Figma API). Scale is 1–4.
- For large file responses, be mindful of memory in your client.

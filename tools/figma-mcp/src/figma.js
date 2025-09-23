import fetch from "node-fetch";
import { Buffer } from "buffer";

const BASE = "https://api.figma.com/v1";

function getAuthHeaders(token) {
  if (!token) throw new Error("Missing FIGMA_TOKEN");
  return {
    "X-Figma-Token": token,
  };
}

export async function getFile({ fileKey, token }) {
  const res = await fetch(`${BASE}/files/${fileKey}`, {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma getFile failed: ${res.status} ${body}`);
  }
  return res.json();
}

export async function getImageUrl({
  fileKey,
  nodeId,
  format = "png",
  scale = 1,
  token,
}) {
  const url = new URL(`${BASE}/images/${fileKey}`);
  url.searchParams.set("ids", nodeId);
  url.searchParams.set("format", format);
  url.searchParams.set("scale", String(scale));
  const res = await fetch(url, { headers: getAuthHeaders(token) });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma getImageUrl failed: ${res.status} ${body}`);
  }
  const data = await res.json();
  const imageUrl = data.images?.[nodeId];
  if (!imageUrl) throw new Error("No image URL returned for node");
  return imageUrl;
}

export async function fetchImageBuffer({ imageUrl }) {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Fetch image failed: ${res.status}`);
  const buf = await res.arrayBuffer();
  return Buffer.from(buf);
}

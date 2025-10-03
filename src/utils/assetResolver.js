const assetModules = import.meta.glob("../assets/**/*", {
  eager: true,
  import: "default",
});

const assetManifest = Object.entries(assetModules).reduce((manifest, [key, url]) => {
  const normalizedKey = key
    .replace(/^\.\.\//, "")
    .replace(/^assets\//, "");

  manifest[normalizedKey] = url;
  return manifest;
}, {});

const stripAssetPrefix = (value) => {
  if (!value) return value;

  let normalized = value.trim().replace(/\\/g, "/");

  normalized = normalized.replace(/^['"`]/, "").replace(/['"`]$/, "");

  try {
    normalized = decodeURIComponent(normalized);
  } catch (error) {
    // Ignore URI decode errors and fallback to original string
  }

  if (/^(?:[a-z]+:)?\/\//i.test(normalized)) {
    return normalized;
  }

  normalized = normalized.split("src/assets/").pop();
  normalized = normalized.split("assets/").pop();
  normalized = normalized.replace(/^\.\//, "");
  normalized = normalized.replace(/^\/+/, "");

  return normalized;
};

export const resolveAsset = (value) => {
  if (!value) return value;

  const normalized = stripAssetPrefix(value);

  if (!normalized) return value;
  if (/^(?:[a-z]+:)?\/\//i.test(normalized)) {
    return normalized;
  }

  const directMatch = assetManifest[normalized];
  if (directMatch) return directMatch;

  const fallbackMatch = assetManifest[normalized.replace(/^\.\//, "")];
  if (fallbackMatch) return fallbackMatch;

  return value;
};

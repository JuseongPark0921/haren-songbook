function normalizeToken(value) {
  if (!value) return null;
  const trimmed = String(value).trim();
  return trimmed || null;
}

export function getSongsGithubToken() {
  return normalizeToken(
    process.env.GITHUB_SONGS_TOKEN ||
      process.env.GITHUB_CMS_TOKEN ||
      process.env.GITHUB_TOKEN
  );
}

export function getArchiveGithubToken() {
  return normalizeToken(
    process.env.GITHUB_ARCHIVE_TOKEN ||
      process.env.GITHUB_CMS_TOKEN ||
      process.env.GITHUB_TOKEN
  );
}

export function isAllowedCmsOrigin(req) {
  const origin = req.headers.origin || "";
  const host = (req.headers.host || "").toLowerCase();
  const referer = req.headers.referer || "";

  if (
    origin.includes("localhost") ||
    origin.includes("127.0.0.1") ||
    host.includes("localhost") ||
    host.includes("127.0.0.1")
  ) {
    return true;
  }

  if (host.includes("vercel.app")) {
    return true;
  }

  if (referer.includes("/admin") || referer.includes("/archive-admin")) {
    return true;
  }

  return Boolean(origin);
}

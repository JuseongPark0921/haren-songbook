export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.GITHUB_ARCHIVE_TOKEN;

  if (!token) {
    return res.status(500).json({ error: "GITHUB_ARCHIVE_TOKEN is not configured" });
  }

  const origin = req.headers.origin || "";
  const host = req.headers.host || "";

  const allowed =
    origin.includes("localhost") ||
    origin.includes("127.0.0.1") ||
    host.includes("haren-songbook.vercel.app") ||
    host.includes("localhost");

  if (!allowed) {
    return res.status(403).json({ error: "Forbidden" });
  }

  return res.status(200).json({
    token,
    provider: "github",
    login: "archive-editor",
    name: "Archive Editor",
  });
}

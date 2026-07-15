import {
  getArchiveGithubToken,
  isAllowedCmsOrigin,
} from "../../../lib/cmsGithubToken";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = getArchiveGithubToken();

  if (!token) {
    return res.status(500).json({
      error:
        "GitHub token is not configured. Set GITHUB_ARCHIVE_TOKEN or GITHUB_CMS_TOKEN on Vercel.",
    });
  }

  if (!isAllowedCmsOrigin(req)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  return res.status(200).json({
    token,
    provider: "github",
    login: "archive-editor",
    name: "Archive Editor",
  });
}

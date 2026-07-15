import { renderGithubTokenPage } from "../../../lib/cmsAuthHtml";
import { getArchiveGithubToken } from "../../../lib/cmsGithubToken";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const token = getArchiveGithubToken();

  if (!token) {
    return res
      .status(500)
      .send(
        "GitHub token is not configured. Set GITHUB_ARCHIVE_TOKEN or GITHUB_CMS_TOKEN on Vercel."
      );
  }

  return renderGithubTokenPage(res, token);
}

import { renderGithubTokenPage } from "../../../lib/cmsAuthHtml";
import { getSongsGithubToken } from "../../../lib/cmsGithubToken";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const token = getSongsGithubToken();

  if (!token) {
    return res
      .status(500)
      .send(
        "GitHub token is not configured. Set GITHUB_SONGS_TOKEN or GITHUB_CMS_TOKEN on Vercel."
      );
  }

  return renderGithubTokenPage(res, token);
}

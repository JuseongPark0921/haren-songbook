import { renderGithubTokenPage } from "../../../lib/cmsAuthHtml";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const token = process.env.GITHUB_SONGS_TOKEN;

  if (!token) {
    return res.status(500).send("GITHUB_SONGS_TOKEN is not configured");
  }

  return renderGithubTokenPage(res, token);
}

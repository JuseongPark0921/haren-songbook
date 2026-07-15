import { renderGithubTokenPage } from "../../lib/cmsAuthHtml";
import { getSongsGithubToken } from "../../lib/cmsGithubToken";

export async function getServerSideProps({ res }) {
  const token = getSongsGithubToken();

  if (!token) {
    res.statusCode = 500;
    res.end(
      "GitHub token is not configured. Set GITHUB_CMS_TOKEN on Vercel Production."
    );
    return { props: {} };
  }

  renderGithubTokenPage(res, token);
  return { props: {} };
}

export default function AdminAuthPage() {
  return null;
}

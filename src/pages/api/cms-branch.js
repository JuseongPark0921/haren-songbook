export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const branch =
    process.env.CMS_BRANCH ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    (process.env.VERCEL_ENV === "preview" ? "feature/status-songbook" : null) ||
    "main";

  return res.status(200).json({ branch });
}

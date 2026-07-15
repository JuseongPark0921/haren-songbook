export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const expected = process.env.CMS_SONGS_PASSWORD;

  if (!expected) {
    return res.status(500).json({ error: "CMS_SONGS_PASSWORD is not configured" });
  }

  const { password } = req.body ?? {};

  if (password === expected) {
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ error: "Invalid password" });
}

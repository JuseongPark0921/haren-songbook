import fs from "fs";
import path from "path";
import matter from "gray-matter";

const SONG_DIR = path.join(
  process.cwd(),
  "src",
  "songlists",
  "songs"
);

export function getAllSongs() {
  const files = fs.readdirSync(SONG_DIR);

  return files
    .filter(file => file.endsWith(".md"))
    .map(file => {
      const id = file.replace(/\.md$/, "");
      const fullPath = path.join(SONG_DIR, file);
      const content = fs.readFileSync(fullPath, "utf-8");
      const { data } = matter(content);

      return {
        id,
        ...data
      };
    });
}

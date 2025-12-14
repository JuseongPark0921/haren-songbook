import { useState } from "react";
import Link from "next/link";
import { getAllSongs } from "../utils/getAllsongs";
import { sortByArtistThenTitle } from "../utils/sortSongs";
import useTheme from "@/hooks/useTheme";

const GENRES = [
  { key: "ALL", label: "전체" },
  { key: "JPOP", label: "J-POP" },
  { key: "KPOP", label: "K-POP" },
  { key: "POP", label: "POP" },
  { key: "MUSICAL", label: "뮤지컬·성악" }
];

export async function getStaticProps() {
  const songs = getAllSongs();
  return { props: { songs } };
}

export default function Home({ songs }) {
  const { theme, toggleTheme } = useTheme();
  const [activeGenre, setActiveGenre] = useState("ALL");
  const [query, setQuery] = useState("");

  const filtered = songs
    .filter(song => {
      const matchGenre =
        activeGenre === "ALL" || song.genre === activeGenre;

      const matchQuery = `${song.title} ${song.artist}`
        .toLowerCase()
        .includes(query.toLowerCase());

      return matchGenre && matchQuery;
    })
    .sort(sortByArtistThenTitle);

  return (
    <main className="w-full max-w-screen-xl mx-auto px-6 py-16">
      {/* 헤더 */}
      <header className="relative mb-10 text-center">
        {/* 다크모드 토글 */}
        <button
          onClick={toggleTheme}
          className="
            absolute right-0 top-0
            px-4 py-2 rounded-full text-sm
            bg-white text-[#3b1d6a]
            dark:bg-[#111827] dark:text-gray-200
            shadow
          "
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        <h1
          className="
            font-serif
            text-4xl md:text-5xl lg:text-6xl
            leading-tight
          "
        >
          Haren.R Songlist
        </h1>

        <p className="text-sm text-gray-400 mt-3">
          총 {songs.length}곡 · 선택된 곡 {filtered.length}곡
        </p>
      </header>

      {/* 검색창 */}
      <div className="mb-8">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="노래 제목, 아티스트로 검색..."
        className="
          w-full
          px-6 py-4
          rounded-full
          shadow-sm
          focus:outline-none
          focus:ring-2 focus:ring-[#7c3aed]/40

          bg-white
          text-[#3b1d6a]
          placeholder-[#9b7ecb]

          dark:bg-[#111827]
          dark:text-gray-200
          dark:placeholder-gray-500
        "
      />

      </div>

      {/* 장르 탭 */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {GENRES.map(g => {
          const active = activeGenre === g.key;
          return (
            <button
              key={g.key}
              onClick={() => setActiveGenre(g.key)}
              className={`
                px-4 py-2
                rounded-full
                text-sm
                font-medium
                transition

                ${
                  active
                    ? `
                      bg-[#3b1d6a] text-white
                      dark:bg-purple-600 dark:text-white
                    `
                    : `
                      bg-white text-[#3b1d6a]
                      border border-[#3b1d6a]/30
                      hover:bg-[#f1ecfb]

                      dark:bg-[#111827]
                      dark:text-gray-300
                      dark:border-white/10
                      dark:hover:bg-white/10
                    `
                }
              `}
            >
              {g.label}
            </button>
          );
        })}
      </div>


      {/* 리스트 */}
      <ul className="divide-y divide-gray-200 dark:divide-white/10">
        {filtered.map((song, idx) => (
          <li
            key={song.id}
            className="flex items-center py-4 hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            <div className="w-8 text-sm text-gray-500">
              {idx + 1}
            </div>

            <div className="flex-1 min-w-0">
              <Link href={`/song/${song.id}`}>
                <span
                  className="
                    block text-lg font-medium truncate
                    cursor-pointer hover:underline
                  "
                  title={song.title}
                >
                  {song.title}
                </span>
              </Link>
            </div>

            <div className="hidden sm:block w-32 text-sm text-gray-400">
              {song.artist}
            </div>

            <div className="hidden md:block w-24 text-right">
              <span className="inline-block px-3 py-1 text-xs rounded-full bg-pink-500/20 text-pink-400">
                {song.genre}
              </span>
            </div>

            <div className="w-20 text-right">
              {song.clip && (
                <a
                  href={song.clip}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex items-center gap-1
                    px-3 py-1.5 rounded-full
                    bg-purple-600/20 text-purple-400
                    text-xs hover:bg-purple-600/30 transition
                  "
                >
                  ▶ CLIP
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

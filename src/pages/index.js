import { useState } from "react";
import Link from "next/link";
import { getAllSongs } from "../utils/getAllsongs";
import { sortByArtistThenTitle } from "../utils/sortSongs";

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
        <h1
          className="
            font-serif
            text-4xl md:text-5xl lg:text-6xl
            leading-tight
          "
        >
          Haren.R Songlist
        </h1>

        <p className="text-sm text-[#3b1d6a]/60 mt-3">
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
                    ? "bg-[#3b1d6a] text-white"
                    : `
                      bg-white text-[#3b1d6a]
                      border border-[#3b1d6a]/30
                      hover:bg-[#f1ecfb]
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
      <ul className="divide-y divide-[#3b1d6a]/10">
        {filtered.map((song, idx) => (
          <li
            key={song.id}
            className="flex items-center py-4 hover:bg-[#3b1d6a]/5 transition"
          >
            <div className="w-8 text-sm text-[#3b1d6a]/50">
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

            <div className="hidden sm:block w-32 text-sm text-[#3b1d6a]/60">
              {song.artist}
            </div>

            <div className="hidden md:block w-24 text-right">
              <span className="inline-block px-3 py-1 text-xs rounded-full bg-pink-500/20 text-pink-600">
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
                    bg-[#3b1d6a]/10 text-[#3b1d6a]
                    text-xs hover:bg-[#3b1d6a]/20 transition
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

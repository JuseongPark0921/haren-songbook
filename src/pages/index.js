import { useState } from "react";
import Link from "next/link";
import { getAllSongs } from "../utils/getAllsongs";  
import { sortByArtistThenTitle } from "../utils/sortSongs";

const GENRES = [
  { key: "ALL", label: "전체", match: () => true },
  { key: "JPOP", label: "J-POP", match: s => s.genre === "JPOP" },
  { key: "KPOP", label: "K-POP", match: s => s.genre === "KPOP" },
  { key: "POP", label: "POP", match: s => s.genre === "POP" },
  {
    key: "MUSICAL",
    label: "뮤지컬·성악",
    match: s =>
      s.genre === "뮤지컬/성악" ||
      s.genre === "뮤지컬" ||
      s.genre === "성악"
  }
];

export async function getStaticProps() {
  const songs = getAllSongs();

  return {
    props: {
      songs
    }
  };
}

export default function Home({ songs }) {
  const [activeGenre, setActiveGenre] = useState("ALL");
  const [query, setQuery] = useState("");

  const rule = GENRES.find(g => g.key === activeGenre);

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
      {/* 제목 */}
      <h1
        className="
          font-serif
          text-4xl
          md:text-5xl
          lg:text-6xl
          text-center
          mb-3
          leading-tight
        "
      >
        Haren.R Songlist
      </h1>


      <p className="text-center text-sm text-gray-400 mb-10">
        총 {songs.length}곡 · 선택된 곡 {filtered.length}곡
      </p>

      {/* 검색 */}
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="노래 제목, 아티스트로 검색..."
        className="
          w-full
          mb-8
          px-4 py-3
          rounded-xl
          bg-[#111827]
          text-sm
          placeholder-gray-500
          focus:outline-none
          focus:ring-1
          focus:ring-gray-500
        "
      />

      {/* 장르 탭 */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {GENRES.map(g => {
          const active = activeGenre === g.key;
          return (
            <button
              key={g.key}
              onClick={() => setActiveGenre(g.key)}
              className={`
                px-4 py-2 rounded-full text-sm transition
                ${
                  active
                    ? "bg-white text-black"
                    : "bg-[#111827] text-gray-400 hover:text-white"
                }
              `}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      {/* 리스트 */}
      <ul className="divide-y divide-gray-800">
        {filtered.map((song, idx) => (
          <li
            key={song.id}
            className="flex items-center py-4 hover:bg-white/5 transition"
          >
            {/* 번호 */}
            <div className="w-8 text-sm text-gray-500">
              {idx + 1}
            </div>

            {/* 제목 */}
            <div className="flex-1 min-w-0">
              <Link href={`/song/${song.id}`}>
                <span
                  className="
                    block
                    text-lg
                    font-medium
                    truncate
                    cursor-pointer
                    hover:underline
                  "
                  title={song.title}
                >
                  {song.title}
                </span>
              </Link>
            </div>

            {/* 아티스트 */}
            <div className="hidden sm:block w-32 text-sm text-gray-400">
              {song.artist}
            </div>

            {/* 장르 */}
            <div className="hidden md:block w-24 text-right">
              <span className="inline-block px-3 py-1 text-xs rounded-full bg-pink-500/20 text-pink-400">
                {song.genre}
              </span>
            </div>

            {/* CLIP */}
            <div className="w-20 text-right">
              {song.clip ? (
                <a
                  href={song.clip}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-600/20 text-purple-400 text-xs hover:bg-purple-600/30 transition"
                >
                  ▶ CLIP
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

    </main>
  );
}

import { useState } from "react";
import Link from "next/link";
import { getAllSongs } from "../utils/getAllsongs";
import { useRouter } from "next/router";

const GENRES = [
  { key: "ALL", label: "전체" },
  { key: "JPOP", label: "J-POP" },
  { key: "KPOP", label: "K-POP" },
  { key: "POP", label: "POP" },
  { key: "뮤지컬/성악", label: "뮤지컬·성악" }
];

export async function getStaticProps() {
  const songs = getAllSongs();
  return { props: { songs } };
}

export default function Home({ songs }) {
  const [activeGenre, setActiveGenre] = useState("ALL");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("title"); // "title" | "artist"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"

  const sortSongs = (songs) => {
    return [...songs].sort((a, b) => {
      const A = String(a[sortKey] ?? "").toLowerCase();
      const B = String(b[sortKey] ?? "").toLowerCase();
  
      if (A < B) return sortOrder === "asc" ? -1 : 1;
      if (A > B) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };
  
  
  const filtered = sortSongs(
    songs.filter(song => {
      const matchGenre =
        activeGenre === "ALL" || song.genre === activeGenre;
  
      const matchQuery = `${song.title} ${song.artist}`
        .toLowerCase()
        .includes(query.toLowerCase());
  
      return matchGenre && matchQuery;
    })
  );


  const router = useRouter();

  const goRandomSong = () => {
    const randomIndex = Math.floor(Math.random() * songs.length);
    router.push(`/song/${songs[randomIndex].id}`);
  };

  return (
    <main className="w-full max-w-screen-xl mx-auto px-6 py-16">
      <div className="flex items-center justify-end gap-4 mb-4">
        <Link
          href="/admin"
          className="
            inline-flex items-center gap-2
            px-4 py-2 rounded-full
            text-sm font-medium
            bg-[#3b1d6a]/10 text-[#3b1d6a]
            hover:bg-[#3b1d6a]/20
            transition
          "
        >
          ✏️ 곡 관리
        </Link>
      </div>

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

        {/* 채널 링크 */}
        <div className="flex justify-center mb-6">
          <Link
            href="https://chzzk.naver.com/11f9a14c3439b7b1ceadd819d61624da" 
            target="_blank"
            rel="noopener noreferrer"
            className="
              px-4 py-2
              roundde-full
              hover:bg-[#3b1d6a]/10
              transition
              flex items-center gap-2
            "
          >
            <img src="/icons/chzzk-icon.png" alt="Chzzk" className="w-5 h-5" /> Live
          </Link>

          <Link
            href="https://www.youtube.com/@haren_rubeos" 
            target="_blank"
            rel="noopener noreferrer"
            className="
              px-4 py-2
              roundde-full
              hover:bg-[#3b1d6a]/10
              transition
              flex items-center gap-2
            "
          >
            <img src="/icons/youtube-icon.png" alt="Youtube" className="w-5 h-auto" /> Channel
          </Link>

          <Link
            href="https://cafe.naver.com/statopen" 
            target="_blank"
            rel="noopener noreferrer"
            className="
              px-4 py-2
              roundde-full
              hover:bg-[#3b1d6a]/10
              transition
              flex items-center gap-2
            "
          >
            <img src="/icons/cafe-logo.webp" alt="Ncafe" className="w-5 h-5" /> Cafe
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button
            onClick={goRandomSong}
            className="px-6 py-3 rounded-full
            bg-[#3b1d6a]/10
            text-white
            text-sm
            font-medium
            hover:bg-[#2d1654]
            transition
            flex items-center gap-2
            "
          >
            🎲Feel Lucky?
          </button>

          <Link
            href="/Archive" 
            className="px-6 py-3 rounded-full
            bg-[#3b1d6a]/10
            text-white
            text-sm
            font-medium
            hover:bg-[#2d1654]
            transition
            flex items-center gap-2
            "
          >
          📼 노래방 아카이브
          </Link>
        </div>

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
      {/* 리스트 헤더 */}
      <div className="
        border-b border-[#3b1d6a]/20
        sticky top-0 z-10
        bg-[#f4effc]
      ">

        <div className="flex items-center py-4 text-base font-medium text-[#3b1d6a]/70">

          {/* 번호 */}
          <div className="w-8 text-left">
            #
          </div>

          {/* 제목 */}
          <button
            onClick={() => {
              setSortKey("title");
              setSortOrder(
                sortKey === "title" && sortOrder === "asc" ? "desc" : "asc"
              );
            }}
            className="flex-1 text-left hover:underline"
          >
            제목
            {sortKey === "title" && (
              <span className="ml-1">
                {sortOrder === "asc" ? "▲" : "▼"}
              </span>
            )}
          </button>

          {/* 아티스트 */}
          <button
            onClick={() => {
              setSortKey("artist");
              setSortOrder(
                sortKey === "artist" && sortOrder === "asc" ? "desc" : "asc"
              );
            }}
            className="hidden sm:block w-64 text-left hover:underline"
          >
            아티스트
            {sortKey === "artist" && (
              <span className="ml-1">
                {sortOrder === "asc" ? "▲" : "▼"}
              </span>
            )}
          </button>

          {/* 장르 */}
          <div className="hidden md:block w-24 text-right">
            장르
          </div>

          {/* 클립 */}
          <div className="w-20 text-right">
            클립
          </div>

        </div>
      </div>

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

            <div className="hidden sm:block w-32 text-sm text-[#3b1d6a]/60">
              {song.level}
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

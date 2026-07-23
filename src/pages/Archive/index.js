import fs from "fs";
import path from "path";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  MEMBER_FILTERS,
  getMemberLabels,
  matchesMemberFilter,
  normalizeMembers,
} from "../../lib/members";


/* =========================
   빌드 타임 데이터 로드
   ========================= */
export async function getStaticProps() {
  const baseDir = path.join(
    process.cwd(),
    "src/pages/Archive/archivedata"
  );

  const indexPath = path.join(
    process.cwd(),
    "src/pages/Archive/archive-index.json"
  );
  let titleByDate = {};

  if (fs.existsSync(indexPath)) {
    const indexList = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
    titleByDate = Object.fromEntries(
      indexList.map(item => [item.date, item.title])
    );
  }

  const detailFiles = fs
    .readdirSync(baseDir)
    .filter(file => /^\d{4}-\d{2}-\d{2}\.json$/.test(file));

  const list = detailFiles
    .map(file => {
      const detailPath = path.join(baseDir, file);
      const data = JSON.parse(fs.readFileSync(detailPath, "utf-8"));
      const members = normalizeMembers(data.members ?? data.member);

      return {
        date: data.date,
        title: data.title || titleByDate[data.date] || data.date,
        members,
        file
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const detailMap = {};
  for (const item of list) {
    const detailPath = path.join(baseDir, item.file);
    const detail = JSON.parse(fs.readFileSync(detailPath, "utf-8"));
    detailMap[item.date] = {
      ...detail,
      members: normalizeMembers(detail.members ?? detail.member),
    };
  }

  return {
    props: {
      list,
      detailMap
    }
  };
}

/* =========================
   유틸: 시간 → 초
   ========================= */
function timeToSeconds(time) {
  const parts = time.split(":").map(Number);
  if (parts.length === 2) {
    const [m, s] = parts;
    return m * 60 + s;
  }
  const [h, m, s] = parts;
  return h * 3600 + m * 60 + s;
}

/* =========================
   페이지 컴포넌트
   ========================= */
export default function Archive({ list, detailMap }) {
  const [selectedDate, setSelectedDate] = useState(
    list.length > 0 ? list[0].date : null
  );
  const [activeMember, setActiveMember] = useState("ALL");

  const [videoStart, setVideoStart] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [toast, setToast] = useState(null);
  const filteredList = useMemo(
    () => list.filter(item => matchesMemberFilter(item, activeMember)),
    [activeMember, list]
  );
  const selectedArchive =
    filteredList.find(item => item.date === selectedDate) ?? filteredList[0];
  const selectedArchiveDate = selectedArchive?.date ?? null;

  if (!selectedArchiveDate) {
    return (
      <main className="w-full mx-auto px-8 py-16 text-[#3b1d6a]">
        <div className="flex flex-wrap gap-2 mb-6">
          {MEMBER_FILTERS.map(member => {
            const active = activeMember === member.key;
            return (
              <button
                key={member.key}
                onClick={() => {
                  setActiveMember(member.key);
                  setCurrentSongIndex(null);
                  setVideoStart(0);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition
                  ${
                    active
                      ? "bg-[#3b1d6a] text-white"
                      : "bg-white text-[#3b1d6a] border border-[#3b1d6a]/30 hover:bg-[#f1ecfb]"
                  }`}
              >
                {member.label}
              </button>
            );
          })}
        </div>
        <p className="mb-4">선택한 멤버의 아카이브 데이터가 없습니다.</p>
        <Link
          href="/archive-admin"
          className="text-sm text-[#3b1d6a]/70 hover:text-[#3b1d6a] transition"
        >
          ✏️ 아카이브 수정 페이지로 이동
        </Link>
      </main>
    );
  }

  const detail = detailMap[selectedArchiveDate];
  if (!detail) {
    return (
      <main className="w-full mx-auto px-8 py-16 text-[#3b1d6a]">
        데이터를 불러올 수 없습니다.
      </main>
    );
  }

  const isYoutube = detail.platform === "youtube";
  const memberLabels = getMemberLabels(detail);

  /* =========================
     노래 클릭 (유튜브만)
     ========================= */
  const handleSongClick = (song, index) => {
    if (!song.time || song.time === "TBD") {
      setToast("⏱ 아직 타임스탬프가 없는 곡입니다.");
      setTimeout(() => setToast(null), 2000);
      return;
    }

    setCurrentSongIndex(index);
    setVideoStart(timeToSeconds(song.time));
  };

  return (
    <main className="w-full h-screen overflow-hidden px-8 py-16 text-[#3b1d6a]">
      <div className="flex flex-col h-full overflow-hidden">

        {/* 상단 네비게이션 */}
        <div className="flex items-center justify-between gap-4 mb-4 shrink-0">
          <Link
            href="/"
            className="
              inline-flex items-center gap-2
              text-sm text-[#3b1d6a]/70
              hover:text-[#3b1d6a]
              transition
            "
          >
            ← 노래책으로 돌아가기
          </Link>

          <Link
            href="/archive-admin"
            className="
              inline-flex items-center gap-2
              px-4 py-2 rounded-full
              text-sm font-medium
              bg-[#3b1d6a]/10 text-[#3b1d6a]
              hover:bg-[#3b1d6a]/20
              transition
            "
          >
            ✏️ 아카이브 수정
          </Link>
        </div>

        {/* 헤더 + 설명 */}
        <header className="mb-6 shrink-0">
          <h1 className="text-5xl font-serif mb-4 font-bold">
            🎧 노래방 아카이브
          </h1>

          <div className="text-sm text-[#3b1d6a]/60 space-y-1">
            <p>날짜를 선택하면 해당 방송의 노래 목록을 볼 수 있습니다.</p>
            <p>
              치지직의 경우 링크를 통한 타임스탬프 기능이 없어,
              다시보기에는 타임스탬프가 제공되지 않습니다.
            </p>
            <p>
              대신 다시보기 댓글에 달려 있는 타임스탬프를 클릭하면
              해당 시간대로 이동할 수 있습니다.
            </p>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 mb-4 shrink-0">
          {MEMBER_FILTERS.map(member => {
            const active = activeMember === member.key;
            return (
              <button
                key={member.key}
                onClick={() => {
                  setActiveMember(member.key);
                  setCurrentSongIndex(null);
                  setVideoStart(0);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition
                  ${
                    active
                      ? "bg-[#3b1d6a] text-white"
                      : "bg-white text-[#3b1d6a] border border-[#3b1d6a]/30 hover:bg-[#f1ecfb]"
                  }`}
              >
                {member.label}
              </button>
            );
          })}
        </div>

        {/* =========================
            본문 (3단 레이아웃)
          ========================= */}
        <section className="flex gap-8 flex-1 overflow-hidden">

          {/* 좌측: 날짜 리스트 (스크롤) */}
          <aside className="w-64 shrink-0 h-full overflow-y-auto pr-2">
            <ul className="space-y-2">
              {filteredList.map(item => (
                <li
                  key={item.date}
                  onClick={() => {
                    setSelectedDate(item.date);
                    setCurrentSongIndex(null);
                    setVideoStart(0);
                  }}
                  className={`px-4 py-3 rounded-lg cursor-pointer transition
                    ${
                      selectedArchiveDate === item.date
                        ? "bg-[#3b1d6a]/20 font-semibold"
                        : "hover:bg-[#3b1d6a]/10"
                    }`}
                >
                  <div>{item.title}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {getMemberLabels(item).map(label => (
                      <span
                        key={label}
                        className="inline-block px-2 py-0.5 text-[11px] rounded-full bg-[#3b1d6a]/10 text-[#3b1d6a]/70"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          {/* 중앙: 영상 (고정) */}
          <div className="flex-1 shrink-0 h-full overflow-hidden">
            <div className="aspect-video rounded-xl overflow-hidden bg-black/40">
              <iframe
                src={
                  isYoutube
                    ? `${detail.embedUrl}?start=${videoStart}`
                    : detail.embedUrl
                }
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* 우측: 노래 리스트 (스크롤) */}
          <aside className="w-[380px] shrink-0 h-full overflow-y-auto pr-3">
            <h2 className="text-lg font-medium mb-4">
              🎵 노래 리스트
              <span className="ml-2 text-sm text-[#3b1d6a]/60">
                ({detail.songs.length}곡)
              </span>
              <span className="ml-2 text-sm text-[#3b1d6a]/60">
                {memberLabels.join(", ")}
              </span>
              {!isYoutube && (
                <span className="ml-2 text-sm text-[#3b1d6a]/60">
                </span>
              )}
            </h2>

            <ul className="divide-y divide-[#3b1d6a]/10">
              {detail.songs.map((s, i) => {
                const clickable = isYoutube && s.time && s.time !== "TBD";

                return (
                  <li
                    key={i}
                    onClick={
                      clickable ? () => handleSongClick(s, i) : undefined
                    }
                    className={`py-3 flex gap-4 transition
                      ${
                        clickable
                          ? currentSongIndex === i
                            ? "bg-[#3b1d6a]/15 font-semibold cursor-pointer"
                            : "hover:bg-[#3b1d6a]/10 cursor-pointer"
                          : "opacity-70"
                      }
                    `}
                  >
                    <span className="w-20 text-[#3b1d6a]/50">
                      {s.time ?? "TBD"}
                    </span>
                    <span>{s.title}</span>
                  </li>
                );
              })}
            </ul>
          </aside>
        </section>
      </div>

      {/* 토스트 */}
      {toast && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2
                    bg-[#3b1d6a] text-white px-4 py-2
                    rounded-full shadow-lg text-sm"
        >
          {toast}
        </div>
      )}
    </main>

  );
}

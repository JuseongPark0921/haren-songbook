import fs from "fs";
import path from "path";
import { useState } from "react";
import Link from "next/link";


/* =========================
   鍮뚮뱶 ????곗씠??濡쒕뱶
   ========================= */
export async function getStaticProps() {
  const baseDir = path.join(
    process.cwd(),
    "src/pages/Archive/archivedata"
  );

  // ?좎쭨 紐⑸줉
  const indexPath = path.join(baseDir, "index.json");
  const list = JSON.parse(fs.readFileSync(indexPath, "utf-8"));

  // ?좎쭨蹂??곸꽭 ?곗씠??  const detailMap = {};
  for (const item of list) {
    const detailPath = path.join(baseDir, item.file);
    detailMap[item.date] = JSON.parse(
      fs.readFileSync(detailPath, "utf-8")
    );
  }

  return {
    props: {
      list,
      detailMap
    }
  };
}

/* =========================
   ?좏떥: ?쒓컙 ??珥?   ========================= */
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
   ?섏씠吏 而댄룷?뚰듃
   ========================= */
export default function Archive({ list, detailMap }) {
  const [selectedDate, setSelectedDate] = useState(
    list.length > 0 ? list[0].date : null
  );

  const [videoStart, setVideoStart] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [toast, setToast] = useState(null);

  if (!selectedDate) {
    return (
      <main className="w-full mx-auto px-8 py-16 text-[#3b1d6a]">
        ?꾩뭅?대툕 ?곗씠?곌? ?놁뒿?덈떎.
      </main>
    );
  }

  const detail = detailMap[selectedDate];
  if (!detail) {
    return (
      <main className="w-full mx-auto px-8 py-16 text-[#3b1d6a]">
        ?곗씠?곕? 遺덈윭?????놁뒿?덈떎.
      </main>
    );
  }

  const isYoutube = detail.platform === "youtube";

  /* =========================
     ?몃옒 ?대┃ (?좏뒠釉뚮쭔)
     ========================= */
  const handleSongClick = (song, index) => {
    if (!song.time || song.time === "TBD") {
      setToast("???꾩쭅 ??꾩뒪?ы봽媛 ?녿뒗 怨≪엯?덈떎.");
      setTimeout(() => setToast(null), 2000);
      return;
    }

    setCurrentSongIndex(index);
    setVideoStart(timeToSeconds(song.time));
  };

  return (
    <main className="w-full h-screen overflow-hidden px-8 py-16 text-[#3b1d6a]">
      <div className="flex flex-col h-full overflow-hidden">

        {/* ?뵗 ?ㅻ줈媛湲?*/}
        <Link
          href="/"
          className="
            inline-flex items-center gap-2
            text-sm text-[#3b1d6a]/70
            hover:text-[#3b1d6a]
            transition
            mb-4
          "
        >
          ???몃옒梨낆쑝濡??뚯븘媛湲?        </Link>

        {/* ?ㅻ뜑 + ?ㅻ챸 */}
        <header className="mb-6 shrink-0">
          <h1 className="text-5xl font-serif mb-4 font-bold">
            ?렒 ?몃옒諛??꾩뭅?대툕
          </h1>

          <div className="text-sm text-[#3b1d6a]/60 space-y-1">
            <p>?좎쭨瑜??좏깮?섎㈃ ?대떦 諛⑹넚???몃옒 紐⑸줉??蹂????덉뒿?덈떎.</p>
            <p>
              移섏?吏곸쓽 寃쎌슦 留곹겕瑜??듯븳 ??꾩뒪?ы봽 湲곕뒫???놁뼱,
              ?ㅼ떆蹂닿린?먮뒗 ??꾩뒪?ы봽媛 ?쒓났?섏? ?딆뒿?덈떎.
            </p>
            <p>
              ????ㅼ떆蹂닿린 ?볤????щ젮 ?덈뒗 ??꾩뒪?ы봽瑜??대┃?섎㈃
              ?대떦 ?쒓컙?濡??대룞?????덉뒿?덈떎.
            </p>
          </div>
        </header>

        {/* =========================
            蹂몃Ц (3???덉씠?꾩썐)
          ========================= */}
        <section className="flex gap-8 flex-1 overflow-hidden">

          {/* 醫뚯륫: ?좎쭨 由ъ뒪??(?ㅽ겕濡? */}
          <aside className="w-64 shrink-0 h-full overflow-y-auto pr-2">
            <ul className="space-y-2">
              {list.map(item => (
                <li
                  key={item.date}
                  onClick={() => {
                    setSelectedDate(item.date);
                    setCurrentSongIndex(null);
                    setVideoStart(0);
                  }}
                  className={`px-4 py-3 rounded-lg cursor-pointer transition
                    ${
                      selectedDate === item.date
                        ? "bg-[#3b1d6a]/20 font-semibold"
                        : "hover:bg-[#3b1d6a]/10"
                    }`}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </aside>

          {/* 以묒븰: ?곸긽 (怨좎젙) */}
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

          {/* ?곗륫: ?몃옒 由ъ뒪??(?ㅽ겕濡? */}
          <aside className="w-[380px] shrink-0 h-full overflow-y-auto pr-3">
            <h2 className="text-lg font-medium mb-4">
              ?렦 ?몃옒 由ъ뒪??              <span className="ml-2 text-sm text-[#3b1d6a]/60">
                ({detail.songs.length}怨?
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

      {/* ?좎뒪??*/}
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

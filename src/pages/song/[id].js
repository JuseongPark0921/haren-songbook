import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

/**
 * 어떤 id 페이지를 만들지 Next.js에게 알려줌
 */
const SONG_DIR = path.join(
    process.cwd(),
    "src",
    "songlists",
    "songs"
  );
  
  export async function getStaticPaths() {
    const files = fs.readdirSync(SONG_DIR);
  
    const paths = files
      .filter(file => file.endsWith(".md"))
      .map(file => ({
        params: {
          id: file.replace(/\.md$/, "")
        }
      }));
  
    return {
      paths,
      fallback: false
    };
  }

/**
 * 각 노래 페이지에 들어갈 데이터를 준비
 */
export async function getStaticProps({ params }) {
  const filePath = path.join(
    process.cwd(),
    "src",
    "songlists",
    "songs",
    `${params.id}.md`
  );

  const fileContent = fs.readFileSync(filePath, "utf-8");

  const { data, content } = matter(fileContent);

  const processedContent = await remark()
    .use(html)
    .process(content);

  return {
    props: {
      frontmatter: data,
      contentHtml: processedContent.toString()
    }
  };
}

/**
 * 실제 화면에 그리는 컴포넌트
 */
import { useRouter } from "next/router";

export default function SongPage({ frontmatter, contentHtml }) {
  const router = useRouter();
  const { title, artist, genre, clip, mr, covers } = frontmatter ?? {};

  return (
    <main className="w-full max-w-screen-2xl mx-auto px-6 py-8">
      {/* 상단 헤더 */}
      <header className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl mb-2">
            {title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>{artist}</span>
            {genre && (
              <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 text-xs">
                {genre}
              </span>
            )}
          </div>
        </div>

        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-400 hover:text-white"
        >
          ← 뒤로가기
        </button>
      </header>

      {/* 카드 영역 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 가사 카드 */}
        <div className="
          relative rounded-2xl
          border border-purple-500/40
          bg-gradient-to-b from-[#141c2f] to-[#0f1628]
          h-[60vh] overflow-hidden
        ">
          <div className="absolute inset-0 p-6 overflow-y-auto">
            <div
              className="prose prose-invert max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>
        </div>

        {/* MR / Clip / Cover 카드 */}
        <div className="
          rounded-2xl
          border border-purple-500/40
          bg-gradient-to-b from-[#141c2f] to-[#0f1628]
          h-[60vh]
          flex flex-col justify-center
          px-6
        ">
          {(clip || mr || (covers && covers.length > 0)) ? (
            <div className="space-y-4 w-full">
              {/* CLIP */}
              {clip && (
                <a
                  href={clip}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    block w-full px-4 py-3 rounded-xl
                    bg-purple-600/20 text-purple-300
                    hover:bg-purple-600/30 transition
                    text-center
                  "
                >
                  ▶ 클립 열기
                </a>
              )}

              {/* MR */}
              {mr && (
                <a
                  href={mr}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    block w-full px-4 py-3 rounded-xl
                    bg-purple-600/20 text-purple-300
                    hover:bg-purple-600/30 transition
                    text-center
                  "
                >
                  🎧 MR 열기
                </a>
              )}

              {/* Cover 섹션 */}
              {covers && covers.length > 0 && (
                <div className="pt-3 border-t border-white/10">
                  <div className="text-xs text-gray-400 mb-2">
                    🎤 Cover
                  </div>

                  <div className="space-y-2">
                    {covers.map((cover, idx) => (
                      <a
                        key={idx}
                        href={cover.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          block w-full px-4 py-2 rounded-lg
                          bg-white/5 text-gray-200
                          hover:bg-white/10 transition
                          text-sm
                        "
                      >
                        {cover.title || `Cover ${idx + 1}`}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="text-5xl mb-4 text-center">🎵</div>
              <p className="text-gray-400 mb-4 text-center">
                MR 영상을 검색해보세요
              </p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  `${title} MR`
                )}`}
                target="_blank"
                className="
                  mx-auto
                  px-5 py-3
                  rounded-full
                  bg-purple-600
                  text-white
                  hover:bg-purple-500
                  transition
                "
              >
                🔍 MR 검색하기
              </a>
            </>
          )}
        </div>
      </section>
    </main>
  );
}


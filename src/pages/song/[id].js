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

          <div className="flex items-center gap-3 text-sm text-[#3b1d6a]/60">
            <span>{artist}</span>
            {genre && (
              <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-600 text-xs">
                {genre}
              </span>
            )}
          </div>
        </div>

        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => router.back()}
          className="text-sm text-[#3b1d6a]/60 hover:text-[#3b1d6a]"
        >
          ← 뒤로가기
        </button>
      </header>

      {/* 카드 영역 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 가사 카드 */}
        <div
          className="
            relative
            rounded-2xl
            border
            bg-white
            border-[#3b1d6a]/20
            h-[65vh]
            overflow-hidden
          "
        >
          <div className="absolute inset-0 p-6 overflow-y-auto">
            <div
                className="
                prose
                max-w-none
                leading-loose
                prose-p:my-2
                text-[#3b1d6a]
                prose-p:text-[#3b1d6a]
                prose-headings:text-[#3b1d6a]
              "
              
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>
        </div>

        {/* MR / Clip / Cover 카드 */}
        <div
          className="
            rounded-2xl
            border
            bg-white
            border-[#3b1d6a]/20
            h-[65vh]
            flex flex-col
            px-6 py-6
          "
        >
          {/* 위쪽 콘텐츠 */}
          <div className="flex-1 space-y-4 w-full">
            {/* CLIP */}
            {clip && (
              <a
                href={clip}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  block w-full px-4 py-3 rounded-xl
                  bg-[#3b1d6a]/10 text-[#3b1d6a]
                  hover:bg-[#3b1d6a]/20
                  transition
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
                  bg-[#6b4aa0]
                  text-white
                  hover:bg-[#59378f]
                  transition
                  text-center
                  text-sm
                "
              >
                🎧 MR 열기
              </a>
            )}

            {/* Cover 섹션 */}
            {covers && covers.length > 0 && (
              <div className="pt-3 border-t border-[#3b1d6a]/20">
                <div className="text-xs text-[#3b1d6a]/60 mb-2">
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
                        bg-[#3b1d6a]/5 text-[#3b1d6a]
                        hover:bg-[#3b1d6a]/10
                        transition
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

          {/* 🔽 항상 하단에 MR 검색 */}
          <div className="pt-6 border-t border-[#3b1d6a]/20">
            <div className="flex flex-col items-center text-center">
              <div className="text-3xl mb-2">🎵</div>

              <p className="text-sm text-[#3b1d6a]/60 mb-4">
                MR 영상을 검색해보세요
              </p>

              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  `${title} MR`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  px-6 py-3
                  rounded-full
                  bg-[#3b1d6a]
                  text-white
                  hover:bg-[#2d1654]
                  transition
                  flex items-center gap-2
                "
              >
                🔍 MR 검색하기
              </a>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}

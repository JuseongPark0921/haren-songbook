// 언어 판별
function detectLanguage(str = "") {
    if (/[A-Za-z]/.test(str)) return "EN";          // 영어
    if (/[가-힣]/.test(str)) return "KO";           // 한국어
    if (/[ぁ-んァ-ン一-龯]/.test(str)) return "JA"; // 일본어
    return "ETC";
  }
  
  const LANG_ORDER = {
    EN: 0,
    KO: 1,
    JA: 2,
    ETC: 3
  };
  
  export function sortByArtistThenTitle(a, b) {
    const artistA = a.artist || "";
    const artistB = b.artist || "";
  
    const langA = detectLanguage(artistA);
    const langB = detectLanguage(artistB);
  
    // 1️⃣ 언어 우선순위
    if (LANG_ORDER[langA] !== LANG_ORDER[langB]) {
      return LANG_ORDER[langA] - LANG_ORDER[langB];
    }
  
    // 2️⃣ 아티스트 이름 정렬
    const locale =
      langA === "KO" ? "ko" :
      langA === "JA" ? "ja" : "en";
  
    const artistCompare = artistA.localeCompare(
      artistB,
      locale,
      { sensitivity: "base" }
    );
  
    if (artistCompare !== 0) return artistCompare;
  
    // 3️⃣ 같은 아티스트면 제목 정렬
    return (a.title || "").localeCompare(
      b.title || "",
      locale,
      { sensitivity: "base" }
    );
  }
  
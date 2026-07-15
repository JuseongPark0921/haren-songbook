# Pre-CMS Production Backup (2026-07-15)

이 폴더는 Decap CMS 도입 **이전** 프로덕션 설정의 백업입니다.

## 백업된 파일 (git commit `0382bc5` 기준)

| 파일 | 설명 |
|---|---|
| `src/pages/Archive/index.js` | 아카이브가 `archivedata/index.json`만 읽던 이전 로더 |
| `src/pages/Archive/archivedata/index.json` | 방송 목록 인덱스 (이후 `archive-index.json`으로 이동) |
| `next.config.mjs` | CMS rewrite 없던 이전 설정 |
| `package.json` | decap-server/concurrently 추가 전 |

## 신규 프로덕션 구조 (배포 후)

| URL | 용도 |
|---|---|
| `/admin` | 노래책 CMS (비밀번호 + GitHub OAuth) |
| `/archive-admin` | 노래방 아카이브 CMS (공개) |
| `/Archive` | 공개 아카이브 페이지 |

## Vercel 환경 변수 (배포 후 필수 설정)

| 변수 | 설명 |
|---|---|
| `CMS_SONGS_PASSWORD` | 노래책 CMS 비밀번호 (예: `0510`) |
| `GITHUB_CLIENT_ID` | 노래책 GitHub OAuth |
| `GITHUB_CLIENT_SECRET` | 노래책 GitHub OAuth |
| `GITHUB_ARCHIVE_TOKEN` | 아카이브 CMS용 PAT (`archivedata/**` write만) |
| `NEXT_PUBLIC_SITE_URL` | `https://haren-songbook.vercel.app` |

## 되돌리기

```bash
git checkout backup/pre-cms-production-2026-07-15 -- src/pages/Archive/index.js
# 또는 이 폴더 파일을 수동 복원 후 재배포
```

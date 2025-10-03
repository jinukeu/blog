# Draft 글 작성 기능 사용 가이드

## 🎯 개요

로컬 환경에서 Draft 글을 작성하고, 마크다운 실시간 프리뷰를 확인하며, 이미지를 드래그 앤 드롭으로 추가할 수 있는 기능입니다.

## 📁 파일 구조

```
/drafts/               # Draft 마크다운 파일 (Git 추적 ✅)
/public/images/drafts/ # Draft 이미지 (Git 추적 ✅)
/posts/                # 발행된 글 (Git 추적 ✅)
/public/images/posts/  # 발행된 글 이미지 (Git 추적 ✅)
```

## 🚀 사용 방법

### 1. 개발 서버 실행

```bash
npm run dev
```

서버 실행 후 브라우저에서 `http://localhost:3000` 접속

### 2. Draft 관리 페이지 접근

Admin 페이지: `http://localhost:3000/admin/drafts`

**주의**: 프로덕션 환경에서는 `/admin` 경로가 404로 차단됩니다 (로컬 전용)

### 3. 새 Draft 작성

1. "새 Draft 작성" 버튼 클릭 또는 `/admin/drafts/new` 접속
2. 제목, 요약, 태그 입력
3. 마크다운 에디터에서 내용 작성
   - **실시간 프리뷰**: 오른쪽에서 실시간으로 확인
   - **이미지 드래그 앤 드롭**: 에디터에 이미지 파일 드래그
   - **클립보드 붙여넣기**: 캡처한 이미지 `Ctrl+V` 또는 `Cmd+V`
4. "저장" 버튼 클릭

### 4. Draft 편집

1. Draft 목록에서 "편집" 버튼 클릭
2. 내용 수정 후 "저장"

### 5. Draft 발행

1. Draft 목록에서 "발행" 버튼 클릭
2. 확인 메시지에서 "확인"
3. Draft → Posts로 자동 이동
   - `/drafts/xxx.md` → `/posts/xxx.md`
   - `/public/images/drafts/xxx.png` → `/public/images/posts/xxx.png`
   - 마크다운 내 이미지 경로 자동 변경
4. Git commit & push로 블로그에 배포

```bash
git add .
git commit -m "Publish: 새 글 제목"
git push
```

### 6. Draft 삭제

1. Draft 목록에서 "삭제" 버튼 클릭
2. 확인 메시지에서 "확인"

## ✨ 주요 기능

### 1. 마크다운 에디터
- **Split View**: 왼쪽 에디터 | 오른쪽 실시간 프리뷰
- **Syntax Highlighting**: 코드 블록 자동 하이라이팅
- **GFM 지원**: GitHub Flavored Markdown

### 2. 이미지 업로드
- **드래그 앤 드롭**: 이미지를 에디터에 드래그
- **클립보드 붙여넣기**: 스크린샷 캡처 후 `Ctrl+V` / `Cmd+V`
- **자동 경로 삽입**: `![이미지](경로)` 자동 생성
- **지원 형식**: PNG, JPG, GIF, WebP
- **파일 크기 제한**: 5MB

### 3. Git 동기화
- Draft 마크다운: GitHub에 자동 저장 ✅
- Draft 이미지: GitHub에 자동 저장 ✅
- 여러 컴퓨터에서 동기화 가능

### 4. 블로그 분리
- `/posts`만 블로그에 표시
- Draft는 숨김 처리 (공개 안 됨)

## 📝 워크플로우

```
1. Draft 작성 (로컬)
   ↓
2. 이미지 드래그 앤 드롭
   ↓
3. 실시간 프리뷰 확인
   ↓
4. 저장 → Git commit
   ↓
5. Draft 편집 (필요 시)
   ↓
6. 발행 → /posts로 이동
   ↓
7. Git commit & push
   ↓
8. Vercel 자동 배포
```

## 🔒 보안

- **로컬 전용**: Admin 페이지는 로컬 환경에서만 접근
- **프로덕션 차단**: Vercel 배포 시 `/admin` 경로 404 처리
- **이미지 검증**: 파일 타입 및 크기 제한
- **인증 불필요**: 로컬에서만 사용하므로 안전

## 🐛 문제 해결

### 이미지 업로드 실패
- 파일 크기가 5MB를 초과하는지 확인
- 지원되는 이미지 형식인지 확인 (PNG, JPG, GIF, WebP)

### Draft 목록이 비어있음
- `/drafts` 폴더에 `.md` 파일이 있는지 확인
- 개발 서버를 재시작해보세요

### 프리뷰가 제대로 안 보임
- 마크다운 문법이 올바른지 확인
- 브라우저 콘솔에서 에러 확인

## 🎨 커스터마이징

### 에디터 테마 변경
[src/components/MarkdownEditor.tsx](src/components/MarkdownEditor.tsx#L5)에서 `highlight.js` 테마 변경:

```typescript
import 'highlight.js/styles/github-dark.css'; // 다른 테마로 변경 가능
```

### 기본 작성자 변경
[src/app/admin/drafts/new/page.tsx](src/app/admin/drafts/new/page.tsx)와 [src/app/admin/drafts/[slug]/edit/page.tsx](src/app/admin/drafts/[slug]/edit/page.tsx)에서:

```typescript
author: '이진욱', // 여기를 변경
```

## 📚 참고 자료

- React Markdown: https://github.com/remarkjs/react-markdown
- Remark GFM: https://github.com/remarkjs/remark-gfm
- Rehype Highlight: https://github.com/rehypejs/rehype-highlight

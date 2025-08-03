# 입고묶기 웹 시스템

차량 입고 데이터 처리 및 출력을 위한 웹 애플리케이션

![입고묶기 시스템](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ 주요 기능

- 📊 **엑셀 스타일 데이터 입력**: 직관적인 표 형태의 데이터 입력 인터페이스
- 🔍 **실시간 검색**: 드래그 가능한 검색 드롭다운으로 빠른 차량 검색
- 🖨️ **완벽한 프린트 출력**: 실제 업무에 사용 가능한 고품질 출력 기능
- ⚙️ **사용자 설정**: 페이지당 출력 갯수 조정 (30-40개)
- 💾 **자동 저장**: 담당자명 및 설정 자동 저장
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 사용 경험

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: localStorage (설정 저장)

## 🚀 설치 및 실행

### 필수 요구사항
- Node.js 18 이상
- npm 또는 yarn

### 설치
```bash
# 저장소 클론
git clone https://github.com/anzpek/filebind.git
cd filebind

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

### 빌드
```bash
# 프로덕션 빌드
npm run build

# 정적 사이트 생성
npm run export
```

## 📖 사용 방법

### 1. 데이터 업로드
- Excel (.xlsx) 또는 CSV 파일 업로드
- 지원 형식: 사고번호, 서열, 관리번호, 피해자(물), 상태

### 2. 데이터 입력
- A열에 피해물 또는 사고번호 입력 (최소 2글자)
- 실시간 검색 결과에서 선택
- ↑↓ 키로 선택, Enter로 확인

### 3. 출력 설정
- 담당자명 변경
- 페이지당 출력 갯수 조정 (30-40개)

### 4. 인쇄
- "인쇄하기" 버튼 클릭
- 브라우저 인쇄 기능으로 PDF 저장 가능

## 🎨 주요 특징

### 드래그 가능한 검색 드롭다운
- 📌 아이콘을 드래그하여 위치 이동 가능
- 검색 결과 개수에 따른 동적 크기 조정
- 최대 5개 결과 표시, 초과 시 스크롤

### 스마트 검색
- 실시간 검색 결과 표시
- 중복 선택 방지 및 경고
- 키보드 네비게이션 지원

### 완벽한 출력
- 실제 업무용 문서 품질
- 페이지 분할 자동 처리
- 담당자 정보 자동 포함

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── globals.css          # 전역 스타일
│   ├── layout.tsx           # 루트 레이아웃
│   └── page.tsx            # 메인 페이지
├── components/
│   ├── DataUpload.tsx      # 데이터 업로드
│   ├── ExcelStyleInput.tsx # 엑셀 스타일 입력
│   ├── TablePrintButton.tsx # 인쇄 버튼
│   └── TablePrintLayout.tsx # 인쇄 레이아웃
├── types/
│   └── index.ts            # 타입 정의
└── utils/
    ├── csvParser.ts        # CSV 파싱
    └── searchUtils.ts      # 검색 유틸리티
```

## 🤖 개발 정보

이 프로젝트는 Claude Code AI와 함께 개발되었습니다.

**Co-Authored-By: Claude <noreply@anthropic.com>**

## 📄 라이선스

MIT License

## 🚨 주의사항

- Excel 파일이 열려있으면 업로드가 실패할 수 있습니다
- 브라우저 호환성: Chrome, Firefox, Safari, Edge 권장
- 인쇄 시 "배경 그래픽 인쇄" 옵션 활성화 권장

---

**Made with ❤️ for 효율적인 업무 처리**
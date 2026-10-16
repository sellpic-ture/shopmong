// Evidence is scoped per field. App compression/slicing settings are not upload policies.
export type OutputFormat = "jpg" | "png" | "webp";
export type PlatformPreset = {
  id: string;
  name: string;
  thumbnail: { width: number; height: number; sizeText: string; maxSize: string; maxBytes: number | null; format: string; allowedOutputs: OutputFormat[] | null };
  detail: { width: number; maxHeight: number; sizeText: string; height: string; maxSize: string; maxBytes: number | null };
  evidence: { status: string; summary: string; sources: { label: string; url: string }[] };
};
export const platforms: PlatformPreset[] = [
  {
    evidence: {
      status: "공식 근거 일부 확인",
      summary: "대표이미지 1,000×1,000px 권장(공식 API 문서). 상품 이미지 업로드 API는 JPEG·GIF·PNG·BMP를 지원합니다. WebP 지원은 확인되지 않아 대표이미지 출력에서 제외했습니다. 상세 폭·분할 높이·파일당 용량은 앱 설정이며 최신 판매자 정책 전체가 검증된 것은 아닙니다.",
      sources: [
        { label: "공식 권장 크기 문서 (2.0.0-RC)", url: "https://github.com/commerce-api-naver/commerce-api/blob/8f61814521ef15794e2ad0578e3ce768db9c3425/docs/2.0.0-RC.js" },
        { label: "공식 이미지 업로드 FAQ (2026-03-18 개정)", url: "https://github.com/commerce-api-naver/commerce-api/discussions/117" },
        { label: "대표이미지 크기 담당자 답변 (2023-04-11)", url: "https://github.com/commerce-api-naver/commerce-api/discussions/607" },
        { label: "WebP 지원 요청 담당자 답변 (2026-09-30)", url: "https://github.com/commerce-api-naver/commerce-api/discussions/3870" },
      ],
    },
    id: "naver",
    name: "네이버 스마트스토어",

    thumbnail: {
      width: 1000,
      height: 1000,
      sizeText: "1000 × 1000px (공식 문서 권장)",
      maxSize: "앱 압축 기준 4MiB",
      maxBytes: 4 * 1024 * 1024,
      format: "JPG, PNG, GIF, BMP",
      allowedOutputs: ["jpg", "png"],
    },

    detail: {
      width: 860,
      maxHeight: 5000,
      sizeText: "가로 860px 권장",
      height: "앱 설정 · 5,000px 단위로 분할",
      maxSize: "앱 압축 기준 20MiB",
      maxBytes: 20 * 1024 * 1024,
    },
  },


  {
    evidence: { status: "공식 규격 미확인", summary: "공식 개발자 문서가 환경 네트워크에서 차단됐습니다. 크기·분할 높이·용량 기준은 기존 앱 프리셋이며 공식 제한으로 확인되지 않았습니다.", sources: [] },
    id: "coupang",
    name: "쿠팡",

    thumbnail: {
      width: 500,
      height: 500,
      sizeText: "500 × 500px",
      maxSize: "앱 압축 기준 2MiB",
      maxBytes: 2 * 1024 * 1024,
      format: "JPG, PNG",
      allowedOutputs: null,
    },

    detail: {
      width: 780,
      maxHeight: 3000,
      sizeText: "가로 780px 권장",
      height: "앱 설정 · 3,000px 단위로 분할",
      maxSize: "앱 압축 기준 20MiB",
      maxBytes: 20 * 1024 * 1024,
    },
  },


  {
    evidence: { status: "공식 규격 미확인", summary: "공식 도움말 원문에 접근하지 못했습니다. 현재 상세 프리셋은 1080×1350 피드 세로형이며 스토리 규격이 아닙니다. 허용 비율·형식·용량의 최신 정책은 미확인입니다.", sources: [] },
    id: "instagram",
    name: "인스타그램",

    thumbnail: {
      width: 1080,
      height: 1080,
      sizeText: "1080 × 1080px",
      maxSize: "앱 용량 기준 없음",
      maxBytes: null,
      format: "JPG, PNG",
      allowedOutputs: null,
    },

    detail: {
      width: 1080,
      maxHeight: 1350,
      sizeText: "1080 × 1350px",
      height: "피드 세로형 · 1,350px 단위로 분할",
      maxSize: "앱 용량 기준 없음",
      maxBytes: null,
    },
  },


  {
    evidence: { status: "공식 규격 미확인", summary: "공식 판매자·Open API 가이드가 환경 네트워크에서 차단됐습니다. 5,000px는 앱의 분할 단위이며 공식 최대 높이를 의미하지 않습니다.", sources: [] },
    id: "11st",
    name: "11번가",

    thumbnail: {
      width: 1000,
      height: 1000,
      sizeText: "1000 × 1000px",
      maxSize: "앱 용량 기준 없음",
      maxBytes: null,
      format: "JPG, PNG",
      allowedOutputs: null,
    },

    detail: {
      width: 800,
      maxHeight: 5000,
      sizeText: "가로 800px",
      height: "5,000px 단위로 분할",
      maxSize: "앱 용량 기준 없음",
      maxBytes: null,
    },
  },


  {
    evidence: { status: "공식 규격 미확인", summary: "공식 ESM 판매자 가이드가 환경 네트워크에서 차단됐습니다. 4,000px는 앱의 분할 단위이며 G마켓과 옥션의 공통 최대 높이로 확인되지 않았습니다.", sources: [] },
    id: "esm",
    name: "G마켓 / 옥션",

    thumbnail: {
      width: 1000,
      height: 1000,
      sizeText: "1000 × 1000px",
      maxSize: "앱 용량 기준 없음",
      maxBytes: null,
      format: "JPG, PNG",
      allowedOutputs: null,
    },

    detail: {
      width: 860,
      maxHeight: 4000,
      sizeText: "가로 860px",
      height: "앱 설정 · 4,000px 단위로 분할",
      maxSize: "앱 용량 기준 없음",
      maxBytes: null,
    },
  },
];




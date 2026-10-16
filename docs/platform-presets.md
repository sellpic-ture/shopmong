# 플랫폼 변환 프리셋 검증 현황

후속 조사: [추가 출처와 현재 네트워크 진단](platform-research-2026-10-16.md).

확인일: 2026-10-16. **네이버의 일부 항목은 공식 원문에서 확인했지만, 모든 플랫폼의 최신 판매자 업로드 정책을 검증한 상태는 아닙니다.**
설정은 `src/lib/platforms.ts`에서 관리합니다. 공식 정책과 앱의 크기·분할·압축 설정은 별개입니다.

## 공식 원문에서 확인한 내용: 네이버

### 대표이미지 권장 크기

- [공식 저장소의 API 명세 2.0.0-RC](https://github.com/commerce-api-naver/commerce-api/blob/8f61814521ef15794e2ad0578e3ce768db9c3425/docs/2.0.0-RC.js)
  - 스키마: `components.schemas["ExternalApiProductImageVo.product"].description`
  - 원문: “대표 이미지(1000x1000픽셀 권장)”
  - 이 파일은 버전이 명시된 과거 명세입니다. 최신 API 명세로 단정하지 않습니다.
- [공식 기술지원 담당자 답변 #607](https://github.com/commerce-api-naver/commerce-api/discussions/607), 2023-04-11
  - 질문자는 판매자센터에 표시된 1000×1000 권장 크기를 인용합니다. 질문자 인용 자체는 운영자 답변과 구분합니다.
  - 담당자 원문: “커머스API를 이용한 상품 이미지 등록은 스마트스토어센터를 통한 상품 이미지 등록 기준과 동일합니다.”
  - 담당자는 별도 유효성 검사 대신 권장 크기에 맞출 것을 안내합니다. 1000px를 필수 최소 크기로 해석하지 않습니다.
- 반영: 앱 대표이미지 기본값을 640×640 → **1000×1000**으로 변경.

### 이미지 형식·API 요청 제한

[공식 FAQ #117](https://github.com/commerce-api-naver/commerce-api/discussions/117)

- 작성자: 공식 계정 `commerce-api-naver` / Maintainer.
- 게시일: 2022-10-21. 본문에 명시된 마지막 변경일: **2026-03-18**.
- 원문: “JPEG, GIF, PNG, BMP 지원”
- 원문: “API 호출 1건에 최대 10개 이미지 파일을 포함할 수 있습니다.”
- 원문: “API 호출건에 포함된 모든 이미지 파일 용량의 총합은 10MB(10⁷ bytes) 미만이어야 합니다.”
- 원문: “이미지 파일 용량의 계산은 HTTP 요청의 Payload 전체 데이터를 기준으로 계산합니다.”
- 원문: “대상 이미지의 가로 크기, 세로 크기, DPI/PPI 등의 이미지 해상도는 제한하지 않습니다.”

적용 범위는 `POST /v1/product-images/upload`입니다. **10MB는 파일당 허용 용량이 아니고, ZIP 용량 제한이나 판매자센터의 파일당 제한을 뜻하지 않습니다.** multipart 요청 본문의 부가 데이터도 고려해야 합니다.
샵몽은 API로 업로드하지 않으므로 로컬 일괄 변환 20장을 10장으로 줄이지 않았습니다.

### WebP

[공식 기술지원 답변 #3870](https://github.com/commerce-api-naver/commerce-api/discussions/3870), 2026-09-30

- 질문자의 WebP 등록 실패 보고에 담당자는 지원 요청을 내부 검토하겠다고 답변했습니다.
- 이 답변은 지원 개시 공지가 아닙니다. 위 FAQ의 지원 형식 목록에도 WebP가 없습니다.
- 반영: 네이버 **대표이미지** 출력은 앱이 생성할 수 있는 JPG·PNG만 선택 가능하도록 변경.
- 상세 HTML에 삽입하는 이미지까지 같은 API 정책이 적용된다고 추정하지 않았습니다.

### 확인하지 못한 네이버 항목

최신 판매자센터의 파일당 용량, 상세이미지 권장 폭·최대 높이·허용 형식, 카테고리별 예외는 미확인입니다.
기존 대표 4MiB / 상세 20MiB는 **앱 압축 기준**으로 유지했고 숫자 필드로 분리했습니다. 공식 파일당 용량 제한으로 표시하지 않습니다.
상세 가로 860px / 분할 높이 5000px도 앱 프리셋입니다.

## 나머지 플랫폼과 원문 접근 상태

아래 주소는 확인을 시도한 공식 사이트입니다. 본문을 읽은 출처 목록이 아닙니다.
환경의 HTTPS egress proxy가 CONNECT 단계에서 403을 반환했습니다. 권한 확장으로 재시도해도 동일한 정책 차단을 확인했습니다.

| 플랫폼 | 요청한 공식 URL | 미확인 항목 |
| --- | --- | --- |
| 네이버 | https://apicenter.commerce.naver.com/docs/commerce-api/current/create-product 및 https://help.sell.smartstore.naver.com/faq/list.help | 최신 명세·판매자센터 정책 |
| 쿠팡 | https://developers.coupangcorp.com/hc/ko/articles/360033646854 | 문서 존재·적용 범위, 크기·형식·용량 |
| 인스타그램 | https://help.instagram.com/1631821640426723 및 https://developers.facebook.com/docs/instagram-platform/content-publishing/ | 피드·스토리·API 각각의 크기·비율·형식·용량 |
| 11번가 | https://openapi.11st.co.kr/openapi/OpenApiGuide.tmall 및 https://soffice.11st.co.kr/ | 크기·형식·용량 |
| G마켓·옥션 | https://www.esmplus.com/ 및 https://pics.esmplus.com/esm/pds/SellerManual/ESMPLUS_Product_Registration.pdf | PDF 존재·적용 범위, 각 마켓의 크기·형식·용량 |

네이버 공식 GitHub는 접근 가능하여 위 원문을 직접 확인했습니다. 쿠팡 개발자 GitHub 조직에는 공개 저장소가 없었고, 추정한 Meta 예제 저장소는 404여서 근거로 사용하지 않았습니다.
후속 조사에서 필요한 도메인 목록이 저장된 것을 확인하고 재요청했지만 현재 머신의 HTTPS 프록시는 여전히 CONNECT 403을 반환했습니다. 브라우저에서도 동일한 터널 연결 실패가 발생했습니다. 현재 접속 문제를 사용자 설정 미저장으로 단정할 수 없습니다. 자세한 결과는 위 후속 조사 문서에 기록했습니다.

남은 플랫폼의 수치는 기존 앱 프리셋으로 유지했습니다. 인스타그램 상세 프리셋은 1080×1350 피드 세로형이며 스토리를 제공하지 않습니다. 11번가의 5000px와 ESM의 4000px는 앱의 분할 단위입니다.

## 일괄 변환

- 최대 20장, 입력 합계 150MB, 파일당 30MB / 4천만 픽셀.
- 플랫폼·형식·품질은 공통, 대표이미지 자르기 모드·위치는 파일별 보존.
- 순차 처리하며, 결과 합계는 200MB 이하. 상세 결과는 파일당 8천만 픽셀 / 100조각 이하.
- 파일 하나의 변환이 실패하면 그 파일 전체를 제외하고 다른 파일을 계속 처리.
- 다중 입력은 순번 폴더를 사용해 동일한 파일명도 보존. 성공한 파일만 ZIP에 포함.
- 새 이미지 목록을 선택하면 이전 목록을 교체. GIF는 정지 이미지로 출력.

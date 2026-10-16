# 이미지 규격 후속 조사 — 2026-10-16

## 결론과 근거 수준

네이버의 기존 공식 근거 외에 **Meta 공식 SDK 생성용 API 명세**를 추가로 직접 읽었습니다. 다만 이 명세는 이미지의 픽셀·용량 제한을 제공하지 않습니다. 다른 자료에서 찾은 수치는 아래와 같이 제3자 설명·구현 사례로 구분합니다. 이 자료만으로 앱의 공식 규격 검증 상태를 올리거나 강제 제한을 추가하지 않았습니다.

| 대상 | 추가로 찾은 내용 | 근거 수준 / 해석 |
| --- | --- | --- |
| 인스타그램 일반 피드 | 업로드 폭 1080px, 비율 1.91:1–3:4, 세로 예시 1080×1440. 1080×1350는 흔히 쓰는 4:5 프리셋으로 설명됨 | 제3자 가이드. 공식 도움말 링크를 제공하지만 원문에는 접근하지 못했으므로 최신 공식 최대 비율로 확정하지 않음 |
| 인스타그램 API 게시 | JPEG·8MB 기준을 설명하는 실제 연동 클라이언트 README | 제3자 API 연동 설명. 일반 앱 업로드 기준으로 확대 적용하지 않음 |
| Meta SDK 명세 | `POST media`에 `image_url`, `media_type`, `children` 등 존재. 이미지 크기·파일 용량에 대한 제한값은 없음 | 공식 API 명세 직접 확인. 매개변수 확인에만 사용하고 픽셀·용량 검증 근거로 사용하지 않음 |
| 쿠팡 대표이미지 | 1000×1000 흰 배경 이미지를 생성하는 판매 도구 사례 | 제3자 앱의 선택값. 한국 쿠팡의 필수·권장값인지 입증하지 못함. 중국어 도구는 국가·마켓 적용 범위도 불명확하여 한국 정책 근거로 배제 |
| 쿠팡 상세이미지 | 860×10,432px 이미지를 CDN에 업로드했다는 개발자의 기록 | 제3자의 개별 업로드 사례. CDN 업로드 성공은 상품 승인이나 공식 최대 높이의 근거가 아님. 앱의 3000px 분할을 공식 최대 높이로 표현하면 안 됨 |
| 11번가 | `11st-corp` 공개 저장소는 개발 스터디·기술 자료이며 검색 결과에서 판매자 이미지 규격 문서를 찾지 못함 | 공개 저장소 검색만으로 문서가 존재하지 않는다고 단정하지 않음. 규격 미확인 유지 |
| G마켓·옥션 | ESM 관련 연동 도구·엑셀 등록 설명은 찾았지만 이미지 제한을 입증할 공식 문서 배포본을 확보하지 못함 | 다른 마켓이나 앱의 압축 설정을 공통 공식 제한으로 대체하지 않음. 규격 미확인 유지 |

## 직접 읽은 출처

### 1. 공식 Meta API 명세

- 출처: [facebook/facebook-business-sdk-codegen — IGUser.json](https://github.com/facebook/facebook-business-sdk-codegen/blob/8420be6d5752c568a4f01dd608fa3cce6b2db960/api_specs/specs/IGUser.json)
- 위 커밋에 고정한 raw JSON을 HTTPS로 다운로드하여 파싱했습니다. `main`에서 읽은 파일과 바이트가 동일한지도 확인했습니다.
- 경로: `apis[]` 중 `method == "POST" && endpoint == "media"`의 `params`.
- 이 명세에는 `image_url` 문자열 매개변수가 있으나 JPEG/PNG 허용 여부, 이미지 바이트 수 제한, 폭·높이·비율 제한이 없습니다. 명세의 생략을 무제한 허용으로 해석해서는 안 됩니다.

### 2. 인스타그램 이미지 가이드 — 제3자

- [chuckreynolds/social-profile-image-sizes — Instagram](https://github.com/chuckreynolds/social-profile-image-sizes#instagram)
- README에 일반 피드의 폭·비율과 1080×1350 / 1080×1440 예시가 있습니다.
- 가이드가 연결한 공식 원문: [사진 해상도 도움말](https://help.instagram.com/1631821640426723), [릴스 크기·비율 도움말](https://help.instagram.com/1038071743007909).
- 릴스 해상도·프레임레이트를 정지 이미지 스토리의 필수 규격으로 옮기지 않습니다.
- 가이드의 Facebook Open Graph 부분에 있는 8MB를 Instagram 일반 피드의 제한으로 혼동하지 않습니다.

### 3. 인스타그램 API 연동 도구 — 제3자

- [searls/feed2gram](https://github.com/searls/feed2gram)
- README 원문: “Images can't be more than 8MB and must be standard-issue JPEGs”.
- 이 설명은 Graph API 게시 과정에 관한 것입니다. 같은 README의 동영상 관찰 결과를 정지 이미지 규격으로 섞지 않습니다.
- 연결된 공식 원문: [IG User Media 생성 문서](https://developers.facebook.com/docs/instagram-api/reference/ig-user/media#creating).

### 4. 쿠팡 관련 도구 — 제3자

- [noidb/noidb-os](https://github.com/noidb/noidb-os): 한국어 README에 1000×1000 흰 배경 썸네일 생성 설정을 기술. 공식 정책 문서나 정책 인용은 아님.
- [enkaichang/coupang_excel_generator](https://github.com/enkaichang/coupang_excel_generator): 1000×1000 흰 여백 변환을 기술. 중국어 UI·견적/템플릿 작업이며 한국 마켓 적용 범위가 입증되지 않음.
- [Heptagon372/Tetragon](https://github.com/Heptagon372/Tetragon): README 검증 기록에 860×10,432px 상세이미지 업로드 사례가 있음. 공식 제한이나 승인 보장으로 사용하지 않음.
- [kyungdongseo/coupang](https://github.com/kyungdongseo/coupang): API Python wrapper는 찾았으나 README에는 이미지 규격을 입증할 수치가 없음.

그 밖에 검색 결과에 나온 대량 등록 앱·기술 스터디·다른 국가 판매 도구를 공식 판매자 가이드로 취급하지 않았습니다. 외부 저장소의 코드나 설치 스크립트는 실행하지 않았습니다.

## 현재 원문 접근 문제

- 환경 설정을 다시 읽어 공식 사이트 도메인들이 저장된 상태를 확인했습니다. 이전과 달리 설정 초안도 남아 있지 않은 상태였습니다. 사용자에게 같은 도메인을 다시 입력하라고 요청할 근거는 없습니다.
- 그 상태에서 쿠팡 개발자 문서, 네이버 판매자 도움말, 인스타그램 도움말, Meta 개발자 문서, 11번가 Open API, ESM을 다시 요청했습니다. 현재 실행 머신에서는 모두 HTTPS 프록시의 CONNECT 단계에서 403이 반환됐습니다.
- 브라우저로도 쿠팡·인스타그램·11번가·ESM을 열어 확인했고 `ERR_TUNNEL_CONNECTION_FAILED`로 실패했습니다. HTML 추출 방식이나 JavaScript 렌더링 문제가 아닙니다.
- 제공된 대소문자 HTTP/HTTPS 프록시 설정이 각각 동일한지도 값 노출 없이 확인했습니다.
- GitHub 페이지와 raw 공식 SDK 명세는 정상적으로 읽을 수 있었습니다.
- 저장된 도메인 목록과 현재 머신의 접속 결과가 다릅니다. 설정 저장만으로 현재 네트워크 접근이 해결됐다고 주장하지 않습니다. 현재 도구에는 실행 환경의 egress 정책을 직접 재적용하거나 재시작하는 기능이 없어 여기까지의 진단 결과를 기록합니다.

공식 원문 접근이 복구되면 **국가·판매자센터/API·카테고리·이미지 용도·문서 수정일**을 먼저 확인한 뒤, 필수/권장 크기와 허용 형식·파일당 용량을 각각 검증해야 합니다. 제3자 자료의 수치를 그대로 공식 제한으로 승격하지 않습니다.

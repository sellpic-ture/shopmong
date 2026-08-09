# Shopmong Design System

## 1. Brand

Shopmong은 쇼핑몰 셀러를 위한 이미지 변환 도구다.

디자인 방향:
- 깔끔한 SaaS
- 빠르고 직관적인 사용성
- 과도한 장식보다 정보 전달 우선
- 이모지 대신 일관된 SVG 아이콘 사용

## 2. Colors

### Primary
- Primary: #2563EB
- Primary Hover: #1D4ED8
- Primary Light: #EFF6FF

### Neutral
- Background: #F8FAFC
- Card: #FFFFFF
- Text: #111827
- Secondary Text: #6B7280
- Muted Text: #9CA3AF
- Border: #E5E7EB

### Status
- Success: #16A34A
- Warning: #F59E0B
- Error: #DC2626

## 3. Typography

- Page title: 32px / 700
- Section title: 20px / 700
- Card title: 16px / 600
- Body: 14px / 400
- Caption: 12px / 400

한국어 가독성을 우선한다.

## 4. Layout

- Page max width: 960px
- Page background: #F8FAFC
- Section spacing: 24px
- Card radius: 16px
- Button radius: 10px
- Card padding: 24px

## 5. Cards

기본 카드:
- background: white
- border: 1px solid #E5E7EB
- border-radius: 16px
- shadow는 최소화한다.

Hover 가능한 카드는:
- cursor: pointer
- border-color 변경
- background-color 변경
- transition 적용

## 6. Buttons

Primary button:
- background: #2563EB
- color: white
- hover: #1D4ED8
- cursor: pointer
- radius: 10px

Secondary button:
- background: white
- color: #111827
- border: #E5E7EB

모든 클릭 가능한 버튼은 cursor-pointer를 사용한다.

## 7. Icons

이모지를 UI 아이콘으로 사용하지 않는다.

Lucide React SVG 아이콘을 사용한다.

대표이미지:
- Image icon

상세페이지:
- FileImage icon

업로드:
- Upload icon

플랫폼:
- 플랫폼별 로고 또는 일관된 SVG 아이콘

## 8. Interaction

Hover:
- 150~200ms transition
- border/background 변화

Selected:
- Primary border
- Primary Light background
- 명확한 선택 상태 표시

Focus:
- keyboard focus가 보이도록 한다.

## 9. Upload Area

업로드 영역은 단순한 빈 박스가 아니라
사용자가 무엇을 해야 하는지 명확하게 보여준다.

구성:
- Upload SVG icon
- 제목
- 설명
- 이미지 선택 버튼

## 10. Conversion Type

대표이미지와 상세페이지는
서로 독립적인 선택 카드로 표시한다.

선택된 카드는:
- blue border
- light blue background

정보는:
- 타입명
- 권장 크기
- 최대 용량
- 지원 형식

순서로 표시한다.

## 11. General Rules

- 이모지 아이콘 사용 금지
- 불필요한 박스 중첩 금지
- 지나치게 큰 여백 금지
- 모든 클릭 요소에 hover 상태 제공
- 모바일에서도 깨지지 않도록 responsive layout 사용
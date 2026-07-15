// JobBridge — SDG 8 양질의 일자리. 회사 / 알바 완전 분리 데이터
// 계약 조항은 정형 필드(contractData)로 보관하고, 판정은 lib 규칙엔진이 실행한다.

export const COMPANIES = [
  {
    id: 'c1', name: '누리테크', logo: '🟦', industry: 'IT · 소프트웨어', size: '중견 (320명)', loc: '서울 강남구',
    role: '프론트엔드 개발자', salary: '4,200 ~ 5,800만원', career: '경력 2~5년',
    hours: '주 40시간 · 유연근무 (코어 11-16시)', overtime: '있음 (통상임금 1.5배, 월평균 8시간)',
    welfare: ['재택 주 2회', '식대 15만원', '자기계발비 연 100만원', '건강검진'],
    ad: '우리는 사람이 오래 다니는 회사를 만듭니다. 야근은 예외이지 기본이 아닙니다.',
    reviews: [
      { u: '전_직원A', star: 4, pros: '수평적 문화, 코드 리뷰 문화가 잘 잡혀 있음', cons: '연봉 인상폭이 아쉬움', ym: '2026.03' },
      { u: '현_직원B', star: 5, pros: '재택이 실제로 보장됨. 야근수당 칼같이 지급', cons: '초기 온보딩 자료 부족', ym: '2026.01' },
    ],
    contractData: {
      employmentType: 'regular', contractTermMonths: null,
      hourlyWage: 16746, weeklyHours: 40,
      hasWrittenContract: true, paysWeeklyHolidayAllowance: true,
      hasOvertime: true, overtimeRate: 1.5,
      hasNightWork: false, hasHolidayWork: false,
      hasProbation: true, probationWagePct: 100,
      hasPenaltyClause: false, isDiscretionary: false,
      annualLeaveSpecified: true,
      nonCompeteMonths: 12, nonCompeteCompensated: false,
      socialInsurance: ['국민', '건강', '고용', '산재'],
    },
  },
  {
    id: 'c2', name: '한빛제조', logo: '🟧', industry: '제조 · 생산', size: '대기업 (2,100명)', loc: '경기 화성시',
    role: '생산관리 엔지니어', salary: '3,800 ~ 5,000만원', career: '신입 · 경력',
    hours: '주 40시간 · 2교대 (주간/야간 로테이션)', overtime: '있음 (야간 50% 가산 별도)',
    welfare: ['기숙사 제공', '통근버스', '자녀 학자금', '4대보험 + 단체상해보험'],
    ad: '30년간 한 번도 임금 체불이 없었습니다. 교대 수당은 법정 기준보다 높게 지급합니다.',
    reviews: [
      { u: '현_직원C', star: 4, pros: '복지와 고용 안정성 최고. 기숙사 무료', cons: '야간 교대가 체력적으로 힘듦', ym: '2026.02' },
      { u: '전_직원D', star: 3, pros: '급여 정확, 수당 누락 없음', cons: '수직적 조직 문화', ym: '2025.11' },
    ],
    contractData: {
      employmentType: 'regular', contractTermMonths: null,
      hourlyWage: 15151, weeklyHours: 40,
      hasWrittenContract: true, paysWeeklyHolidayAllowance: true,
      hasOvertime: true, overtimeRate: 1.5,
      hasNightWork: true, nightRate: 0.5,
      hasHolidayWork: false,
      hasProbation: false,
      hasPenaltyClause: true, // 조기 퇴사 시 교육비 반환 → 제20조 위반 소지
      isDiscretionary: false,
      annualLeaveSpecified: true,
      nonCompeteMonths: 0,
      socialInsurance: ['국민', '건강', '고용', '산재'],
    },
  },
  {
    id: 'c3', name: '초록바이오', logo: '🟩', industry: '바이오 · 헬스케어', size: '스타트업 (48명)', loc: '대전 유성구',
    role: '데이터 분석가', salary: '3,600 ~ 4,800만원 + 스톡옵션', career: '경력 1~3년',
    hours: '주 40시간 · 완전 자율출퇴근', overtime: '없음 (재량근로제)',
    welfare: ['스톡옵션', '점심 무료', '장비 자율 선택', '무제한 휴가(승인제)'],
    ad: '적은 인원, 큰 임팩트. 신약 후보물질 발굴 파이프라인을 함께 만들어요.',
    reviews: [
      { u: '현_직원E', star: 5, pros: '성장 속도가 빠름. 의사결정 참여 가능', cons: '리소스 부족, 멀티태스킹 필수', ym: '2026.04' },
      { u: '전_직원F', star: 2, pros: '자율성 높음', cons: '재량근로제로 실질 야근이 잦은데 수당 없음', ym: '2025.12' },
    ],
    contractData: {
      employmentType: 'regular', contractTermMonths: null,
      hourlyWage: 14354, weeklyHours: 40,
      hasWrittenContract: true, paysWeeklyHolidayAllowance: true,
      hasOvertime: true, overtimeRate: null, // 재량근로 명분으로 미지급
      hasNightWork: false, hasHolidayWork: false,
      hasProbation: true, probationWagePct: 90,
      hasPenaltyClause: false,
      isDiscretionary: true, discretionaryEligible: false, // 데이터 분석 → 법정 6개 업무 아님
      annualLeaveSpecified: false, // "무제한 휴가" → 법정 연차 미명시
      nonCompeteMonths: 0,
      socialInsurance: ['국민', '건강', '고용', '산재'],
    },
  },
  {
    id: 'c4', name: '온기복지재단', logo: '🟪', industry: '사회복지 · 비영리', size: '중소 (85명)', loc: '서울 마포구',
    role: '사회복지사', salary: '3,000 ~ 3,600만원', career: '자격증 필수 · 신입 가능',
    hours: '주 40시간 · 09:00-18:00', overtime: '있음 (보상휴가 대체 가능)',
    welfare: ['정시 퇴근 문화', '연 2회 워크숍', '자격 수당', '육아휴직 실사용률 100%'],
    ad: '사람을 돕는 일을 하는 사람이 먼저 존중받아야 합니다. 육아휴직 눈치 없는 조직.',
    reviews: [
      { u: '현_직원G', star: 5, pros: '워라밸 최고. 정시 퇴근이 당연시됨', cons: '급여 수준은 낮은 편', ym: '2026.05' },
    ],
    contractData: {
      employmentType: 'regular', contractTermMonths: null,
      hourlyWage: 13157, weeklyHours: 40,
      hasWrittenContract: true, paysWeeklyHolidayAllowance: true,
      hasOvertime: true, overtimeRate: 1.5,
      hasNightWork: false, hasHolidayWork: false,
      hasProbation: false,
      hasPenaltyClause: false, isDiscretionary: false,
      annualLeaveSpecified: true,
      nonCompeteMonths: 0,
      socialInsurance: ['국민', '건강', '고용', '산재'],
    },
  },
]

export const PARTTIMES = [
  {
    id: 'p1', name: '카페 온도', logo: '☕', cat: '카페 · 음료', loc: '서울 성동구 성수동',
    wage: 11500, wageNote: '주휴수당 별도 지급', hours: '주 3일 · 14:00-19:00 (5h)',
    period: '3개월 이상', age: '만 18세 이상', ad: '커피 교육 무료 제공. 바리스타 경력 인정서 발급.',
    perks: ['주휴수당 지급', '식사 제공', '음료 무료', '4대보험(주 15h 이상)'],
    reviews: [{ u: '알바_H', star: 5, pros: '사장님이 주휴수당 먼저 챙겨주심', cons: '주말 피크타임 정신없음', ym: '2026.04' }],
    contractData: {
      employmentType: 'parttime', contractTermMonths: 3,
      hourlyWage: 11500, weeklyHours: 15,
      hasWrittenContract: true, paysWeeklyHolidayAllowance: true,
      hasOvertime: false, hasNightWork: false, hasHolidayWork: false,
      hasProbation: false, hasPenaltyClause: false, isDiscretionary: false,
      annualLeaveSpecified: true,
      nonCompeteMonths: 0,
      socialInsurance: ['국민', '건강', '고용', '산재'],
    },
  },
  {
    id: 'p2', name: '편의점 24시 (역삼점)', logo: '🏪', cat: '편의점', loc: '서울 강남구 역삼동',
    wage: 12000, wageNote: '야간 시 50% 가산 = 18,000원', hours: '주 5일 · 00:00-06:00 (야간 6h)',
    period: '6개월 이상', age: '만 19세 이상 (야간)', ad: '야간 수당 100% 정산. CCTV·비상벨 완비.',
    perks: ['야간 50% 가산', '주휴수당', '4대보험', '폐기 상품 제공'],
    reviews: [
      { u: '알바_I', star: 4, pros: '야간수당 정확히 계산해줌. 손님 적어 공부 가능', cons: '가끔 취객 응대', ym: '2026.03' },
      { u: '알바_J', star: 3, pros: '급여일 정확', cons: '재고 정리가 생각보다 힘듦', ym: '2026.01' },
    ],
    contractData: {
      employmentType: 'parttime', contractTermMonths: 6,
      hourlyWage: 12000, weeklyHours: 30,
      hasWrittenContract: true, paysWeeklyHolidayAllowance: true,
      hasOvertime: false,
      hasNightWork: true, nightRate: 0.5,
      hasHolidayWork: false,
      hasProbation: false, hasPenaltyClause: false, isDiscretionary: false,
      annualLeaveSpecified: true,
      nonCompeteMonths: 0,
      socialInsurance: ['국민', '건강', '고용', '산재'],
    },
  },
  {
    id: 'p3', name: '한빛물류 상하차', logo: '📦', cat: '물류 · 배송', loc: '경기 광주시',
    wage: 15000, wageNote: '일당 12만원 (8h 기준)', hours: '주 3일 · 09:00-18:00',
    period: '단기 가능', age: '만 18세 이상', ad: '당일 정산. 안전화·장갑 무상 지급.',
    perks: ['당일 정산', '식사 제공', '통근버스', '산재보험'],
    reviews: [{ u: '알바_K', star: 3, pros: '시급 높고 당일 지급', cons: '체력 소모 큼. 여름엔 매우 더움', ym: '2026.02' }],
    contractData: {
      employmentType: 'parttime', contractTermMonths: null,
      hourlyWage: 15000, weeklyHours: 24,
      hasWrittenContract: false, // 구두 계약 → 제17조 위반
      paysWeeklyHolidayAllowance: false, // 주 15h 이상인데 미지급 → 제55조 위반
      hasOvertime: false, hasNightWork: false, hasHolidayWork: false,
      hasProbation: false, hasPenaltyClause: false, isDiscretionary: false,
      annualLeaveSpecified: false,
      nonCompeteMonths: 0,
      socialInsurance: ['산재'], // 고용보험 등 누락 가능
    },
  },
  {
    id: 'p4', name: '수학 과외 (중등)', logo: '📐', cat: '교육 · 과외', loc: '서울 노원구',
    wage: 30000, wageNote: '회당 6만원 (2h)', hours: '주 2회 · 19:00-21:00',
    period: '학기 단위', age: '대학 재학생 이상', ad: '중2 수학. 교재비 별도 지급. 성적 향상 시 인센티브.',
    perks: ['고시급', '교재비 지원', '성적 인센티브'],
    reviews: [{ u: '알바_L', star: 5, pros: '학부모님이 시간 존중해주심', cons: '이동 거리가 있음', ym: '2026.05' }],
    contractData: {
      employmentType: 'freelance', contractTermMonths: 4,
      hourlyWage: 30000, weeklyHours: 4,
      hasWrittenContract: true, paysWeeklyHolidayAllowance: false,
      hasOvertime: false, hasNightWork: false, hasHolidayWork: false,
      hasProbation: false, hasPenaltyClause: false, isDiscretionary: false,
      annualLeaveSpecified: false,
      nonCompeteMonths: 0,
      socialInsurance: [], // 3.3% 사업소득
    },
  },
]

export const SHORTS = [
  { id: 1, kind: '회사', ref: 'c1', user: '누리테크_HR', title: '개발자 하루 브이로그 — 진짜 6시에 퇴근합니다', likes: 24100, saves: 8900, subs: 12000, color: 'from-blue-500 to-indigo-400', emoji: '💻' },
  { id: 2, kind: '회사', ref: 'c3', user: '초록바이오_연구팀', title: '스타트업 데이터 분석가가 하는 일', likes: 9800, saves: 4100, subs: 5400, color: 'from-emerald-500 to-teal-400', emoji: '🧬' },
  { id: 3, kind: '알바', ref: 'p1', user: '카페온도', title: '라떼아트 3일 만에 배우는 법', likes: 51000, saves: 22000, subs: 31000, color: 'from-amber-500 to-orange-400', emoji: '☕' },
  { id: 4, kind: '알바', ref: 'p2', user: '편의점24_점장', title: '야간 알바 시급 18,000원 계산법', likes: 88000, saves: 45000, subs: 62000, color: 'from-violet-500 to-fuchsia-400', emoji: '🌙' },
  { id: 5, kind: '회사', ref: 'c2', user: '한빛제조', title: '공장 2교대 실제 스케줄 공개', likes: 17300, saves: 6200, subs: 9100, color: 'from-orange-500 to-red-400', emoji: '🏭' },
  { id: 6, kind: '알바', ref: 'p3', user: '한빛물류', title: '상하차 알바 처음 가는 사람 필독', likes: 33200, saves: 19800, subs: 14700, color: 'from-slate-500 to-zinc-400', emoji: '📦' },
]

export const NICE_IMPORT = {
  name: '김수환', age: 19, school: '한빛고등학교 3학년',
  gpa: '내신 2.4등급', attend: '결석 0 · 지각 1 · 조퇴 0',
  certs: ['컴퓨터활용능력 2급', '정보처리기능사', 'TOEIC 780'],
  awards: ['교내 코딩대회 최우수상 (2025)', '봉사활동 120시간'],
}

// SDG 8 임팩트 — 정성적 근거(정확한 수치 단정 금지)
export const IMPACT = {
  headline: '첫 일자리에서 부당한 계약에 서명하지 않도록',
  sub: 'JobBridge는 임금 투명성과 계약 정보 비대칭 해소로 SDG 8(양질의 일자리)에 기여합니다.',
  pillars: [
    {
      icon: '⚖️', title: '계약 정보의 비대칭 해소',
      body: '근로기준법 조문을 코드로 옮긴 규칙엔진이 계약 조항을 자동 대조합니다. 법을 몰라도 위험 조항을 미리 볼 수 있어, 첫 직장·청소년 노동자가 착취적 계약에 무방비로 노출되는 것을 줄입니다.',
      sdg: 'SDG 8.8 · 노동권 보호',
    },
    {
      icon: '💸', title: '임금 투명성',
      body: '연봉/시급, 연장·야간·휴일 가산, 주휴수당을 공고 단계에서 명시하고 최저임금과 대조해 보여줍니다. “면접 때 알려줄게”로 미뤄지던 조건을 앞단에서 투명하게 합니다.',
      sdg: 'SDG 8.5 · 동일가치노동 동일임금',
    },
    {
      icon: '🧭', title: '회사·알바 분리로 혼동 방지',
      body: '정규직과 시간제는 적용되는 법·권리가 다릅니다. 모드를 분리해 각 형태에 맞는 권리(주휴·가산수당·연차)만 정확히 안내합니다.',
      sdg: 'SDG 8.3 · 양질의 일자리 창출',
    },
    {
      icon: '🎓', title: '청년·사회초년생 역량 강화',
      body: '나이스 성적·자격 불러오기와 자소서 초안으로 진입 장벽을 낮추고, 계약 검토 교육을 통해 스스로 권리를 지킬 수 있게 돕습니다.',
      sdg: 'SDG 8.6 · 청년 고용',
    },
  ],
  note: 'JobBridge의 계약 검토는 교육·정보 제공용이며 법률 자문이 아닙니다. 실제 분쟁이 우려되면 고용노동부 상담센터(☎ 1350) 또는 공인노무사와 상담하세요.',
}

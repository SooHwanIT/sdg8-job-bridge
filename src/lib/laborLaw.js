// ─────────────────────────────────────────────────────────────
// 근로기준법 규칙엔진 · 상수 & 조문 & 룰셋
// JobBridge — SDG 8 양질의 일자리
//
// ⚠ 교육·정보 제공용. 법률 자문이 아닙니다. (고용노동부 1350)
// ─────────────────────────────────────────────────────────────

// 2025년 기준 상수
export const LABOR = {
  MIN_WAGE_2025: 10030,          // 2025 최저임금 시급(원)
  MIN_WAGE_MONTHLY_2025: 2096270, // 월 환산(209시간 기준, 원)
  WEEKLY_HOURS_FOR_MONTHLY: 209, // 월 환산 소정근로시간
  HOLIDAY_ALLOWANCE_HOURS: 15,   // 주휴수당 발생 기준(주 소정근로시간)
  OVERTIME_ADD_RATE: 0.5,        // 연장 가산율(→ 통상임금의 150% 지급)
  NIGHT_ADD_RATE: 0.5,           // 야간(22:00~06:00) 가산율
  HOLIDAY_ADD_RATE_8: 0.5,       // 휴일 8시간 이내 가산율
  HOLIDAY_ADD_RATE_OVER: 1.0,    // 휴일 8시간 초과분 가산율
  PROBATION_MIN_PCT: 90,         // 수습 감액 하한(최저임금의 90%)
  PROBATION_MIN_TERM_MONTHS: 12, // 수습 감액 허용 계약기간(1년 이상)
  LEGAL_ANNUAL_LEAVE: 15,        // 1년 개근 시 연차(일)
  YEAR: 2025,
}

// 조문 메타데이터 (판정 근거 인용용)
export const ARTICLES = {
  MIN_WAGE:     { law: '최저임금법', no: '제6조',  name: '최저임금의 효력' },
  MIN_WAGE_PROB:{ law: '최저임금법 시행령', no: '제3조', name: '수습근로자 감액' },
  WRITTEN:      { law: '근로기준법', no: '제17조', name: '근로조건의 명시·서면 교부' },
  HOLIDAY:      { law: '근로기준법', no: '제55조', name: '유급 주휴일' },
  PREMIUM:      { law: '근로기준법', no: '제56조', name: '연장·야간·휴일 가산수당' },
  PENALTY:      { law: '근로기준법', no: '제20조', name: '위약 예정의 금지' },
  DISCRETION:   { law: '근로기준법', no: '제58조③', name: '재량근로시간제 대상 제한' },
  ANNUAL_LEAVE: { law: '근로기준법', no: '제60조', name: '연차 유급휴가' },
  DISMISS:      { law: '근로기준법', no: '제23조', name: '해고 등의 제한' },
  SOCIAL_INS:   { law: '고용보험법·국민건강보험법 등', no: '', name: '사회보험 가입' },
  NON_COMPETE:  { law: '민법 제103조·판례', no: '', name: '경업금지 약정의 유효성' },
}

// 재량근로시간제 대상 업무(근기법 시행령 제31조) — 화이트리스트
export const DISCRETIONARY_ELIGIBLE = [
  '신제품·신기술 연구개발', '인문사회과학·자연과학 연구',
  '정보처리시스템 설계·분석', '기사 취재·편성·편집',
  '디자인·고안', '방송·영화 프로듀서·감독',
]

// 상태 상수
export const STATUS = { PASS: 'pass', WARN: 'warn', VIOLATION: 'violation' }

// 상태별 감점 가중치
const W = { [STATUS.PASS]: 0, [STATUS.WARN]: 8, [STATUS.VIOLATION]: 24 }

const won = (n) => (n == null ? '-' : Number(n).toLocaleString() + '원')
const pct = (n) => (n == null ? '-' : n + '%')

// ─────────────────────────────────────────────────────────────
// 룰셋 — 각 룰은 { applies(c), run(c) } 을 가진다.
// run() 은 { status, title, value, message, severity } 를 돌려준다.
// c = 정규화된 계약 필드(정형 데이터)
// ─────────────────────────────────────────────────────────────
export const RULES = [
  // 1. 최저임금 (제6조)
  {
    id: 'minWage', article: ARTICLES.MIN_WAGE, category: '임금',
    applies: () => true,
    run: (c) => {
      const wage = c.hourlyWage
      if (wage == null) return null
      if (wage < LABOR.MIN_WAGE_2025) {
        const gap = LABOR.MIN_WAGE_2025 - wage
        return {
          status: STATUS.VIOLATION, title: '최저임금 미달',
          value: `시급 ${won(wage)}`,
          message: `2025년 최저임금(${won(LABOR.MIN_WAGE_2025)})보다 시간당 ${won(gap)} 낮습니다. 최저임금 미만 약정은 그 부분이 무효이며, 최저임금액이 적용됩니다.`,
        }
      }
      return {
        status: STATUS.PASS, title: '최저임금 충족',
        value: `시급 ${won(wage)}`,
        message: `2025년 최저임금 ${won(LABOR.MIN_WAGE_2025)} 이상입니다.`,
      }
    },
  },

  // 2. 주휴수당 (제55조) — 주 15시간 이상
  {
    id: 'weeklyHoliday', article: ARTICLES.HOLIDAY, category: '수당',
    applies: (c) => c.weeklyHours != null,
    run: (c) => {
      const eligible = c.weeklyHours >= LABOR.HOLIDAY_ALLOWANCE_HOURS
      if (!eligible) {
        return {
          status: STATUS.PASS, title: '주휴수당 비대상',
          value: `주 ${c.weeklyHours}시간`,
          message: `소정근로가 주 15시간 미만이라 주휴수당 지급 의무가 없습니다(제55조).`,
        }
      }
      if (c.paysWeeklyHolidayAllowance === false) {
        return {
          status: STATUS.VIOLATION, title: '주휴수당 미지급',
          value: `주 ${c.weeklyHours}시간 · 미지급`,
          message: `주 15시간 이상 근로 시 주휴수당은 법정 의무입니다. 하루치 유급휴일 임금을 추가로 받아야 합니다.`,
        }
      }
      return {
        status: STATUS.PASS, title: '주휴수당 지급',
        value: `주 ${c.weeklyHours}시간 · 지급`,
        message: `주 15시간 이상 근로에 대한 주휴수당이 지급됩니다.`,
      }
    },
  },

  // 3. 서면 근로계약서 교부 (제17조)
  {
    id: 'written', article: ARTICLES.WRITTEN, category: '계약',
    applies: () => true,
    run: (c) => {
      if (c.hasWrittenContract === false) {
        return {
          status: STATUS.VIOLATION, title: '서면 근로계약서 미교부',
          value: '구두 계약',
          message: `임금·근로시간·휴일·연차 등은 서면으로 명시해 교부해야 합니다. 미교부 시 500만원 이하 과태료 대상이며, 분쟁 시 근로자에게 불리합니다.`,
        }
      }
      return {
        status: STATUS.PASS, title: '서면 근로계약서 교부',
        value: '작성 후 교부',
        message: `근로조건이 서면으로 명시·교부됩니다(제17조).`,
      }
    },
  },

  // 4. 연장근로 가산 (제56조)
  {
    id: 'overtime', article: ARTICLES.PREMIUM, category: '수당',
    applies: (c) => c.hasOvertime === true,
    run: (c) => {
      const need = 1 + LABOR.OVERTIME_ADD_RATE // 1.5
      const rate = c.overtimeRate
      if (rate == null || rate < need) {
        return {
          status: STATUS.VIOLATION, title: '연장근로 가산 미달',
          value: rate == null ? '미지급/미명시' : `${Math.round(rate * 100)}%`,
          message: `연장근로는 통상임금의 150%(50% 가산) 이상을 지급해야 합니다. 재량근로제라도 실질적 지휘·감독이 있으면 지급 의무가 살아납니다.`,
        }
      }
      return {
        status: STATUS.PASS, title: '연장근로 가산 충족',
        value: `${Math.round(rate * 100)}%`,
        message: `연장근로에 통상임금 150% 이상이 지급됩니다.`,
      }
    },
  },

  // 5. 야간근로 가산 (제56조)
  {
    id: 'night', article: ARTICLES.PREMIUM, category: '수당',
    applies: (c) => c.hasNightWork === true,
    run: (c) => {
      const rate = c.nightRate
      if (rate == null || rate < LABOR.NIGHT_ADD_RATE) {
        return {
          status: STATUS.VIOLATION, title: '야간근로 가산 미달',
          value: rate == null ? '미명시' : `${Math.round(rate * 100)}% 가산`,
          message: `야간(22:00~06:00) 근로에는 통상임금의 50%를 가산해야 합니다.`,
        }
      }
      return {
        status: STATUS.PASS, title: '야간근로 가산 충족',
        value: `${Math.round(rate * 100)}% 가산`,
        message: `야간근로에 50% 이상 가산이 지급됩니다(제56조).`,
      }
    },
  },

  // 6. 휴일근로 가산 (제56조)
  {
    id: 'holiday', article: ARTICLES.PREMIUM, category: '수당',
    applies: (c) => c.hasHolidayWork === true,
    run: (c) => {
      const rate = c.holidayRate
      if (rate == null || rate < LABOR.HOLIDAY_ADD_RATE_8) {
        return {
          status: STATUS.VIOLATION, title: '휴일근로 가산 미달',
          value: rate == null ? '미명시' : `${Math.round(rate * 100)}% 가산`,
          message: `휴일근로는 8시간 이내 50%, 초과분은 100%를 가산해야 합니다.`,
        }
      }
      return {
        status: STATUS.PASS, title: '휴일근로 가산 충족',
        value: `${Math.round(rate * 100)}% 가산`,
        message: `휴일근로 가산이 기준을 충족합니다(제56조).`,
      }
    },
  },

  // 7. 수습 감액 (최저임금법 시행령 제3조)
  {
    id: 'probation', article: ARTICLES.MIN_WAGE_PROB, category: '임금',
    applies: (c) => c.hasProbation === true,
    run: (c) => {
      const p = c.probationWagePct
      const term = c.contractTermMonths // null = 기간의 정함 없음(무기)
      const termOk = term == null || term >= LABOR.PROBATION_MIN_TERM_MONTHS
      // 1년 미만 계약은 수습 감액 자체가 불가
      if (!termOk && p != null && p < 100) {
        return {
          status: STATUS.VIOLATION, title: '수습 감액 불가 대상',
          value: `수습 ${pct(p)} · 계약 ${term}개월`,
          message: `근로계약 기간이 1년 미만이면 수습이라도 최저임금을 감액할 수 없습니다. 100%를 지급해야 합니다.`,
        }
      }
      if (p != null && p < LABOR.PROBATION_MIN_PCT) {
        return {
          status: STATUS.VIOLATION, title: '수습 감액 하한 위반',
          value: `수습 ${pct(p)}`,
          message: `수습 기간이라도 최저임금의 90% 미만으로는 지급할 수 없습니다. 또한 단순노무 직무는 감액 자체가 금지됩니다.`,
        }
      }
      return {
        status: STATUS.PASS, title: '수습 조건 적법',
        value: p == null ? '감액 없음' : `수습 ${pct(p)}`,
        message: `수습 급여가 최저임금의 90% 이상이며 1년 이상 계약 요건을 충족합니다.`,
      }
    },
  },

  // 8. 위약 예정 금지 (제20조)
  {
    id: 'penalty', article: ARTICLES.PENALTY, category: '독소조항',
    applies: () => true,
    run: (c) => {
      if (c.hasPenaltyClause === true) {
        return {
          status: STATUS.VIOLATION, title: '위약 예정 조항(강행규정 위반)',
          value: '조기퇴사 시 위약금·교육비 반환',
          message: `근로계약 불이행에 대한 위약금·손해배상액을 미리 정하는 약정은 그 자체로 금지됩니다(강행규정). 실제 손해가 있어도 예정액 청구는 무효입니다.`,
        }
      }
      return {
        status: STATUS.PASS, title: '위약 예정 조항 없음',
        value: '없음',
        message: `위약금·손해배상 예정 조항이 없습니다(제20조 준수).`,
      }
    },
  },

  // 9. 재량근로제 대상 제한 (제58조③)
  {
    id: 'discretion', article: ARTICLES.DISCRETION, category: '근로시간',
    applies: (c) => c.isDiscretionary === true,
    run: (c) => {
      if (c.discretionaryEligible === false) {
        return {
          status: STATUS.VIOLATION, title: '재량근로제 대상 아님',
          value: '재량근로시간제 적용',
          message: `재량근로제는 연구개발·설계·취재 등 법정 6개 업무에만 허용됩니다. 대상이 아닌 직무에 적용하면 실근로시간 기준으로 연장·야간수당을 지급해야 합니다.`,
        }
      }
      return {
        status: STATUS.WARN, title: '재량근로제 — 요건 확인 필요',
        value: '재량근로시간제 적용',
        message: `대상 업무라도 근로자대표와의 서면합의가 있어야 유효합니다. 서면합의 여부를 확인하세요.`,
      }
    },
  },

  // 10. 연차 유급휴가 명시 (제60조)
  {
    id: 'annualLeave', article: ARTICLES.ANNUAL_LEAVE, category: '휴가',
    applies: (c) => c.employmentType !== 'freelance' && c.weeklyHours != null && c.weeklyHours >= LABOR.HOLIDAY_ALLOWANCE_HOURS,
    run: (c) => {
      if (c.annualLeaveSpecified === false) {
        return {
          status: STATUS.WARN, title: '연차휴가 미명시',
          value: '미명시 / “무제한” 등',
          message: `연 15일의 법정 연차가 계약서에 명시되지 않으면, 미사용 연차수당 청구가 어려워질 수 있습니다. “무제한 휴가”는 법정 연차를 대체하지 못합니다.`,
        }
      }
      return {
        status: STATUS.PASS, title: '연차휴가 명시',
        value: `연 ${LABOR.LEGAL_ANNUAL_LEAVE}일 이상`,
        message: `법정 연차(15일)가 명시되어 있습니다(제60조).`,
      }
    },
  },

  // 11. 경업금지 약정
  {
    id: 'nonCompete', article: ARTICLES.NON_COMPETE, category: '독소조항',
    applies: (c) => (c.nonCompeteMonths ?? 0) > 0,
    run: (c) => {
      if (!c.nonCompeteCompensated) {
        return {
          status: STATUS.WARN, title: '무보상 경업금지',
          value: `퇴사 후 ${c.nonCompeteMonths}개월`,
          message: `보상 없이 장기간 동종업계 취업을 제한하는 약정은 직업선택의 자유를 과도하게 침해해 무효로 판단될 수 있습니다. 보상·기간·범위를 협의하세요.`,
        }
      }
      return {
        status: STATUS.PASS, title: '경업금지 — 보상 있음',
        value: `${c.nonCompeteMonths}개월 · 보상`,
        message: `보상이 수반된 합리적 범위의 경업금지로 보입니다.`,
      }
    },
  },

  // 12. 사회보험 가입
  {
    id: 'socialInsurance', article: ARTICLES.SOCIAL_INS, category: '4대보험',
    applies: (c) => c.weeklyHours != null,
    run: (c) => {
      const ins = c.socialInsurance || []
      const has = (k) => ins.includes(k)
      if (c.employmentType === 'freelance') {
        return {
          status: STATUS.WARN, title: '프리랜서(3.3%) — 근로자성 확인',
          value: ins.length ? ins.join(' · ') : '미가입',
          message: `계약 형식이 프리랜서라도, 정해진 시간·장소에서 지휘·감독을 받으면 근로자로 인정될 수 있습니다. 이 경우 4대보험·주휴·퇴직금이 적용됩니다.`,
        }
      }
      if (c.weeklyHours >= LABOR.HOLIDAY_ALLOWANCE_HOURS && !(has('고용') && has('건강') && has('국민'))) {
        return {
          status: STATUS.WARN, title: '4대보험 가입 누락 가능',
          value: ins.length ? ins.join(' · ') : '산재만/미가입',
          message: `주 15시간 이상·월 60시간 이상 근로자는 원칙적으로 4대보험(고용·건강·국민·산재) 가입 대상입니다. 가입 여부를 확인하세요.`,
        }
      }
      return {
        status: STATUS.PASS, title: '4대보험 적정',
        value: ins.length ? ins.join(' · ') : '단시간 특례',
        message: `근로시간 기준에 맞는 사회보험이 적용됩니다.`,
      }
    },
  },
]

export const WEIGHTS = W

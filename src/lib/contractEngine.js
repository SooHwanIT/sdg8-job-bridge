// ─────────────────────────────────────────────────────────────
// 계약서 평가 엔진 — 정형 계약 필드에 룰셋을 실행해 판정 산출
// ─────────────────────────────────────────────────────────────
import { RULES, WEIGHTS, STATUS, LABOR } from './laborLaw.js'

// 빈 계약(사용자 직접 검토 폼 기본값)
export function blankContract() {
  return {
    employmentType: 'parttime', // regular | contract | parttime | freelance
    contractTermMonths: null,   // null = 기간의 정함 없음
    hourlyWage: 10030,
    weeklyHours: 15,
    hasWrittenContract: true,
    paysWeeklyHolidayAllowance: true,
    hasOvertime: false,
    overtimeRate: 1.5,
    hasNightWork: false,
    nightRate: 0.5,
    hasHolidayWork: false,
    holidayRate: 0.5,
    hasProbation: false,
    probationWagePct: 100,
    hasPenaltyClause: false,
    isDiscretionary: false,
    discretionaryEligible: null,
    annualLeaveSpecified: true,
    nonCompeteMonths: 0,
    nonCompeteCompensated: false,
    socialInsurance: ['국민', '건강', '고용', '산재'],
  }
}

// 룰셋 실행 → 판정 목록
export function evaluateContract(contract) {
  const findings = []
  for (const rule of RULES) {
    try {
      if (rule.applies && !rule.applies(contract)) continue
      const out = rule.run(contract)
      if (!out) continue
      findings.push({
        ruleId: rule.id,
        category: rule.category,
        article: rule.article,
        status: out.status,
        title: out.title,
        value: out.value,
        message: out.message,
        weight: WEIGHTS[out.status] ?? 0,
      })
    } catch (e) {
      // 규칙 실행 실패는 판정에서 조용히 제외 (앱은 계속 동작)
    }
  }

  const counts = {
    pass: findings.filter((f) => f.status === STATUS.PASS).length,
    warn: findings.filter((f) => f.status === STATUS.WARN).length,
    violation: findings.filter((f) => f.status === STATUS.VIOLATION).length,
  }

  const penalty = findings.reduce((s, f) => s + f.weight, 0)
  const score = Math.max(0, Math.min(100, 100 - penalty))
  const grade = gradeOf(score, counts)

  // 위험 → 안전 순으로 정렬(심사자가 문제를 먼저 보게)
  const order = { [STATUS.VIOLATION]: 0, [STATUS.WARN]: 1, [STATUS.PASS]: 2 }
  findings.sort((a, b) => order[a.status] - order[b.status])

  return { findings, counts, score, grade, checked: findings.length }
}

function gradeOf(score, counts) {
  if (counts.violation > 0 && score < 70)
    return { key: 'danger', label: '위험', tone: 'rose', emoji: '🚨', desc: '법 위반 소지가 있는 조항이 있습니다. 서명 전 확인이 필요합니다.' }
  if (counts.violation > 0 || counts.warn > 1)
    return { key: 'caution', label: '주의', tone: 'amber', emoji: '⚠️', desc: '확인·협의가 필요한 조항이 있습니다.' }
  if (counts.warn === 1)
    return { key: 'review', label: '검토', tone: 'amber', emoji: '🔎', desc: '한 가지 조항을 확인해 보세요.' }
  return { key: 'safe', label: '안전', tone: 'emerald', emoji: '✅', desc: '주요 근로기준법 항목을 충족합니다.' }
}

// 시급 계산 도우미(월급 → 시급 환산)
export function monthlyToHourly(monthly) {
  if (!monthly) return null
  return Math.round(monthly / LABOR.WEEKLY_HOURS_FOR_MONTHLY)
}

export { STATUS }

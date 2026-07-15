// ─────────────────────────────────────────────────────────────
// AI 자기소개서 초안 생성 — 규칙/템플릿 기반(외부 API 없음)
// 불러온 프로필 필드를 재료로 한국어 자소서 초안을 구성한다.
// ─────────────────────────────────────────────────────────────

const TONE = {
  sincere: { label: '성실·신뢰', hook: '맡은 일을 끝까지, 약속한 시간 안에 해내는 사람' },
  growth: { label: '성장·도전', hook: '어제보다 한 뼘 더 나아지는 것을 즐기는 사람' },
  team: { label: '협업·소통', hook: '함께 일하는 사람을 편하게 만드는 사람' },
}

function joinKo(arr) {
  const a = (arr || []).filter(Boolean)
  if (a.length <= 1) return a[0] || ''
  return a.slice(0, -1).join(', ') + ', ' + a[a.length - 1]
}

// profile: { name, age, school, gpa, attend, certs[], awards[] }
// opts: { tone, target } target = 지원 대상(회사/직무명) 선택
export function generateCoverLetter(profile, opts = {}) {
  if (!profile) return ''
  const tone = TONE[opts.tone] || TONE.sincere
  const target = opts.target?.trim()
  const p = profile

  const certs = joinKo(p.certs)
  const topAward = (p.awards && p.awards[0]) || ''
  const restAward = (p.awards && p.awards[1]) || ''
  const goodAttend = /결석\s*0|무결석/.test(p.attend || '')

  const opening = target
    ? `${target}에 지원하는 ${p.school} ${p.name}입니다.`
    : `저는 ${p.school}에 재학 중인 ${p.name}입니다.`

  const skillPara = certs
    ? `${certs} 자격을 준비하며 기본기를 다졌습니다. 자격증은 결과보다, 목표를 정하고 계획대로 끝까지 밀고 나가는 습관을 남겼습니다.`
    : `아직 자격증은 준비 중이지만, 필요한 것을 빠르게 배워 현장에 적용하는 데 자신이 있습니다.`

  const attitudeBits = []
  if (goodAttend) attitudeBits.push(`${p.attend}의 출결 기록`)
  if (p.gpa) attitudeBits.push(`${p.gpa}의 학업 태도`)
  const attitudePara = attitudeBits.length
    ? `${joinKo(attitudeBits)}은 제 성실함을 대신 말해 준다고 생각합니다. 작은 약속을 지키는 사람이 큰 일도 맡을 수 있다고 믿습니다.`
    : `무엇보다 시간 약속과 맡은 몫을 지키는 것을 가장 중요하게 생각합니다.`

  const expPara = topAward
    ? `${topAward}${restAward ? `과 ${restAward}` : ''}을 경험하며 문제를 끝까지 파고드는 힘을 길렀습니다. 막히는 순간에도 방법을 바꿔 다시 시도하는 편입니다.`
    : `다양한 활동 속에서 처음 보는 문제 앞에서도 물러서지 않는 태도를 익혔습니다.`

  const closing = target
    ? `${tone.hook}로서, ${target}에서 신뢰받는 한 사람이 되겠습니다. 기회를 주신다면 배운 것을 성실히 증명하겠습니다.`
    : `${tone.hook}이 되겠습니다. 기회를 주신다면 배운 것을 성실히 증명하겠습니다.`

  return [opening, skillPara, attitudePara, expPara, closing].join('\n\n')
}

export const COVER_TONES = Object.entries(TONE).map(([key, v]) => ({ key, label: v.label }))

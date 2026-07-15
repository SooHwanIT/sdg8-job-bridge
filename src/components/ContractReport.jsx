// 계약서 판정 결과 렌더링 — 규칙엔진 산출물을 화면에 표시
import { Card, ScoreRing, statusTone, statusMark, statusLabel, TONE } from './ui.jsx'

// 점수 요약 카드
export function ScoreSummary({ result, context = '근로기준법' }) {
  const { score, grade, counts, checked } = result
  const tone = TONE[grade.tone] || TONE.emerald
  return (
    <Card className={`p-5 ${tone.ring}`}>
      <div className="flex items-center gap-4">
        <ScoreRing score={score} tone={tone} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`rounded-lg px-2 py-0.5 text-sm font-black ${tone.chip}`}>{grade.emoji} {grade.label}</span>
            <span className="text-xs text-white/40">{checked}개 항목 검토</span>
          </div>
          <p className="mt-1.5 text-sm leading-snug text-white/70">{grade.desc}</p>
          <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-bold">
            <span className="rounded-md bg-rose-500/15 px-2 py-0.5 text-rose-200">위반 {counts.violation}</span>
            <span className="rounded-md bg-amber-400/15 px-2 py-0.5 text-amber-200">주의 {counts.warn}</span>
            <span className="rounded-md bg-emerald-400/15 px-2 py-0.5 text-emerald-200">적법 {counts.pass}</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-white/40">
        🤖 {context} 조문을 규칙엔진으로 자동 대조했습니다.
      </p>
    </Card>
  )
}

// 개별 판정 카드
export function FindingCard({ f }) {
  const tone = statusTone(f.status)
  const cite = f.article ? `${f.article.law} ${f.article.no} ${f.article.name}`.trim() : ''
  return (
    <Card className={`p-4 ${f.status !== 'pass' ? tone.ring : ''}`}>
      <div className="flex items-start gap-2.5">
        <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-black ${
          f.status === 'pass' ? 'bg-emerald-400 text-emerald-950' : `${tone.bg} text-white`}`} aria-hidden="true">{statusMark(f.status)}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-white">{f.title}</p>
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-black ${tone.chip}`}>{statusLabel(f.status)}</span>
          </div>
          {f.value && <p className="mt-0.5 text-sm text-white/70">{f.value}</p>}
          <p className={`mt-1 text-xs leading-relaxed ${f.status === 'pass' ? 'text-white/40' : tone.text}`}>{f.message}</p>
          {cite && (
            <p className="mt-1.5 inline-block rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/45">
              📎 근거 · {cite}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}

export function FindingsList({ findings }) {
  return (
    <div className="space-y-2.5">
      {findings.map((f) => <FindingCard key={f.ruleId} f={f} />)}
    </div>
  )
}

export const Disclaimer = () => (
  <p className="px-1 text-[11px] leading-relaxed text-white/30">
    ⓘ 이 검토는 교육·정보 제공용이며 법률 자문이 아닙니다. 실제 분쟁이 우려되면 고용노동부 상담센터(☎ 1350) 또는 공인노무사와 상담하세요.
  </p>
)

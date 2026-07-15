import { useState } from 'react'
import { COMPANIES, PARTTIMES } from '../data/db.js'
import { evaluateContract } from '../lib/contractEngine.js'
import { Card, Empty, statusTone } from './ui.jsx'

export default function JobList({ mode, open, applied }) {
  const [q, setQ] = useState('')
  const isCo = mode === 'company'
  const src = isCo ? COMPANIES : PARTTIMES
  const list = src.filter(j =>
    j.name.includes(q) || (isCo ? j.role.includes(q) || j.industry.includes(q) : j.cat.includes(q)) || j.loc.includes(q))
  const accent = isCo ? 'text-blue-300' : 'text-amber-300'
  const ring = isCo ? 'focus:ring-blue-400' : 'focus:ring-amber-400'

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-black text-white">{isCo ? '회사 채용' : '알바 공고'}</h2>
        <p className="mt-1 text-sm text-white/45">
          {isCo ? '연봉 · 근무시간 · 야근수당 · 계약서까지 투명하게' : '시급 · 주휴수당 · 야간 가산까지 투명하게'}
        </p>
      </div>

      <input value={q} onChange={e => setQ(e.target.value)} aria-label="공고 검색"
        placeholder={isCo ? '직무 · 회사 · 지역 검색' : '업종 · 가게 · 지역 검색'}
        className={`w-full rounded-xl bg-white/8 px-4 py-3 text-white placeholder:text-white/30 ring-1 ring-white/10 outline-none focus:ring-2 ${ring}`} />

      <div className="grid gap-2.5 sm:grid-cols-2">
        {list.map(j => {
          const res = evaluateContract(j.contractData)
          const bad = res.counts.violation + res.counts.warn
          const tone = statusTone(res.counts.violation ? 'violation' : res.counts.warn ? 'warn' : 'pass')
          return (
            <button key={j.id} onClick={() => open(j)} className="w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-2xl">
              <Card className="h-full p-4 transition hover:bg-white/[.07] hover:ring-white/20">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/8 text-2xl" aria-hidden="true">{j.logo}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black text-white">{j.name}</p>
                    <p className={`truncate text-sm font-semibold ${accent}`}>{isCo ? j.role : j.cat}</p>
                    <p className="mt-0.5 truncate text-xs text-white/40">{j.loc} · {isCo ? j.size : j.period}</p>
                  </div>
                  {applied.includes(j.id) && (
                    <span className="shrink-0 rounded-lg bg-emerald-400/20 px-2 py-1 text-[10px] font-black text-emerald-200">지원함</span>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-black/25 px-3 py-2">
                  <span className="text-[11px] text-white/40">{isCo ? '연봉' : '시급'}</span>
                  <span className="text-sm font-black text-white">{isCo ? j.salary : `${j.wage.toLocaleString()}원`}</span>
                  <span className="ml-auto truncate text-[11px] text-white/40">{isCo ? j.hours.split('·')[0] : j.wageNote}</span>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-black ${tone.chip}`}>
                    🤖 계약 {res.score}점
                  </span>
                  {bad > 0
                    ? <span className="text-[11px] text-white/40">확인할 조항 {bad}개</span>
                    : <span className="text-[11px] text-emerald-300/70">주요 항목 충족</span>}
                </div>
              </Card>
            </button>
          )
        })}
        {list.length === 0 && <div className="sm:col-span-2"><Empty title="검색 결과가 없습니다" sub="다른 키워드로 검색해 보세요" /></div>}
      </div>
    </div>
  )
}

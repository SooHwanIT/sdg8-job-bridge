import { useEffect, useMemo, useState } from 'react'
import { evaluateContract } from '../lib/contractEngine.js'
import { Card } from './ui.jsx'
import { ScoreSummary, FindingsList, Disclaimer } from './ContractReport.jsx'
import ReviewForm from './ReviewForm.jsx'

export default function JobDetail({ job, mode, close, apply, applied, openChat }) {
  const isCo = mode === 'company'
  const [t, setT] = useState('info')
  const result = useMemo(() => evaluateContract(job.contractData), [job])
  const risks = result.counts.violation + result.counts.warn
  const accent = isCo ? 'bg-blue-500' : 'bg-amber-500'
  const accentT = isCo ? 'text-blue-300' : 'text-amber-300'
  const isApplied = applied.includes(job.id)

  // ESC 닫기 + 배경 스크롤 잠금
  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [close])

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950 anim-in" role="dialog" aria-modal="true" aria-label={`${job.name} 상세`}>
      <div className="mx-auto max-w-lg px-4 pb-32 pt-5">
        <div className="flex items-center gap-3">
          <button onClick={close} aria-label="뒤로" className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white outline-none focus-visible:ring-2 focus-visible:ring-white/50">←</button>
          <p className="truncate font-bold text-white">{job.name}</p>
        </div>

        <Card className="mt-4 p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/8 text-3xl" aria-hidden="true">{job.logo}</span>
            <div className="min-w-0">
              <p className="text-xl font-black text-white">{job.name}</p>
              <p className={`text-sm font-bold ${accentT}`}>{isCo ? job.role : job.cat}</p>
              <p className="text-xs text-white/40">{job.loc}</p>
            </div>
          </div>
          <div className="mt-4 rounded-xl bg-black/30 p-4">
            <p className="text-xs text-white/40">{isCo ? '연봉' : '시급'}</p>
            <p className="mt-0.5 text-2xl font-black text-white">{isCo ? job.salary : `${job.wage.toLocaleString()}원`}</p>
            <p className={`mt-0.5 text-xs font-semibold ${accentT}`}>{isCo ? job.career : job.wageNote}</p>
          </div>
        </Card>

        <div className="mt-4 grid grid-cols-3 gap-2" role="tablist" aria-label="상세 탭">
          {[{ id: 'info', n: '정보' }, { id: 'contract', n: isCo ? '계약서' : '조건 체크' }, { id: 'review', n: '리뷰' }].map(x => (
            <button key={x.id} role="tab" aria-selected={t === x.id} onClick={() => setT(x.id)}
              className={`relative rounded-xl py-2.5 text-sm font-bold transition outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${t === x.id ? `${accent} text-white` : 'bg-white/[.05] text-white/60'}`}>
              {x.n}
              {x.id === 'contract' && risks > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[9px] font-black text-white">{risks}</span>
              )}
            </button>
          ))}
        </div>

        {t === 'info' && (
          <div className="mt-4 space-y-3 anim-in">
            <Card className="p-4">
              <p className="text-xs font-bold text-white/40">기업 광고</p>
              <p className="mt-1.5 text-sm italic leading-relaxed text-white/80">“{job.ad}”</p>
            </Card>
            <Card className="p-4">
              <p className="font-bold text-white">근무 조건</p>
              <div className="mt-2 space-y-2">
                {(isCo
                  ? [['업종', job.industry], ['규모', job.size], ['근무시간', job.hours], ['야근수당', job.overtime]]
                  : [['업종', job.cat], ['근무시간', job.hours], ['근무기간', job.period], ['연령', job.age]]
                ).map(([k, v]) => (
                  <div key={k} className="flex gap-3 rounded-lg bg-black/20 px-3 py-2">
                    <span className="w-20 shrink-0 text-xs text-white/40">{k}</span>
                    <span className="min-w-0 flex-1 text-sm text-white/85">{v}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-4">
              <p className="font-bold text-white">{isCo ? '복지' : '혜택'}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(isCo ? job.welfare : job.perks).map(w => (
                  <span key={w} className="rounded-lg bg-white/8 px-2.5 py-1 text-xs text-white/70">{w}</span>
                ))}
              </div>
            </Card>
          </div>
        )}

        {t === 'contract' && (
          <div className="mt-4 space-y-3 anim-in">
            <ScoreSummary result={result} context={isCo ? '근로기준법' : '근로기준법·최저임금법'} />
            <FindingsList findings={result.findings} />
            <Disclaimer />
          </div>
        )}

        {t === 'review' && (
          <div className="mt-4 space-y-3 anim-in">
            {job.reviews.map((r, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{r.u}</span>
                  <span className="text-sm text-amber-300" aria-label={`${r.star}점`}>{'★'.repeat(r.star)}{'☆'.repeat(5 - r.star)}</span>
                  <span className="ml-auto text-xs text-white/30">{r.ym}</span>
                </div>
                <p className="mt-2 text-sm text-emerald-200">👍 {r.pros}</p>
                <p className="mt-1 text-sm text-rose-200">👎 {r.cons}</p>
              </Card>
            ))}
            <ReviewForm />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-lg -translate-x-1/2 border-t border-white/10 bg-neutral-950/95 p-3 backdrop-blur">
        <div className="flex gap-2">
          <button onClick={() => openChat(job)} aria-label="메시지" className="rounded-xl bg-white/10 px-4 py-3.5 font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-white/50">💬</button>
          <a href="tel:1350" aria-label="전화" className="grid place-items-center rounded-xl bg-white/10 px-4 py-3.5 font-bold text-white">📞</a>
          <button onClick={() => apply(job.id)} disabled={isApplied}
            className={`flex-1 rounded-xl py-3.5 font-black transition outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
              isApplied ? 'bg-emerald-400 text-emerald-950' : `${accent} text-white hover:brightness-110`}`}>
            {isApplied ? '✓ 지원 완료' : '마이페이지로 즉시 지원'}
          </button>
        </div>
      </div>
    </div>
  )
}

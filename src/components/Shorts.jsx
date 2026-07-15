import { useState } from 'react'
import { SHORTS } from '../data/db.js'
import { Empty } from './ui.jsx'

export default function Shorts({ mode }) {
  const src = SHORTS.filter(s => s.kind === (mode === 'company' ? '회사' : '알바'))
  const [i, setI] = useState(0)
  const [st, setSt] = useState({})
  if (src.length === 0) return <Empty icon="🎬" title="영상이 없습니다" />
  const s = src[i]
  const k = s.id
  const cur = st[k] || {}
  const tog = f => setSt({ ...st, [k]: { ...cur, [f]: !cur[f] } })
  const go = d => setI((i + d + src.length) % src.length)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-black text-white">쇼츠 🎬</h2>
        <p className="mt-1 text-sm text-white/45">{mode === 'company' ? '회사' : '알바'} 영상만 나옵니다 · 저장하면 나중에 다시 보기 편해요</p>
      </div>

      <div className="relative mx-auto aspect-[9/16] w-full max-w-sm overflow-hidden rounded-3xl ring-1 ring-white/15">
        <div className={`absolute inset-0 bg-gradient-to-br ${s.color}`} />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 grid place-items-center"><span className="text-8xl drop-shadow-2xl soft-pulse" aria-hidden="true">{s.emoji}</span></div>

        <span className="absolute left-3 top-3 rounded-lg bg-black/50 px-2 py-1 text-[11px] font-black text-white">{s.kind}</span>

        <div className="absolute bottom-0 left-0 right-16 bg-gradient-to-t from-black/85 to-transparent p-4 pt-16">
          <p className="text-sm font-bold text-white/90">@{s.user}</p>
          <p className="mt-1 text-lg font-bold leading-snug text-white">{s.title}</p>
        </div>

        <div className="absolute bottom-6 right-3 flex flex-col items-center gap-4">
          {[
            { f: 'like', on: '❤️', off: '🤍', lab: '좋아요', n: s.likes + (cur.like ? 1 : 0) },
            { f: 'save', on: '🔖', off: '📑', lab: '저장', n: s.saves + (cur.save ? 1 : 0) },
            { f: 'sub', on: '🔔', off: '🔕', lab: '구독', n: s.subs + (cur.sub ? 1 : 0) },
          ].map(b => (
            <button key={b.f} onClick={() => tog(b.f)} aria-pressed={!!cur[b.f]} aria-label={b.lab} className="flex flex-col items-center transition active:scale-90">
              <span className="text-2xl drop-shadow" aria-hidden="true">{cur[b.f] ? b.on : b.off}</span>
              <span className="text-[11px] font-bold text-white drop-shadow">{b.n > 9999 ? (b.n / 1000).toFixed(0) + 'K' : b.n.toLocaleString()}</span>
            </button>
          ))}
        </div>

        <button onClick={() => go(-1)} aria-label="이전 영상" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white outline-none focus-visible:ring-2 focus-visible:ring-white/60">▲</button>
        <button onClick={() => go(1)} aria-label="다음 영상" className="absolute right-3 top-14 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white outline-none focus-visible:ring-2 focus-visible:ring-white/60">▼</button>
      </div>
      <p className="text-center text-xs text-white/40">{i + 1} / {src.length}</p>
    </div>
  )
}

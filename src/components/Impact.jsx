import { IMPACT } from '../data/db.js'
import { Card } from './ui.jsx'

export default function Impact() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-black text-white">임팩트 🌏</h2>
        <p className="mt-1 text-sm text-white/45">JobBridge가 만드는 변화</p>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="bg-gradient-to-br from-rose-500/20 via-fuchsia-500/10 to-transparent p-5">
          <span className="rounded-lg bg-white/10 px-2 py-0.5 text-[11px] font-black text-white/80">SDG 8 · 양질의 일자리와 경제성장</span>
          <p className="mt-3 text-xl font-black leading-snug text-white">{IMPACT.headline}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{IMPACT.sub}</p>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {IMPACT.pillars.map(p => (
          <Card key={p.title} className="p-4">
            <p className="text-3xl" aria-hidden="true">{p.icon}</p>
            <p className="mt-2 font-black text-white">{p.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-white/65">{p.body}</p>
            <p className="mt-3 inline-block rounded-md bg-white/6 px-2 py-0.5 text-[11px] font-bold text-white/50">{p.sdg}</p>
          </Card>
        ))}
      </div>

      <Card className="p-4 ring-white/10">
        <p className="text-[11px] leading-relaxed text-white/40">ⓘ {IMPACT.note}</p>
      </Card>
    </div>
  )
}

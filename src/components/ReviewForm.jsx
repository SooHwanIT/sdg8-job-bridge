import { useState } from 'react'
import { Card } from './ui.jsx'

export default function ReviewForm() {
  const [star, setStar] = useState(5)
  const [pros, setPros] = useState(''); const [cons, setCons] = useState('')
  const [sent, setSent] = useState(false)
  if (sent) return <Card className="p-5 text-center ring-emerald-400/40"><p className="font-bold text-emerald-300">리뷰가 등록되었습니다 ✓</p></Card>
  return (
    <Card className="p-4">
      <p className="font-bold text-white">리뷰 작성</p>
      <div className="mt-2 flex gap-1" role="radiogroup" aria-label="별점">
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} role="radio" aria-checked={n === star} aria-label={`${n}점`}
            onClick={() => setStar(n)} className={`text-2xl outline-none focus-visible:scale-110 ${n <= star ? 'text-amber-300' : 'text-white/15'}`}>★</button>
        ))}
      </div>
      <input value={pros} onChange={e => setPros(e.target.value)} placeholder="좋았던 점" aria-label="좋았던 점"
        className="mt-2 w-full rounded-xl bg-white/8 px-3 py-2.5 text-sm text-white placeholder:text-white/30 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-blue-400" />
      <input value={cons} onChange={e => setCons(e.target.value)} placeholder="아쉬운 점" aria-label="아쉬운 점"
        className="mt-2 w-full rounded-xl bg-white/8 px-3 py-2.5 text-sm text-white placeholder:text-white/30 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-blue-400" />
      <button onClick={() => (pros || cons) && setSent(true)} className="mt-2 w-full rounded-xl bg-white/15 py-2.5 font-bold text-white transition hover:bg-white/20">등록</button>
    </Card>
  )
}

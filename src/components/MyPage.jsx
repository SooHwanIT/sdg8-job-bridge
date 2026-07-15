import { useState } from 'react'
import { COMPANIES, PARTTIMES, NICE_IMPORT } from '../data/db.js'
import { generateCoverLetter, COVER_TONES } from '../lib/coverLetter.js'
import { Card, Skeleton, Empty } from './ui.jsx'

export default function MyPage({ applied, mode, reset, profile, setProfile, cover, setCover }) {
  const [loading, setLoading] = useState(false)
  const [tone, setTone] = useState('sincere')
  const [target, setTarget] = useState('')
  const src = mode === 'company' ? COMPANIES : PARTTIMES
  const myJobs = src.filter(j => applied.includes(j.id))

  const importNice = () => {
    setLoading(true)
    setTimeout(() => { setProfile(NICE_IMPORT); setLoading(false) }, 1200)
  }
  const genCover = () => {
    if (!profile) return
    setCover(generateCoverLetter(profile, { tone, target }))
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-white">마이페이지</h2>
        <p className="mt-1 text-sm text-white/45">한 번 채워두면 지원은 클릭 한 번</p>
      </div>

      {loading ? (
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="flex-1 space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-32" /></div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2"><Skeleton className="h-14" /><Skeleton className="h-14" /></div>
          <p className="mt-3 text-center text-xs text-white/40">나이스에서 성적·출결·자격증을 불러오는 중…</p>
        </Card>
      ) : !profile ? (
        <Card className="p-6 text-center">
          <p className="text-4xl" aria-hidden="true">📥</p>
          <p className="mt-3 font-bold text-white">내 정보 불러오기</p>
          <p className="mt-1 text-sm text-white/45">나이스(NEIS)·학교생활기록부에서<br />성적·출결·자격증을 자동으로 가져옵니다</p>
          <button onClick={importNice} className="mt-4 w-full rounded-xl bg-blue-500 py-3.5 font-black text-white transition hover:brightness-110">
            나이스에서 불러오기
          </button>
        </Card>
      ) : (
        <>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-blue-500 text-2xl font-black text-white">{profile.name[0]}</span>
              <div>
                <p className="text-xl font-black text-white">{profile.name}</p>
                <p className="text-sm text-white/50">만 {profile.age}세 · {profile.school}</p>
              </div>
              <span className="ml-auto rounded-lg bg-emerald-400/15 px-2 py-1 text-[10px] font-black text-emerald-200">NEIS 연동됨</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-black/25 p-3"><p className="text-[11px] text-white/40">성적</p><p className="text-sm font-bold text-white">{profile.gpa}</p></div>
              <div className="rounded-xl bg-black/25 p-3"><p className="text-[11px] text-white/40">출결</p><p className="text-sm font-bold text-white">{profile.attend}</p></div>
            </div>
            <p className="mt-3 text-xs font-bold text-blue-300">자격증</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {profile.certs.map(c => <span key={c} className="rounded-lg bg-blue-400/15 px-2 py-1 text-xs text-blue-200">{c}</span>)}
            </div>
            <p className="mt-3 text-xs font-bold text-amber-300">수상 · 활동</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {profile.awards.map(c => <span key={c} className="rounded-lg bg-amber-400/15 px-2 py-1 text-xs text-amber-200">{c}</span>)}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-white">AI 자기소개서</p>
              <button onClick={genCover} className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-bold text-white transition hover:brightness-110">🤖 AI 초안 생성</button>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-white/40">어조</span>
              {COVER_TONES.map(t => (
                <button key={t.key} onClick={() => setTone(t.key)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${tone === t.key ? 'bg-blue-500 text-white' : 'bg-white/8 text-white/55'}`}>{t.label}</button>
              ))}
            </div>
            <input value={target} onChange={e => setTarget(e.target.value)} placeholder="지원 대상(선택) · 예: 카페 온도 바리스타" aria-label="지원 대상"
              className="mt-2 w-full rounded-xl bg-white/8 px-3 py-2.5 text-sm text-white placeholder:text-white/30 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-blue-400" />
            <textarea value={cover} onChange={e => setCover(e.target.value)} rows={9} aria-label="자기소개서 초안"
              placeholder="AI 초안 생성을 누르면 내 정보(자격증·출결·수상)로 자소서 초안을 만들어 줍니다. 생성 후 자유롭게 편집하세요."
              className="mt-2 w-full resize-none rounded-xl bg-white/8 p-3 text-sm leading-relaxed text-white placeholder:text-white/30 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-blue-400" />
            {cover && <p className="mt-1.5 text-[11px] text-white/35">✍️ 초안은 편집 가능합니다. 나만의 경험을 한두 문장 더해 보세요.</p>}
          </Card>
        </>
      )}

      <div>
        <p className="mb-2 font-bold text-white">지원 현황 ({myJobs.length})</p>
        <div className="space-y-2">
          {myJobs.map(j => (
            <Card key={j.id} className="flex items-center gap-3 p-4">
              <span className="text-2xl" aria-hidden="true">{j.logo}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-white">{j.name}</p>
                <p className="truncate text-xs text-white/40">{mode === 'company' ? j.role : j.cat}</p>
              </div>
              <span className="shrink-0 rounded-lg bg-amber-400/20 px-2 py-1 text-[10px] font-black text-amber-200">서류 검토중</span>
            </Card>
          ))}
          {myJobs.length === 0 && <Empty icon="📄" title="아직 지원한 곳이 없습니다" sub="공고에서 마음에 드는 곳에 지원해 보세요" />}
        </div>
      </div>

      <button onClick={reset} className="w-full rounded-xl bg-white/5 py-3 text-sm text-white/40 transition hover:bg-white/8">← 회사 / 알바 다시 고르기</button>
    </div>
  )
}

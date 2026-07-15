import { useEffect, useState } from 'react'
import { loadState, saveState } from './lib/storage.js'
import Gate from './components/Gate.jsx'
import JobList from './components/JobList.jsx'
import JobDetail from './components/JobDetail.jsx'
import ContractChecker from './components/ContractChecker.jsx'
import Chat from './components/Chat.jsx'
import Shorts from './components/Shorts.jsx'
import MyPage from './components/MyPage.jsx'
import Impact from './components/Impact.jsx'

export default function App() {
  // ── 하이드레이션(로딩 → 상태 복원) ──
  const [hydrated, setHydrated] = useState(false)
  const [mode, setMode] = useState(null)
  const [applied, setApplied] = useState([])
  const [profile, setProfile] = useState(null)
  const [cover, setCover] = useState('')

  const [tab, setTab] = useState('list')
  const [job, setJob] = useState(null)
  const [chat, setChat] = useState(null)

  useEffect(() => {
    const s = loadState()
    setMode(s.mode); setApplied(s.applied); setProfile(s.profile); setCover(s.cover)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveState({ mode, applied, profile, cover })
  }, [hydrated, mode, applied, profile, cover])

  // 로딩 스플래시(짧지만 시크릿모드/저사양에서 안전)
  if (!hydrated) {
    return (
      <div className="grid min-h-full place-items-center bg-neutral-950">
        <div className="text-center">
          <p className="text-4xl soft-pulse" aria-hidden="true">💼</p>
          <p className="mt-3 text-sm text-white/40" role="status">불러오는 중…</p>
        </div>
      </div>
    )
  }

  if (!mode) return <Gate pick={m => { setMode(m); setTab('list') }} />

  const isCo = mode === 'company'
  const themeT = isCo ? 'text-blue-300' : 'text-amber-300'
  const activeBg = isCo ? 'bg-blue-500/15 text-blue-200' : 'bg-amber-500/15 text-amber-200'

  const TABS = [
    { id: 'list', label: isCo ? '채용' : '공고', icon: isCo ? '🏢' : '⏰' },
    { id: 'check', label: '계약검토', icon: '🔍' },
    { id: 'shorts', label: '쇼츠', icon: '🎬' },
    { id: 'my', label: '마이', icon: '👤' },
    { id: 'impact', label: '임팩트', icon: '🌏' },
  ]

  const view = (
    <>
      {tab === 'list' && <JobList mode={mode} open={setJob} applied={applied} />}
      {tab === 'check' && <ContractChecker />}
      {tab === 'shorts' && <Shorts mode={mode} />}
      {tab === 'my' && <MyPage applied={applied} mode={mode} reset={() => setMode(null)}
        profile={profile} setProfile={setProfile} cover={cover} setCover={setCover} />}
      {tab === 'impact' && <Impact />}
    </>
  )

  return (
    <div className="min-h-full bg-neutral-950 text-white">
      <div className={`pointer-events-none fixed inset-0 ${isCo
        ? 'bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,.14),transparent_55%)]'
        : 'bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,.14),transparent_55%)]'}`} />

      <div className="relative mx-auto flex max-w-6xl">
        {/* ── 데스크톱 사이드바 ── */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/10 p-4 md:flex">
          <div className="flex items-center gap-2 px-2">
            <span className="text-xl" aria-hidden="true">💼</span>
            <p className="font-black tracking-tight">JobBridge</p>
          </div>
          <span className={`mt-3 inline-flex w-fit items-center gap-1 rounded-md px-2 py-1 text-[11px] font-black ${isCo ? 'bg-blue-400/20 text-blue-300' : 'bg-amber-400/20 text-amber-300'}`}>
            {isCo ? '🏢 회사 모드' : '⏰ 알바 모드'}
          </span>
          <nav className="mt-5 flex flex-col gap-1" aria-label="주요 메뉴">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} aria-current={tab === t.id ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${tab === t.id ? activeBg : 'text-white/55 hover:bg-white/5 hover:text-white'}`}>
                <span className="text-lg" aria-hidden="true">{t.icon}</span>{t.label}
              </button>
            ))}
          </nav>
          <button onClick={() => setMode(null)} className="mt-auto rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-white/35 transition hover:bg-white/5 hover:text-white">
            ↔ 모드 전환
          </button>
          <p className="mt-2 px-3 text-[10px] leading-relaxed text-white/25">SDG 8 · 양질의 일자리<br />계약 검토는 교육용 · 법률자문 아님</p>
        </aside>

        {/* ── 본문 ── */}
        <main className="min-w-0 flex-1">
          <div className="px-4 pb-28 pt-6 md:px-8 md:pb-10">
            {/* 모바일 헤더 */}
            <header className="mb-6 flex items-center gap-2 md:hidden">
              <span className="text-xl" aria-hidden="true">💼</span>
              <p className="font-black tracking-tight">JobBridge</p>
              <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-black ${isCo ? 'bg-blue-400/20 text-blue-300' : 'bg-amber-400/20 text-amber-300'}`}>
                {isCo ? '회사 모드' : '알바 모드'}
              </span>
              <button onClick={() => setMode(null)} className="ml-auto text-xs font-semibold text-white/35 hover:text-white">전환</button>
            </header>
            <div className="mx-auto max-w-2xl">{view}</div>
          </div>
        </main>
      </div>

      {job && <JobDetail job={job} mode={mode} close={() => setJob(null)} applied={applied}
        apply={id => setApplied(a => [...new Set([...a, id])])} openChat={setChat} />}
      {chat && <Chat job={chat} mode={mode} close={() => setChat(null)} />}

      {/* ── 모바일 하단 탭 ── */}
      <nav className="fixed bottom-0 left-0 z-40 w-full border-t border-white/10 bg-neutral-950/90 backdrop-blur md:hidden" aria-label="하단 탭">
        <div className="flex">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} aria-current={tab === t.id ? 'page' : undefined}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 transition outline-none ${tab === t.id ? themeT : 'text-white/35'}`}>
              <span className="text-lg" aria-hidden="true">{t.icon}</span>
              <span className="text-[10px] font-semibold">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

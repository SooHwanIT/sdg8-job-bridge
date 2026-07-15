import { useEffect, useRef, useState } from 'react'

export default function Chat({ job, close, mode }) {
  const [msgs, setMsgs] = useState([{ r: 'them', t: `안녕하세요, ${job.name}입니다. 무엇을 도와드릴까요?` }])
  const [q, setQ] = useState('')
  const [typing, setTyping] = useState(false)
  const end = useRef(null)
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing])
  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [close])

  const quick = mode === 'company'
    ? ['근무시간이 어떻게 되나요?', '야근수당은 지급되나요?', '서류는 무엇이 필요한가요?', '면접 일정 잡고 싶습니다']
    : ['주휴수당 지급되나요?', '시급 정산일이 언제인가요?', '근로계약서 작성하나요?', '면접 가능한 시간대는?']

  const reply = s => {
    if (/야근|연장/.test(s)) return `${job.name}의 연장근로는 통상임금 150%로 지급됩니다. 상세 내역은 계약서 탭의 AI 검토 결과를 확인해 주세요.`
    if (/주휴/.test(s)) return '주 15시간 이상 근무 시 주휴수당이 법정 의무로 지급됩니다. 저희는 100% 지급합니다.'
    if (/근무시간|시간/.test(s)) return `근무시간은 ${job.hours} 입니다.`
    if (/서류|필요/.test(s)) return '이력서, 자기소개서, 자격증 사본이 필요합니다. 마이페이지에서 한 번에 제출하실 수 있어요.'
    if (/면접|일정/.test(s)) return '이번 주 화·목 오후 2시~5시가 가능합니다. 원하시는 시간을 알려주세요.'
    if (/계약서/.test(s)) return '근로계약서는 근무 시작 전에 반드시 작성하고 1부를 교부해 드립니다.'
    if (/시급|정산/.test(s)) return `시급은 ${job.wage?.toLocaleString() || '-'}원이며, 매월 10일 정산됩니다.`
    return '확인 후 빠르게 답변드리겠습니다. 다른 궁금한 점 있으실까요?'
  }

  const send = text => {
    const s = (text ?? q).trim(); if (!s) return
    setMsgs(m => [...m, { r: 'me', t: s }]); setQ(''); setTyping(true)
    setTimeout(() => { setTyping(false); setMsgs(m => [...m, { r: 'them', t: reply(s) }]) }, 800)
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-neutral-950 anim-in" role="dialog" aria-modal="true" aria-label={`${job.name} 메시지`}>
      <div className="mx-auto flex w-full max-w-lg items-center gap-3 border-b border-white/10 p-4">
        <button onClick={close} aria-label="닫기" className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white outline-none focus-visible:ring-2 focus-visible:ring-white/50">←</button>
        <span className="text-xl" aria-hidden="true">{job.logo}</span>
        <div className="min-w-0">
          <p className="truncate font-bold text-white">{job.name}</p>
          <p className="text-[11px] text-emerald-300">● 응답 평균 12분</p>
        </div>
        <a href="tel:1350" aria-label="전화" className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-400 text-emerald-950">📞</a>
      </div>

      <div className="mx-auto w-full max-w-lg flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.r === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm anim-in ${m.r === 'me' ? 'bg-blue-500 text-white' : 'bg-white/[.07] text-white/85'}`}>{m.t}</div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-white/[.07] px-4 py-3 text-sm text-white/60">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}
        <div ref={end} />
      </div>

      <div className="mx-auto w-full max-w-lg border-t border-white/10 p-3">
        <div className="mb-2 flex gap-1.5 overflow-x-auto no-sb">
          {quick.map(x => (
            <button key={x} onClick={() => send(x)} className="shrink-0 rounded-full bg-white/8 px-3 py-1.5 text-xs text-white/60 transition hover:bg-white/12">{x}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="메시지 입력" aria-label="메시지 입력"
            className="min-w-0 flex-1 rounded-xl bg-white/8 px-4 py-3 text-white placeholder:text-white/30 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-blue-400" />
          <button onClick={() => send()} className="shrink-0 rounded-xl bg-blue-500 px-5 font-bold text-white transition hover:brightness-110">전송</button>
        </div>
      </div>
    </div>
  )
}

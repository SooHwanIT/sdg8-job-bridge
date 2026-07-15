// 모드 선택 게이트 — 회사 / 알바 완전 분리의 첫 관문
export default function Gate({ pick }) {
  const onKey = (m) => (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(m) } }
  return (
    <div className="grid min-h-full place-items-center bg-neutral-950 p-6">
      <div className="w-full max-w-md">
        <p className="text-center text-4xl" aria-hidden="true">💼</p>
        <h1 className="mt-3 text-center text-3xl font-black text-white">JobBridge</h1>
        <p className="mt-2 text-center text-sm text-white/45">
          회사와 알바를 <b className="text-white/70">완전히 분리</b>했습니다.<br />섞이지 않으니 헷갈릴 일이 없습니다.
        </p>

        <div className="mt-8 space-y-3">
          <button onClick={() => pick('company')} onKeyDown={onKey('company')}
            className="group w-full overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-500 p-6 text-left transition hover:brightness-110 active:scale-[.98] focus-visible:ring-4 focus-visible:ring-blue-300/50 outline-none">
            <p className="text-4xl" aria-hidden="true">🏢</p>
            <p className="mt-3 text-2xl font-black text-white">회사</p>
            <p className="mt-1 text-sm text-white/70">정규직 · 계약직 채용<br />연봉 · 야근수당 · 계약서 AI 검토</p>
            <p className="mt-3 text-xs font-bold text-white/80">회사 공고만 표시됩니다 →</p>
          </button>

          <button onClick={() => pick('part')} onKeyDown={onKey('part')}
            className="group w-full overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-6 text-left transition hover:brightness-110 active:scale-[.98] focus-visible:ring-4 focus-visible:ring-amber-300/50 outline-none">
            <p className="text-4xl" aria-hidden="true">⏰</p>
            <p className="mt-3 text-2xl font-black text-white">알바</p>
            <p className="mt-1 text-sm text-white/85">시간제 · 단기<br />시급 · 주휴수당 · 야간 가산 확인</p>
            <p className="mt-3 text-xs font-bold text-white/90">알바 공고만 표시됩니다 →</p>
          </button>
        </div>
        <p className="mt-6 text-center text-xs text-white/25">SDG 8 · 양질의 일자리와 경제성장</p>
      </div>
    </div>
  )
}

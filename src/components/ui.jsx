// 공용 UI 프리미티브
export const Card = ({ className = '', children, ...p }) => (
  <div {...p} className={`rounded-2xl bg-white/[.04] ring-1 ring-white/10 ${className}`}>{children}</div>
)

// 상태 → 색상 토큰
export const TONE = {
  emerald: { text: 'text-emerald-300', ring: 'ring-emerald-500/40', bg: 'bg-emerald-400', chip: 'bg-emerald-400/15 text-emerald-200', dot: 'bg-emerald-400' },
  amber:   { text: 'text-amber-300',   ring: 'ring-amber-500/40',   bg: 'bg-amber-400',   chip: 'bg-amber-400/15 text-amber-200',   dot: 'bg-amber-400' },
  rose:    { text: 'text-rose-300',    ring: 'ring-rose-500/50',    bg: 'bg-rose-500',    chip: 'bg-rose-500/15 text-rose-200',    dot: 'bg-rose-500' },
  blue:    { text: 'text-blue-300',    ring: 'ring-blue-500/40',    bg: 'bg-blue-500',    chip: 'bg-blue-400/15 text-blue-200',    dot: 'bg-blue-400' },
}

export const statusTone = (s) => (s === 'violation' ? TONE.rose : s === 'warn' ? TONE.amber : TONE.emerald)
export const statusMark = (s) => (s === 'violation' ? '!' : s === 'warn' ? '?' : '✓')
export const statusLabel = (s) => (s === 'violation' ? '위반 소지' : s === 'warn' ? '확인 필요' : '적법')

// 원형 점수 게이지 (SVG)
export function ScoreRing({ score, tone = TONE.emerald, size = 92 }) {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  const off = c * (1 - Math.max(0, Math.min(100, score)) / 100)
  const stroke =
    tone === TONE.rose ? '#f43f5e' : tone === TONE.amber ? '#f59e0b' : '#34d399'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" role="img"
      aria-label={`계약 준수 점수 100점 만점에 ${score}점`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.10)" strokeWidth="8" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={stroke} strokeWidth="8"
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} className="ring-anim" />
      <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle"
        className="fill-white font-black" style={{ fontSize: size * 0.3 }}>{score}</text>
      <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle"
        className="fill-white/40" style={{ fontSize: size * 0.12 }}>/ 100</text>
    </svg>
  )
}

// 로딩 스켈레톤
export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-xl bg-white/[.06] ${className}`} />
)

// 빈 상태
export const Empty = ({ icon = '🔍', title, sub }) => (
  <div className="py-12 text-center">
    <p className="text-4xl">{icon}</p>
    <p className="mt-3 font-bold text-white/70">{title}</p>
    {sub && <p className="mt-1 text-sm text-white/35">{sub}</p>}
  </div>
)

// 내 계약서 직접 검토 — 사용자가 조건을 입력하면 규칙엔진이 실시간 판정
import { useMemo, useState } from 'react'
import { blankContract, evaluateContract } from '../lib/contractEngine.js'
import { LABOR } from '../lib/laborLaw.js'
import { Card } from './ui.jsx'
import { ScoreSummary, FindingsList, Disclaimer } from './ContractReport.jsx'

const EMP_TYPES = [
  { key: 'regular', label: '정규직' },
  { key: 'contract', label: '계약직' },
  { key: 'parttime', label: '아르바이트' },
  { key: 'freelance', label: '프리랜서(3.3%)' },
]

// 데모 프리셋 — 흔한 위험 계약을 원클릭으로 시연
const PRESETS = [
  {
    key: 'lowwage', label: '최저임금 미달', emoji: '🚩',
    patch: { employmentType: 'parttime', hourlyWage: 9000, weeklyHours: 20, paysWeeklyHolidayAllowance: false, hasWrittenContract: false, socialInsurance: ['산재'] },
  },
  {
    key: 'penalty', label: '위약금 계약', emoji: '⛓️',
    patch: { employmentType: 'contract', contractTermMonths: 6, hourlyWage: 12000, weeklyHours: 40, hasPenaltyClause: true, hasProbation: true, probationWagePct: 80 },
  },
  {
    key: 'night', label: '야간 알바(정상)', emoji: '🌙',
    patch: { employmentType: 'parttime', hourlyWage: 12000, weeklyHours: 30, hasNightWork: true, nightRate: 0.5, paysWeeklyHolidayAllowance: true },
  },
]

// 재사용 폼 조각
function Row({ label, hint, children }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-black/20 px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white/85">{label}</p>
        {hint && <p className="text-[11px] text-white/35">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ on, set, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => set(!on)}
      className={`relative h-6 w-11 rounded-full transition ${on ? 'bg-emerald-400' : 'bg-white/15'} focus-visible:ring-2 focus-visible:ring-white/60 outline-none`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  )
}

function NumInput({ value, set, suffix, w = 'w-24', step = 100, min = 0, aria }) {
  return (
    <div className="flex items-center gap-1">
      <input type="number" inputMode="numeric" value={value ?? ''} step={step} min={min} aria-label={aria}
        onChange={(e) => set(e.target.value === '' ? null : Number(e.target.value))}
        className={`${w} rounded-lg bg-white/8 px-2.5 py-1.5 text-right text-sm font-bold text-white ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-blue-400`} />
      {suffix && <span className="text-xs text-white/40">{suffix}</span>}
    </div>
  )
}

export default function ContractChecker() {
  const [c, setC] = useState(() => blankContract())
  const set = (patch) => setC((prev) => ({ ...prev, ...patch }))
  const result = useMemo(() => evaluateContract(c), [c])

  const applyPreset = (p) => setC({ ...blankContract(), ...p.patch })

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-black text-white">내 계약서 직접 검토 🔍</h2>
        <p className="mt-1 text-sm text-white/45">
          내 근로조건을 입력하면 근로기준법 규칙엔진이 <b className="text-white/70">실시간</b>으로 위험 조항을 찾아냅니다.
        </p>
      </div>

      {/* 프리셋 */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button key={p.key} onClick={() => applyPreset(p)}
            className="rounded-full bg-white/[.06] px-3 py-1.5 text-xs font-bold text-white/70 ring-1 ring-white/10 transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-blue-400 outline-none">
            {p.emoji} {p.label} 예시
          </button>
        ))}
        <button onClick={() => setC(blankContract())}
          className="rounded-full px-3 py-1.5 text-xs font-semibold text-white/40 hover:text-white outline-none">초기화 ↺</button>
      </div>

      {/* 실시간 점수 */}
      <ScoreSummary result={result} />

      {/* 입력 폼 */}
      <Card className="p-4">
        <p className="mb-2 text-xs font-black text-white/40">고용 형태 · 임금</p>
        <div className="space-y-2">
          <Row label="고용 형태">
            <div className="flex flex-wrap justify-end gap-1">
              {EMP_TYPES.map((t) => (
                <button key={t.key} onClick={() => set({ employmentType: t.key })}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${c.employmentType === t.key ? 'bg-blue-500 text-white' : 'bg-white/8 text-white/55'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </Row>
          <Row label="시급" hint={`2025 최저임금 ${LABOR.MIN_WAGE_2025.toLocaleString()}원`}>
            <NumInput value={c.hourlyWage} set={(v) => set({ hourlyWage: v })} suffix="원" step={100} aria="시급" />
          </Row>
          <Row label="주 소정근로시간" hint="15시간 이상이면 주휴수당 발생">
            <NumInput value={c.weeklyHours} set={(v) => set({ weeklyHours: v })} suffix="시간" w="w-20" step={1} aria="주 근로시간" />
          </Row>
          <Row label="계약기간" hint="비우면 기간의 정함 없음(무기)">
            <NumInput value={c.contractTermMonths} set={(v) => set({ contractTermMonths: v })} suffix="개월" w="w-20" step={1} aria="계약기간(개월)" />
          </Row>
        </div>

        <p className="mb-2 mt-4 text-xs font-black text-white/40">수당</p>
        <div className="space-y-2">
          <Row label="주휴수당 지급"><Toggle on={!!c.paysWeeklyHolidayAllowance} set={(v) => set({ paysWeeklyHolidayAllowance: v })} label="주휴수당 지급" /></Row>
          <Row label="연장근로 있음"><Toggle on={!!c.hasOvertime} set={(v) => set({ hasOvertime: v })} label="연장근로" /></Row>
          {c.hasOvertime && (
            <Row label="연장 가산율" hint="통상임금 150% = 1.5">
              <NumInput value={c.overtimeRate} set={(v) => set({ overtimeRate: v })} suffix="배" w="w-16" step={0.1} aria="연장 가산율" />
            </Row>
          )}
          <Row label="야간근로 있음" hint="22:00~06:00"><Toggle on={!!c.hasNightWork} set={(v) => set({ hasNightWork: v })} label="야간근로" /></Row>
          {c.hasNightWork && (
            <Row label="야간 가산율" hint="50% 가산 = 0.5">
              <NumInput value={c.nightRate} set={(v) => set({ nightRate: v })} suffix="배" w="w-16" step={0.1} aria="야간 가산율" />
            </Row>
          )}
          <Row label="휴일근로 있음"><Toggle on={!!c.hasHolidayWork} set={(v) => set({ hasHolidayWork: v })} label="휴일근로" /></Row>
          {c.hasHolidayWork && (
            <Row label="휴일 가산율" hint="8시간 이내 0.5">
              <NumInput value={c.holidayRate} set={(v) => set({ holidayRate: v })} suffix="배" w="w-16" step={0.1} aria="휴일 가산율" />
            </Row>
          )}
        </div>

        <p className="mb-2 mt-4 text-xs font-black text-white/40">수습 · 조항</p>
        <div className="space-y-2">
          <Row label="서면 근로계약서 교부"><Toggle on={!!c.hasWrittenContract} set={(v) => set({ hasWrittenContract: v })} label="서면 계약서 교부" /></Row>
          <Row label="수습 기간 있음"><Toggle on={!!c.hasProbation} set={(v) => set({ hasProbation: v })} label="수습 기간" /></Row>
          {c.hasProbation && (
            <Row label="수습 급여 비율" hint="최저임금의 90% 이상만 적법">
              <NumInput value={c.probationWagePct} set={(v) => set({ probationWagePct: v })} suffix="%" w="w-16" step={5} aria="수습 급여 비율" />
            </Row>
          )}
          <Row label="위약금 · 손해배상 예정 조항" hint="제20조 — 금지"><Toggle on={!!c.hasPenaltyClause} set={(v) => set({ hasPenaltyClause: v })} label="위약금 조항" /></Row>
          <Row label="재량근로시간제 적용"><Toggle on={!!c.isDiscretionary} set={(v) => set({ isDiscretionary: v })} label="재량근로제" /></Row>
          {c.isDiscretionary && (
            <Row label="법정 대상 업무 해당" hint="연구·설계·취재 등 6개 업무만">
              <Toggle on={!!c.discretionaryEligible} set={(v) => set({ discretionaryEligible: v })} label="재량근로 대상 업무" />
            </Row>
          )}
          <Row label="연차휴가 명시"><Toggle on={!!c.annualLeaveSpecified} set={(v) => set({ annualLeaveSpecified: v })} label="연차휴가 명시" /></Row>
        </div>
      </Card>

      {/* 판정 결과 */}
      <div>
        <p className="mb-2 px-1 text-sm font-bold text-white/70">판정 결과 ({result.checked})</p>
        <FindingsList findings={result.findings} />
      </div>

      <Disclaimer />
    </div>
  )
}

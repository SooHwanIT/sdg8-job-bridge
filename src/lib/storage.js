// ─────────────────────────────────────────────────────────────
// 버전드 localStorage — 안전 하이드레이션(시크릿 모드/차단 대응)
// ─────────────────────────────────────────────────────────────
const KEY = 'jobbridge'
const VERSION = 2

const DEFAULT_STATE = {
  mode: null,        // 'company' | 'part'
  applied: [],       // 지원한 공고 id
  profile: null,     // 불러온 프로필
  cover: '',         // 자소서 초안
}

function safeStore() {
  try {
    const t = '__jb_test__'
    window.localStorage.setItem(t, '1')
    window.localStorage.removeItem(t)
    return window.localStorage
  } catch {
    return null
  }
}

export function loadState() {
  const store = safeStore()
  if (!store) return { ...DEFAULT_STATE, _persist: false }
  try {
    const raw = store.getItem(KEY)
    if (!raw) return { ...DEFAULT_STATE, _persist: true }
    const parsed = JSON.parse(raw)
    if (!parsed || parsed.v !== VERSION) {
      const migrated = migrate(parsed)
      return { ...DEFAULT_STATE, ...migrated, _persist: true }
    }
    return { ...DEFAULT_STATE, ...parsed.data, _persist: true }
  } catch {
    return { ...DEFAULT_STATE, _persist: true }
  }
}

export function saveState(state) {
  const store = safeStore()
  if (!store) return
  try {
    const data = {
      mode: state.mode ?? null,
      applied: Array.isArray(state.applied) ? state.applied : [],
      profile: state.profile ?? null,
      cover: state.cover ?? '',
    }
    store.setItem(KEY, JSON.stringify({ v: VERSION, data }))
  } catch {}
}

function migrate(old) {
  if (!old) return {}
  const src = old.data || old
  return {
    mode: src.mode ?? null,
    applied: Array.isArray(src.applied) ? src.applied : [],
    profile: src.profile ?? null,
    cover: src.cover ?? '',
  }
}

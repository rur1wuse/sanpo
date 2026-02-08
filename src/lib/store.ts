import { create } from 'zustand'
import { Suggestion } from '../types'

interface AppState {
  currentWhere: Suggestion | null
  currentWhat: Suggestion | null
  setCurrentWhere: (suggestion: Suggestion | null) => void
  setCurrentWhat: (suggestion: Suggestion | null) => void
  reset: () => void
}

export const useAppStore = create<AppState>((set) => ({
  currentWhere: null,
  currentWhat: null,
  setCurrentWhere: (suggestion) => set({ currentWhere: suggestion }),
  setCurrentWhat: (suggestion) => set({ currentWhat: suggestion }),
  reset: () => set({ currentWhere: null, currentWhat: null }),
}))

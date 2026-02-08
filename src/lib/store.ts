import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Suggestion, TaskGroup } from '../types'

interface AppState {
  currentWhere: Suggestion | null
  currentWhat: Suggestion | null
  taskGroups: TaskGroup[]
  activeGroupId: string | null
  setCurrentWhere: (suggestion: Suggestion | null) => void
  setCurrentWhat: (suggestion: Suggestion | null) => void
  setTaskGroups: (groups: TaskGroup[]) => void
  setActiveGroupId: (id: string | null) => void
  reset: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentWhere: null,
      currentWhat: null,
      taskGroups: [],
      activeGroupId: null,
      setCurrentWhere: (suggestion) => set({ currentWhere: suggestion }),
      setCurrentWhat: (suggestion) => set({ currentWhat: suggestion }),
      setTaskGroups: (groups) => set({ taskGroups: groups }),
      setActiveGroupId: (id) => set({ activeGroupId: id }),
      reset: () => set({ currentWhere: null, currentWhat: null }),
    }),
    {
      name: 'sanpo-storage',
      partialize: (state) => ({ 
        currentWhere: state.currentWhere, 
        currentWhat: state.currentWhat,
        taskGroups: state.taskGroups,
        activeGroupId: state.activeGroupId
      }),
    }
  )
)

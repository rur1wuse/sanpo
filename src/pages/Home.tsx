import { useState, useEffect } from 'react'
import { MapPin, Activity, RefreshCw, Layers } from 'lucide-react'
import { useAppStore } from '../lib/store'
import { getRandomSuggestion, saveSuggestionHistory, getAvailableTaskGroups } from '../lib/api'
import { cn } from '../lib/utils'
import { TaskGroup } from '../types'

export default function Home() {
  const { currentWhere, currentWhat, setCurrentWhere, setCurrentWhat } = useAppStore()
  const [loadingWhere, setLoadingWhere] = useState(false)
  const [loadingWhat, setLoadingWhat] = useState(false)
  
  const [groups, setGroups] = useState<TaskGroup[]>([])
  const [activeGroupId, setActiveGroupId] = useState<string | undefined>(undefined)

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    const data = await getAvailableTaskGroups()
    setGroups(data)
    // Find default group to set as active initially
    const defaultGroup = data.find(g => g.is_default)
    if (defaultGroup) {
      setActiveGroupId(defaultGroup.id)
    } else if (data.length > 0) {
      setActiveGroupId(data[0].id)
    }
  }

  const handleGenerateWhere = async () => {
    setLoadingWhere(true)
    try {
      const suggestion = await getRandomSuggestion('where', activeGroupId)
      setCurrentWhere(suggestion)
      // If we have both suggestions, save to history
      if (currentWhat && suggestion) {
        saveSuggestionHistory(suggestion.content, currentWhat.content)
      }
    } finally {
      setLoadingWhere(false)
    }
  }

  const handleGenerateWhat = async () => {
    setLoadingWhat(true)
    try {
      const suggestion = await getRandomSuggestion('what', activeGroupId)
      setCurrentWhat(suggestion)
      // If we have both suggestions, save to history
      if (currentWhere && suggestion) {
        saveSuggestionHistory(currentWhere.content, suggestion.content)
      }
    } finally {
      setLoadingWhat(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col space-y-6">
      <header className="py-4">
        <h1 className="text-2xl font-bold text-[#2D5016]">今天去哪散步？</h1>
        <p className="text-[#2D5016]/60 mt-1">随遇而安，享受当下的每一步</p>
      </header>

      {/* Task Group Selector */}
      {groups.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => setActiveGroupId(group.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5",
                activeGroupId === group.id
                  ? "bg-[#2D5016] text-white shadow-md"
                  : "bg-white text-[#2D5016]/60 border border-[#2D5016]/10"
              )}
            >
              <Layers size={14} />
              {group.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col gap-6 justify-center">
        {/* Where Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MapPin size={20} />
              去哪里
            </h2>
            {currentWhere && (
              <button 
                onClick={handleGenerateWhere}
                disabled={loadingWhere}
                className="text-sm text-[#2D5016]/60 flex items-center gap-1 hover:text-[#2D5016]"
              >
                <RefreshCw size={14} className={cn(loadingWhere && "animate-spin")} />
                重新决定
              </button>
            )}
          </div>
          
          {currentWhere ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#2D5016]/10 min-h-[120px] flex items-center justify-center text-center">
              <p className="text-xl font-medium text-[#2D5016]">{currentWhere.content}</p>
            </div>
          ) : (
            <button
              onClick={handleGenerateWhere}
              disabled={loadingWhere}
              className="w-full bg-[#2D5016] text-[#F5E6D3] rounded-2xl p-6 shadow-md active:scale-[0.98] transition-all min-h-[120px] flex flex-col items-center justify-center gap-3 hover:bg-[#2D5016]/90"
            >
              <MapPin size={32} />
              <span className="text-lg font-medium">决定去哪里</span>
            </button>
          )}
        </div>

        {/* What Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Activity size={20} />
              做什么
            </h2>
            {currentWhat && (
              <button 
                onClick={handleGenerateWhat}
                disabled={loadingWhat}
                className="text-sm text-[#2D5016]/60 flex items-center gap-1 hover:text-[#2D5016]"
              >
                <RefreshCw size={14} className={cn(loadingWhat && "animate-spin")} />
                重新决定
              </button>
            )}
          </div>

          {currentWhat ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#2D5016]/10 min-h-[120px] flex items-center justify-center text-center">
              <p className="text-xl font-medium text-[#2D5016]">{currentWhat.content}</p>
            </div>
          ) : (
            <button
              onClick={handleGenerateWhat}
              disabled={loadingWhat}
              className="w-full bg-[#E8DCC8] text-[#2D5016] rounded-2xl p-6 shadow-md active:scale-[0.98] transition-all min-h-[120px] flex flex-col items-center justify-center gap-3 hover:bg-[#E8DCC8]/80"
            >
              <Activity size={32} />
              <span className="text-lg font-medium">决定做什么</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

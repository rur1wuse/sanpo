import { useEffect, useState } from 'react'
import { Calendar, MapPin, Activity } from 'lucide-react'
import { SuggestionHistory } from '../types'
import { getHistory } from '../lib/api'

export default function HistoryPage() {
  const [history, setHistory] = useState<SuggestionHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const data = await getHistory()
      setHistory(data)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="flex-1 flex flex-col space-y-6">
      <header className="py-4">
        <h1 className="text-2xl font-bold text-[#2D5016]">散步记录</h1>
        <p className="text-[#2D5016]/60 mt-1">回顾你的足迹和心情</p>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D5016]"></div>
        </div>
      ) : history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-[#2D5016]/40 gap-4">
          <Calendar size={48} />
          <p>还没有散步记录，快去创造第一次吧！</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl p-5 shadow-sm border border-[#2D5016]/10 space-y-3"
            >
              <div className="text-xs text-[#2D5016]/40 font-medium">
                {formatDate(item.created_at)}
              </div>
              
              <div className="flex gap-3">
                <div className="bg-[#2D5016]/10 p-2 rounded-lg h-fit">
                  <MapPin size={16} className="text-[#2D5016]" />
                </div>
                <div>
                  <div className="text-xs text-[#2D5016]/60 mb-0.5">去哪里</div>
                  <div className="text-[#2D5016] font-medium">{item.where_to_go}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="bg-[#E8DCC8] p-2 rounded-lg h-fit">
                  <Activity size={16} className="text-[#2D5016]" />
                </div>
                <div>
                  <div className="text-xs text-[#2D5016]/60 mb-0.5">做什么</div>
                  <div className="text-[#2D5016] font-medium">{item.what_to_do}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

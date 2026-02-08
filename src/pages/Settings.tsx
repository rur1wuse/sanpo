import { useState, useEffect } from 'react'
import { Trash2, Info, ChevronRight, Plus, Download, Upload, Share2, FolderPlus, QrCode, ScanLine, ChevronDown, ChevronUp, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { clearHistory, getUserTaskGroups, createTaskGroup, addTaskToGroup, deleteTaskGroup, exportTaskGroup, importTaskGroup, getGroupTasks, deleteTask } from '../lib/api'
import { TaskGroup, SuggestionType, Suggestion } from '../types'
import { cn } from '../lib/utils'

export default function Settings() {
  const [clearing, setClearing] = useState(false)
  const [groups, setGroups] = useState<TaskGroup[]>([])
  const [showAddGroup, setShowAddGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDesc, setNewGroupDesc] = useState('')
  
  // Task viewing/creation state
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null)
  const [groupTasks, setGroupTasks] = useState<Suggestion[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [newTaskContent, setNewTaskContent] = useState('')
  const [newTaskType, setNewTaskType] = useState<SuggestionType>('where')
  const [showAddTask, setShowAddTask] = useState(false)

  // Import state
  const [showImport, setShowImport] = useState(false)
  const [importData, setImportData] = useState('')

  // QR Code state
  const [showQRCode, setShowQRCode] = useState(false)
  const [qrCodeData, setQrCodeData] = useState('')
  const [showScanner, setShowScanner] = useState(false)

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    const data = await getUserTaskGroups()
    setGroups(data)
  }

  const handleClearHistory = async () => {
    if (!confirm('确定要清空所有历史记录吗？此操作无法撤销。')) return

    setClearing(true)
    try {
      await clearHistory()
      alert('历史记录已清空')
    } catch (error) {
      console.error(error)
      alert('清空失败，请重试')
    } finally {
      setClearing(false)
    }
  }

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return
    
    const group = await createTaskGroup(newGroupName, newGroupDesc)
    if (group) {
      setGroups([group, ...groups])
      setShowAddGroup(false)
      setNewGroupName('')
      setNewGroupDesc('')
    }
  }

  const handleDeleteGroup = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('确定要删除这个任务组吗？组内所有任务也会被删除。')) return
    
    if (await deleteTaskGroup(id)) {
      setGroups(groups.filter(g => g.id !== id))
      if (selectedGroupId === id) setSelectedGroupId(null)
    }
  }

  const handleAddTask = async () => {
    if (!selectedGroupId || !newTaskContent.trim()) return

    const task = await addTaskToGroup(selectedGroupId, newTaskType, newTaskContent)
    if (task) {
      alert('任务添加成功')
      setNewTaskContent('')
      setShowAddTask(false)
      // If adding to currently expanded group, refresh list
      if (expandedGroupId === selectedGroupId) {
        loadGroupTasks(selectedGroupId)
      }
    } else {
      alert('添加失败')
    }
  }

  const loadGroupTasks = async (groupId: string) => {
    const tasks = await getGroupTasks(groupId)
    setGroupTasks(tasks)
  }

  const handleToggleGroup = async (groupId: string) => {
    if (expandedGroupId === groupId) {
      setExpandedGroupId(null)
      setGroupTasks([])
    } else {
      setExpandedGroupId(groupId)
      await loadGroupTasks(groupId)
    }
  }

  const handleDeleteTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('确定要删除这个任务吗？')) return

    if (await deleteTask(taskId)) {
      setGroupTasks(groupTasks.filter(t => t.id !== taskId))
    }
  }

  const handleExport = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const json = await exportTaskGroup(id)
    if (json) {
      // Copy to clipboard or download
      try {
        await navigator.clipboard.writeText(json)
        alert('任务组数据已复制到剪贴板，可以发送给朋友了！')
      } catch (err) {
        console.error(err)
        alert('复制失败，请手动复制：\n' + json)
      }
    }
  }

  const handleImport = async () => {
    if (!importData.trim()) return
    
    if (await importTaskGroup(importData)) {
      alert('导入成功！')
      loadGroups()
      setShowImport(false)
      setImportData('')
    } else {
      alert('导入失败，请检查数据格式')
    }
  }

  const handleExportQR = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const json = await exportTaskGroup(id)
    if (json) {
      setQrCodeData(json)
      setShowQRCode(true)
    }
  }

  const handleScanResult = (result: any) => {
    if (result && result.length > 0) {
      const data = result[0].rawValue
      setImportData(data)
      setShowScanner(false)
      setShowImport(true)
    }
  }

  return (
    <div className="flex-1 flex flex-col space-y-6">
      <header className="py-4">
        <h1 className="text-2xl font-bold text-[#2D5016]">设置</h1>
        <p className="text-[#2D5016]/60 mt-1">管理任务组与偏好</p>
      </header>

      {/* Task Groups Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#2D5016]">我的任务组</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowScanner(true)}
              className="text-sm bg-[#E8DCC8] text-[#2D5016] px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <ScanLine size={14} /> 扫码
            </button>
            <button 
              onClick={() => setShowImport(true)}
              className="text-sm bg-[#E8DCC8] text-[#2D5016] px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Download size={14} /> 导入
            </button>
            <button 
              onClick={() => setShowAddGroup(true)}
              className="text-sm bg-[#2D5016] text-white px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Plus size={14} /> 新建
            </button>
          </div>
        </div>

        {/* Add Group Form */}
        {showAddGroup && (
          <div className="bg-white p-4 rounded-xl border border-[#2D5016]/10 space-y-3">
            <input
              type="text"
              placeholder="任务组名称"
              className="w-full p-2 border rounded-lg"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
            />
            <input
              type="text"
              placeholder="描述（可选）"
              className="w-full p-2 border rounded-lg"
              value={newGroupDesc}
              onChange={e => setNewGroupDesc(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddGroup(false)} className="px-3 py-1 text-sm text-gray-500">取消</button>
              <button onClick={handleCreateGroup} className="px-3 py-1 text-sm bg-[#2D5016] text-white rounded-lg">创建</button>
            </div>
          </div>
        )}

        {/* Import Form */}
        {showImport && (
          <div className="bg-white p-4 rounded-xl border border-[#2D5016]/10 space-y-3">
            <textarea
              placeholder="在此粘贴任务组数据..."
              className="w-full p-2 border rounded-lg h-24 text-sm"
              value={importData}
              onChange={e => setImportData(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowImport(false)} className="px-3 py-1 text-sm text-gray-500">取消</button>
              <button onClick={handleImport} className="px-3 py-1 text-sm bg-[#2D5016] text-white rounded-lg">导入</button>
            </div>
          </div>
        )}

        {/* Groups List */}
        <div className="space-y-3">
          {groups.length === 0 && (
            <div className="text-center text-[#2D5016]/40 py-4 text-sm">
              还没有自定义任务组，点击"新建"创建一个吧
            </div>
          )}
          {groups.map(group => (
            <div 
              key={group.id}
              className="bg-white rounded-xl border border-[#2D5016]/10 shadow-sm overflow-hidden"
            >
              <div 
                className="p-4 flex justify-between items-start cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleToggleGroup(group.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-[#2D5016]">{group.name}</h3>
                    {expandedGroupId === group.id ? (
                      <ChevronUp size={16} className="text-[#2D5016]/40" />
                    ) : (
                      <ChevronDown size={16} className="text-[#2D5016]/40" />
                    )}
                  </div>
                  {group.description && <p className="text-xs text-[#2D5016]/60 mt-1">{group.description}</p>}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => handleExportQR(group.id, e)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-[#2D5016]/60"
                  >
                    <QrCode size={16} />
                  </button>
                  <button 
                    onClick={(e) => handleExport(group.id, e)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-[#2D5016]/60"
                  >
                    <Share2 size={16} />
                  </button>
                  <button 
                    onClick={(e) => handleDeleteGroup(group.id, e)}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {expandedGroupId === group.id && (
                <div className="border-t border-[#2D5016]/10 bg-[#F5E6D3]/10 p-4 space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-[#2D5016]/60">任务列表 ({groupTasks.length})</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedGroupId(group.id)
                        setShowAddTask(true)
                      }}
                      className="text-xs flex items-center gap-1 bg-[#2D5016] text-white px-2 py-1 rounded-md"
                    >
                      <Plus size={12} /> 添加任务
                    </button>
                  </div>
                  
                  {groupTasks.length === 0 ? (
                    <div className="text-center text-xs text-[#2D5016]/40 py-2">
                      暂无任务，点击上方按钮添加
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {groupTasks.map(task => (
                        <div key={task.id} className="flex items-start justify-between bg-white p-2 rounded-lg border border-[#2D5016]/5 text-sm">
                          <div className="flex gap-2">
                            <span className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded h-fit mt-0.5",
                              task.type === 'where' ? "bg-[#2D5016]/10 text-[#2D5016]" : "bg-[#E8DCC8] text-[#2D5016]"
                            )}>
                              {task.type === 'where' ? '去哪里' : '做什么'}
                            </span>
                            <span className="text-[#2D5016]">{task.content}</span>
                          </div>
                          <button 
                            onClick={(e) => handleDeleteTask(task.id, e)}
                            className="text-red-400 hover:text-red-500 p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Task Modal/Overlay */}
      {showAddTask && selectedGroupId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-lg text-[#2D5016]">添加新任务</h3>
            
            <div className="flex gap-2">
              <button
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
                  newTaskType === 'where' ? "bg-[#2D5016] text-white" : "bg-gray-100 text-gray-600"
                )}
                onClick={() => setNewTaskType('where')}
              >
                去哪里
              </button>
              <button
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
                  newTaskType === 'what' ? "bg-[#E8DCC8] text-[#2D5016]" : "bg-gray-100 text-gray-600"
                )}
                onClick={() => setNewTaskType('what')}
              >
                做什么
              </button>
            </div>

            <textarea
              placeholder="输入任务内容..."
              className="w-full p-3 border rounded-xl h-24"
              value={newTaskContent}
              onChange={e => setNewTaskContent(e.target.value)}
            />

            <div className="flex gap-3">
              <button 
                onClick={() => setShowAddTask(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium"
              >
                取消
              </button>
              <button 
                onClick={handleAddTask}
                className="flex-1 py-2.5 rounded-xl bg-[#2D5016] text-white font-medium"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 space-y-4 flex flex-col items-center">
            <h3 className="font-bold text-lg text-[#2D5016]">分享任务组</h3>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <QRCodeSVG value={qrCodeData} size={200} />
            </div>
            <p className="text-sm text-gray-500 text-center">让朋友使用"扫码"功能即可导入</p>
            <button 
              onClick={() => setShowQRCode(false)}
              className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm space-y-4">
            <div className="flex justify-between items-center text-white mb-2">
              <h3 className="font-bold text-lg">扫描二维码</h3>
              <button 
                onClick={() => setShowScanner(false)}
                className="p-2 bg-white/10 rounded-full"
              >
                <ChevronRight className="rotate-90" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden bg-black aspect-square relative">
               <Scanner onScan={handleScanResult} />
            </div>
            <p className="text-white/60 text-center text-sm">将二维码放入框内即可自动识别</p>
          </div>
        </div>
      )}

      {/* Existing Settings */}
      <div className="space-y-4 pt-4 border-t border-[#2D5016]/10">
        <h2 className="text-lg font-semibold text-[#2D5016]">系统设置</h2>
        
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#2D5016]/10">
          <button
            onClick={handleClearHistory}
            disabled={clearing}
            className="w-full p-4 flex items-center justify-between hover:bg-[#F5E6D3]/20 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="bg-red-50 p-2 rounded-lg">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <span className="text-[#2D5016]">清空历史记录</span>
            </div>
            <ChevronRight size={20} className="text-[#2D5016]/30" />
          </button>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#2D5016]/10">
          <div className="p-4 flex items-center gap-3">
            <div className="bg-[#2D5016]/5 p-2 rounded-lg">
              <Info size={20} className="text-[#2D5016]" />
            </div>
            <div className="flex-1">
              <div className="text-[#2D5016]">散步 Sanpo</div>
              <div className="text-xs text-[#2D5016]/60">v1.1.0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

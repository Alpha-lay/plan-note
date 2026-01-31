import { useState } from 'react'
import { CalendarDays, CheckSquare, FileText, List, Calendar, Clock, Bell, Settings, X } from 'lucide-react'
import { cn, formatDate, parseDate } from './lib/utils'
import { useStorage } from './hooks/useStorage'
import { useReminder } from './hooks/useReminder'
import { Calendar as CalendarView } from './components/Calendar'
import { TaskList } from './components/TaskList'
import { NoteList } from './components/NoteList'
import type { ViewType } from './types'

// 主应用 - Taro迁移时结构保持不变，组件替换为 Taro 组件

function App() {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()))
  const [activeView, setActiveView] = useState<ViewType>('calendar')
  const [showAllTasks, setShowAllTasks] = useState(false)
  const [showAllNotes, setShowAllNotes] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  
  const {
    tasks,
    notes,
    isLoaded,
    addTask,
    toggleTask,
    deleteTask,
    addNote,
    updateNote,
    deleteNote,
    getTasksByDate,
    getNotesByDate,
    getStats,
    markNotified,
  } = useStorage()

  // 初始化提醒功能
  const { sendKey, updateSendKey, testNotification, hasSendKey } = useReminder(tasks, markNotified)

  const dayTasks = getTasksByDate(selectedDate)
  const dayNotes = getNotesByDate(selectedDate)
  const stats = getStats()

  // 对当天任务按时间排序
  const sortedDayTasks = [...dayTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    if (a.time && b.time) return a.time.localeCompare(b.time)
    if (a.time && !b.time) return -1
    if (!a.time && b.time) return 1
    const priorityOrder = { urgent: 0, chill: 1 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  // 显示的任务和笔记（根据筛选条件）
  const displayTasks = showAllTasks ? tasks : dayTasks
  const displayNotes = showAllNotes ? notes : dayNotes

  const selectedDateObj = parseDate(selectedDate)
  const isToday = formatDate(new Date()) === selectedDate

  // 格式化选中日期显示
  const formatSelectedDate = () => {
    if (isToday) return '今天'
    const d = selectedDateObj
    return `${d.getMonth() + 1}月${d.getDate()}日`
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 顶部栏 - Taro: View + Text */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl">PlanNote</h1>
            <p className="text-sm text-muted-foreground">{formatSelectedDate()}</p>
          </div>
          
          {/* 统计和设置 */}
          <div className="flex items-center gap-2">
            <div className="text-right mr-1">
              <div className="text-2xl font-bold text-primary">{stats.rate}%</div>
              <div className="text-xs text-muted-foreground">完成率</div>
            </div>
            <button 
              onClick={() => setShowSettings(true)}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                hasSendKey 
                  ? 'bg-success/10 text-success' 
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              )}
              title={hasSendKey ? '推送已配置' : '设置推送'}
            >
              {hasSendKey ? <Bell className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* 设置面板 */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center" onClick={() => setShowSettings(false)}>
          <div className="bg-card w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 space-y-4 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">设置微信推送</h2>
              <button onClick={() => setShowSettings(false)} className="btn-ghost p-2 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                使用 <a href="https://sct.ftqq.com" target="_blank" rel="noopener" className="text-primary underline">Server酱</a> 免费推送任务提醒到微信
              </p>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">SendKey</label>
                <input
                  type="text"
                  value={sendKey}
                  onChange={(e) => updateSendKey(e.target.value)}
                  placeholder="粘贴你的 SendKey..."
                  className="input-field"
                />
                <p className="text-xs text-muted-foreground">
                  登录 Server酱 → 复制 SendKey → 粘贴到这里
                </p>
              </div>

              <button 
                onClick={testNotification}
                disabled={!sendKey}
                className="btn-primary btn-md w-full"
              >
                <Bell className="w-4 h-4" />
                测试推送
              </button>

              {hasSendKey && (
                <p className="text-sm text-success text-center">✓ 推送已配置，任务到期会发送微信消息</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 主内容区 - Taro: ScrollView */}
      <main className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* 日历视图 */}
        {activeView === 'calendar' && (
          <>
            <CalendarView
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              tasks={tasks}
              notes={notes}
            />
            
            {/* 选中日期详情 - 直接显示任务和笔记 */}
            <div className="space-y-4">
              {/* 日期标题 */}
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">{formatSelectedDate()}</h2>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span>{dayTasks.length} 任务</span>
                  <span>·</span>
                  <span>{dayNotes.length} 笔记</span>
                </div>
              </div>

              {/* 任务列表 */}
              {sortedDayTasks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <CheckSquare className="w-4 h-4" />
                    任务
                    <span className="text-xs">({sortedDayTasks.filter(t => t.completed).length}/{sortedDayTasks.length} 完成)</span>
                  </div>
                  {sortedDayTasks.map(task => (
                    <div key={task.id} className={cn(
                      "card p-3 flex items-center gap-3 transition-all",
                      task.completed && "opacity-60"
                    )}>
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={cn(
                          'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0',
                          task.completed 
                            ? 'bg-primary border-primary' 
                            : 'border-border hover:border-primary'
                        )}
                      >
                        {task.completed && (
                          <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <span className={cn(
                          'text-sm truncate block font-medium',
                          task.completed && 'line-through opacity-60',
                          !task.completed && task.priority === 'urgent' && 'text-orange-500',
                          !task.completed && task.priority === 'chill' && 'text-sky-500',
                        )}>
                          {task.title}
                        </span>
                        {task.time && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {task.time}
                            {task.reminder && <Bell className="w-3 h-3 text-primary" />}
                          </span>
                        )}
                      </div>
                      <span className="text-base shrink-0">
                        {task.priority === 'urgent' ? '🔥' : '☕'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 笔记列表 */}
              {dayNotes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    笔记
                  </div>
                  {dayNotes.map(note => (
                    <div key={note.id} className="card p-3 space-y-1">
                      <p className="text-sm line-clamp-2">{note.content}</p>
                      {note.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {note.tags.map(tag => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 空状态 */}
              {dayTasks.length === 0 && dayNotes.length === 0 && (
                <div className="card p-8 text-center text-muted-foreground">
                  <p>当天没有任务和笔记</p>
                  <p className="text-sm mt-1">点击下方添加</p>
                </div>
              )}

              {/* 快捷添加按钮 */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setActiveView('tasks')}
                  className="btn-secondary btn-md"
                >
                  <CheckSquare className="w-4 h-4" />
                  添加任务
                </button>
                <button 
                  onClick={() => setActiveView('notes')}
                  className="btn-secondary btn-md"
                >
                  <FileText className="w-4 h-4" />
                  添加笔记
                </button>
              </div>
            </div>
          </>
        )}

        {/* 任务视图 */}
        {activeView === 'tasks' && (
          <div className="space-y-4">
            {/* 筛选切换 */}
            <div className="flex items-center gap-2 p-1 bg-muted rounded-xl">
              <button
                onClick={() => setShowAllTasks(false)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all',
                  !showAllTasks ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
                )}
              >
                <Calendar className="w-4 h-4" />
                {formatSelectedDate()}
              </button>
              <button
                onClick={() => setShowAllTasks(true)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all',
                  showAllTasks ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
                )}
              >
                <List className="w-4 h-4" />
                全部任务
              </button>
            </div>
            
            <TaskList
              tasks={displayTasks}
              selectedDate={selectedDate}
              onAdd={addTask}
              onToggle={toggleTask}
              onDelete={deleteTask}
              showDate={showAllTasks}
            />
          </div>
        )}

        {/* 笔记视图 */}
        {activeView === 'notes' && (
          <div className="space-y-4">
            {/* 筛选切换 */}
            <div className="flex items-center gap-2 p-1 bg-muted rounded-xl">
              <button
                onClick={() => setShowAllNotes(false)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all',
                  !showAllNotes ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
                )}
              >
                <Calendar className="w-4 h-4" />
                {formatSelectedDate()}
              </button>
              <button
                onClick={() => setShowAllNotes(true)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all',
                  showAllNotes ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
                )}
              >
                <List className="w-4 h-4" />
                全部笔记
              </button>
            </div>
            
            <NoteList
              notes={displayNotes}
              selectedDate={selectedDate}
              onAdd={addNote}
              onUpdate={updateNote}
              onDelete={deleteNote}
              showDate={showAllNotes}
            />
          </div>
        )}
      </main>

      {/* 底部导航 - Taro: TabBar */}
      <nav className="bottom-nav">
        <button
          onClick={() => setActiveView('calendar')}
          className={cn('nav-item', activeView === 'calendar' && 'nav-item-active')}
        >
          <CalendarDays className="w-5 h-5" />
          <span className="text-xs">日历</span>
        </button>
        <button
          onClick={() => setActiveView('tasks')}
          className={cn('nav-item', activeView === 'tasks' && 'nav-item-active')}
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-xs">任务</span>
        </button>
        <button
          onClick={() => setActiveView('notes')}
          className={cn('nav-item', activeView === 'notes' && 'nav-item-active')}
        >
          <FileText className="w-5 h-5" />
          <span className="text-xs">笔记</span>
        </button>
      </nav>
    </div>
  )
}

export default App

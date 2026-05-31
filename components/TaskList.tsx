import { useState } from 'react'
import { Bell, Calendar, Check, Clock, Plus, Trash2 } from 'lucide-react'
import { cn, formatDate } from '../lib/utils'
import type { Priority, Task } from '../types'

interface TaskListProps {
  tasks: Task[]
  selectedDate: string
  onAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  showDate?: boolean
}

const PRIORITY_LABELS: Record<Priority, string> = {
  urgent: '火烧眉毛',
  chill: '慢慢来',
}

export function TaskList({ tasks, selectedDate, onAdd, onToggle, onDelete, showDate = false }: TaskListProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(selectedDate)
  const [time, setTime] = useState('')
  const [priority, setPriority] = useState<Priority>('chill')
  const [reminder, setReminder] = useState(false)

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    if (a.time && b.time) return a.time.localeCompare(b.time)
    if (a.time) return -1
    if (b.time) return 1
    return a.priority === 'urgent' ? -1 : 1
  })

  const reset = () => {
    setTitle('')
    setDate(selectedDate)
    setTime('')
    setPriority('chill')
    setReminder(false)
    setIsAdding(false)
  }

  const submit = () => {
    if (!title.trim()) return
    onAdd({
      title: title.trim(),
      completed: false,
      date,
      time: time || undefined,
      reminder: reminder && !!time,
      priority,
    })
    reset()
  }

  const formatTaskDate = (value: string) => {
    const today = formatDate(new Date())
    if (value === today) return '今天'
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    if (value === formatDate(tomorrow)) return '明天'
    const parsed = new Date(value)
    return `${parsed.getMonth() + 1}/${parsed.getDate()}`
  }

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">任务 <span className="text-sm text-muted-foreground font-normal">{tasks.filter(task => task.completed).length}/{tasks.length}</span></h3>
        {!isAdding && <button onClick={() => setIsAdding(true)} className="btn-primary btn-sm"><Plus className="w-4 h-4" />添加</button>}
      </div>

      {isAdding && (
        <div className="card p-4 space-y-3 animate-slide-up">
          <input value={title} onChange={event => setTitle(event.target.value)} onKeyDown={event => event.key === 'Enter' && submit()} placeholder="输入任务内容..." className="input-field" autoFocus />
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={date} onChange={event => setDate(event.target.value)} className="input-field h-10 text-sm" />
            <input type="time" value={time} onChange={event => setTime(event.target.value)} className="input-field h-10 text-sm" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(['urgent', 'chill'] as Priority[]).map(value => (
              <button key={value} onClick={() => setPriority(value)} className={cn('tag', priority === value ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
                {value === 'urgent' ? '火烧眉毛' : '慢慢来'}
              </button>
            ))}
            <button onClick={() => setReminder(!reminder)} disabled={!time} className={cn('tag', reminder && time ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
              <Bell className="w-3 h-3" />提醒
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={submit} className="btn-primary btn-sm flex-1">确认</button>
            <button onClick={reset} className="btn-secondary btn-sm flex-1">取消</button>
          </div>
        </div>
      )}

      {sortedTasks.length === 0 ? (
        <div className="card p-8 text-center text-muted-foreground">
          <p>暂无任务</p>
          <p className="text-sm mt-1">点击添加开始规划</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedTasks.map(task => (
            <div key={task.id} className={cn('card p-4 flex items-center gap-3 transition-all', task.completed && 'opacity-60')}>
              <button onClick={() => onToggle(task.id)} className={cn('checkbox shrink-0', task.completed && 'checkbox-checked')}>
                {task.completed && <Check className="w-3 h-3 text-primary-foreground" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={cn('font-medium truncate', task.completed && 'line-through opacity-60', !task.completed && task.priority === 'urgent' && 'text-orange-500', !task.completed && task.priority === 'chill' && 'text-sky-500')}>{task.title}</p>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                  {showDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatTaskDate(task.date)}</span>}
                  {task.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{task.time}</span>}
                  {task.reminder && task.time && <Bell className="w-3 h-3 text-primary" />}
                </div>
              </div>
              <span className="tag bg-muted text-muted-foreground">{PRIORITY_LABELS[task.priority]}</span>
              <button onClick={() => onDelete(task.id)} className="btn-icon btn-ghost text-muted-foreground hover:text-destructive w-8 h-8"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

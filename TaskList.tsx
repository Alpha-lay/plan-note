import { useState } from 'react'
import { Plus, Check, Trash2, Calendar, Clock, Bell, BellOff } from 'lucide-react'
import { cn, formatDate } from '../lib/utils'
import type { Task, Priority } from '../types'

// 任务列表组件 - Taro迁移: View + Text + Input + Checkbox

interface TaskListProps {
  tasks: Task[]
  selectedDate: string
  onAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  showDate?: boolean
}

const PRIORITY_CONFIG: Record<Priority, { label: string; icon: string; color: string; bgColor: string }> = {
  urgent: { label: '🔥 火烧眉毛', icon: '🔥', color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  chill: { label: '☕ 慢慢来', icon: '☕', color: 'text-sky-500', bgColor: 'bg-sky-500/10' },
}

export function TaskList({ tasks, selectedDate, onAdd, onToggle, onDelete, showDate = false }: TaskListProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('chill')
  const [newTaskDate, setNewTaskDate] = useState(selectedDate)
  const [newTaskTime, setNewTaskTime] = useState('')
  const [newTaskReminder, setNewTaskReminder] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // 当选中日期变化时，更新新任务的默认日期
  const startAdding = () => {
    setNewTaskDate(selectedDate)
    setNewTaskTime('')
    setNewTaskReminder(false)
    setIsAdding(true)
  }

  const handleAdd = () => {
    if (newTaskTitle.trim()) {
      onAdd({
        title: newTaskTitle.trim(),
        completed: false,
        date: newTaskDate,
        time: newTaskTime || undefined,
        reminder: newTaskReminder && !!newTaskTime,
        priority: newTaskPriority,
      })
      setNewTaskTitle('')
      setNewTaskTime('')
      setNewTaskReminder(false)
      setIsAdding(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') setIsAdding(false)
  }

  // 按时间、优先级和完成状态排序
  const sortedTasks = [...tasks].sort((a, b) => {
    // 先按完成状态
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    // 再按时间排序（有时间的在前，时间早的在前）
    if (a.time && b.time) {
      return a.time.localeCompare(b.time)
    }
    if (a.time && !b.time) return -1
    if (!a.time && b.time) return 1
    // 最后按优先级
    const priorityOrder = { urgent: 0, chill: 1 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  const completedCount = tasks.filter(t => t.completed).length

  return (
    <div className="space-y-3 animate-fade-in">
      {/* 标题栏 - Taro: View + Text */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">
          任务 
          {tasks.length > 0 && (
            <span className="text-sm text-muted-foreground font-normal ml-2">
              {completedCount}/{tasks.length}
            </span>
          )}
        </h3>
        {!isAdding && (
          <button 
            onClick={startAdding}
            className="btn-primary btn-sm"
          >
            <Plus className="w-4 h-4" />
            添加
          </button>
        )}
      </div>

      {/* 添加任务表单 - Taro: View + Input + Picker */}
      {isAdding && (
        <div className="card p-4 space-y-3 animate-slide-up">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入任务内容..."
            className="input-field"
            autoFocus
          />
          
          {/* 日期选择 - Taro: Picker mode="date" */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">日期:</span>
            <input
              type="date"
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
              className="input-field h-9 text-sm flex-1"
            />
          </div>

          {/* 时间选择 - Taro: Picker mode="time" */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">时间:</span>
            <input
              type="time"
              value={newTaskTime}
              onChange={(e) => setNewTaskTime(e.target.value)}
              className="input-field h-9 text-sm flex-1"
              placeholder="可选"
            />
            {newTaskTime && (
              <button
                onClick={() => setNewTaskReminder(!newTaskReminder)}
                className={cn(
                  'btn-sm rounded-lg flex items-center gap-1 transition-all',
                  newTaskReminder 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                )}
                title={newTaskReminder ? '已开启提醒' : '点击开启提醒'}
              >
                {newTaskReminder ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                <span className="text-xs">{newTaskReminder ? '提醒' : '无提醒'}</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">优先级:</span>
            {(['urgent', 'chill'] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setNewTaskPriority(p)}
                className={cn(
                  'tag transition-all',
                  newTaskPriority === p 
                    ? PRIORITY_CONFIG[p].bgColor + ' ' + PRIORITY_CONFIG[p].color
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {PRIORITY_CONFIG[p].label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={handleAdd} className="btn-primary btn-sm flex-1">
              确认
            </button>
            <button onClick={() => setIsAdding(false)} className="btn-secondary btn-sm flex-1">
              取消
            </button>
          </div>
        </div>
      )}

      {/* 任务列表 - Taro: ScrollView + View */}
      {sortedTasks.length === 0 ? (
        <div className="card p-8 text-center text-muted-foreground">
          <p>暂无任务</p>
          <p className="text-sm mt-1">点击添加开始规划</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedTasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={onToggle} 
              onDelete={onDelete}
              showDate={showDate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// 单个任务项 - Taro: View + Text + Checkbox
interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  showDate?: boolean
}

function TaskItem({ task, onToggle, onDelete, showDate = false }: TaskItemProps) {
  const config = PRIORITY_CONFIG[task.priority]
  
  // 格式化日期显示
  const formatTaskDate = (dateStr: string) => {
    const today = formatDate(new Date())
    if (dateStr === today) return '今天'
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    if (dateStr === formatDate(tomorrow)) return '明天'
    const d = new Date(dateStr)
    return `${d.getMonth() + 1}/${d.getDate()}`
  }

  return (
    <div 
      className={cn(
        'card p-4 flex items-center gap-3 transition-all',
        task.completed && 'opacity-60'
      )}
    >
      {/* 复选框 - Taro: Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          'checkbox shrink-0',
          task.completed && 'checkbox-checked'
        )}
      >
        {task.completed && <Check className="w-3 h-3 text-primary-foreground" />}
      </button>

      {/* 任务内容 - Taro: View + Text */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'font-medium truncate',
          task.completed && 'line-through opacity-60',
          !task.completed && task.priority === 'urgent' && 'text-orange-500',
          !task.completed && task.priority === 'chill' && 'text-sky-500',
        )}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {showDate && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatTaskDate(task.date)}
            </span>
          )}
          {task.time && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {task.time}
            </span>
          )}
          {task.reminder && task.time && (
            <span className="text-xs text-primary flex items-center gap-1">
              <Bell className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>

      {/* 优先级标签 - Taro: View + Text */}
      <div className={cn('tag text-base', config.bgColor, config.color)}>
        {config.icon}
      </div>

      {/* 删除按钮 - Taro: Button */}
      <button
        onClick={() => onDelete(task.id)}
        className="btn-icon btn-ghost text-muted-foreground hover:text-destructive w-8 h-8"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

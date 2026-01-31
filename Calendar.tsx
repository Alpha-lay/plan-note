import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn, formatDate, isToday, getDaysInMonth, getFirstDayOfMonth, WEEKDAYS, MONTHS } from '../lib/utils'
import type { Task, Note } from '../types'

// 日历组件 - Taro迁移: View + Text，日期逻辑不变

interface CalendarProps {
  selectedDate: string
  onSelectDate: (date: string) => void
  tasks: Task[]
  notes: Note[]
}

export function Calendar({ selectedDate, onSelectDate, tasks, notes }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  const { year, month } = currentMonth

  // 计算日历格子
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    const days: (number | null)[] = []
    
    // 填充月初空白
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    
    // 填充日期
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    
    return days
  }, [year, month])

  // 检查某天是否有任务或笔记
  const hasContent = (day: number) => {
    const dateStr = formatDate(new Date(year, month, day))
    return tasks.some(t => t.date === dateStr) || notes.some(n => n.date === dateStr)
  }

  // 获取某天未完成任务数
  const getPendingCount = (day: number) => {
    const dateStr = formatDate(new Date(year, month, day))
    return tasks.filter(t => t.date === dateStr && !t.completed).length
  }

  const goToPrevMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 }
      }
      return { ...prev, month: prev.month - 1 }
    })
  }

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 }
      }
      return { ...prev, month: prev.month + 1 }
    })
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth({ year: today.getFullYear(), month: today.getMonth() })
    onSelectDate(formatDate(today))
  }

  return (
    <div className="card p-4 animate-fade-in">
      {/* 月份导航 - Taro: View + Text + Button */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={goToPrevMonth} className="btn-icon btn-ghost">
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button onClick={goToToday} className="font-semibold text-lg hover:text-primary transition-colors">
          {year}年 {MONTHS[month]}
        </button>
        
        <button onClick={goToNextMonth} className="btn-icon btn-ghost">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 星期标题 - Taro: View + Text */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center text-xs text-muted-foreground font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      {/* 日期格子 - Taro: View + Text，onClick -> onTap */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="w-10 h-10" />
          }

          const dateStr = formatDate(new Date(year, month, day))
          const date = new Date(year, month, day)
          const isSelected = dateStr === selectedDate
          const isTodayDate = isToday(date)
          const hasItems = hasContent(day)
          const pendingCount = getPendingCount(day)

          return (
            <button
              key={day}
              onClick={() => onSelectDate(dateStr)}
              className={cn(
                'calendar-day relative',
                isTodayDate && 'calendar-day-today',
                isSelected && !isTodayDate && 'bg-accent text-accent-foreground font-medium',
                !isSelected && !isTodayDate && 'hover:bg-muted',
              )}
            >
              {day}
              {hasItems && !isTodayDate && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                  {pendingCount > 9 ? '9+' : pendingCount}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

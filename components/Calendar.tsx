import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn, formatDate, getDaysInMonth, getFirstDayOfMonth, isToday, MONTHS, WEEKDAYS } from '../lib/utils'
import type { Note, Task } from '../types'

interface CalendarProps {
  selectedDate: string
  onSelectDate: (date: string) => void
  tasks: Task[]
  notes: Note[]
}

export function Calendar({ selectedDate, onSelectDate, tasks, notes }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = selectedDate ? new Date(selectedDate) : new Date()
    return { year: date.getFullYear(), month: date.getMonth() }
  })

  const { year, month } = currentMonth
  const days = useMemo(() => {
    const emptyDays = Array.from({ length: getFirstDayOfMonth(year, month) }, () => null)
    const monthDays = Array.from({ length: getDaysInMonth(year, month) }, (_, index) => index + 1)
    return [...emptyDays, ...monthDays]
  }, [year, month])

  const moveMonth = (offset: number) => {
    setCurrentMonth(prev => {
      const date = new Date(prev.year, prev.month + offset, 1)
      return { year: date.getFullYear(), month: date.getMonth() }
    })
  }

  const hasContent = (day: number) => {
    const date = formatDate(new Date(year, month, day))
    return tasks.some(task => task.date === date) || notes.some(note => note.date === date)
  }

  const pendingCount = (day: number) => {
    const date = formatDate(new Date(year, month, day))
    return tasks.filter(task => task.date === date && !task.completed).length
  }

  return (
    <div className="card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => moveMonth(-1)} className="btn-icon btn-ghost" aria-label="上个月">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            const today = new Date()
            setCurrentMonth({ year: today.getFullYear(), month: today.getMonth() })
            onSelectDate(formatDate(today))
          }}
          className="font-semibold text-lg hover:text-primary transition-colors"
        >
          {year}年 {MONTHS[month]}
        </button>
        <button onClick={() => moveMonth(1)} className="btn-icon btn-ghost" aria-label="下个月">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center text-xs text-muted-foreground font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) return <div key={`empty-${index}`} className="w-10 h-10" />

          const date = new Date(year, month, day)
          const dateStr = formatDate(date)
          const selected = dateStr === selectedDate
          const today = isToday(date)
          const count = pendingCount(day)

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={cn(
                'calendar-day relative',
                today && 'calendar-day-today',
                selected && !today && 'bg-accent text-accent-foreground font-medium',
                !selected && !today && 'hover:bg-muted',
              )}
            >
              {day}
              {hasContent(day) && !today && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />}
              {count > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">{count > 9 ? '9+' : count}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

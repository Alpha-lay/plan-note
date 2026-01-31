import { useState, useEffect, useCallback } from 'react'
import type { Task, Note } from '../types'

// 存储 Hook - Taro迁移时替换 localStorage 为 Taro.setStorageSync/getStorageSync

const TASKS_KEY = 'plannote_tasks'
const NOTES_KEY = 'plannote_notes'

export function useStorage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // 初始化加载 - Taro: Taro.getStorageSync
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(TASKS_KEY)
      const savedNotes = localStorage.getItem(NOTES_KEY)
      
      if (savedTasks) {
        // 兼容旧数据：将 high/medium/low 映射到 urgent/chill
        const parsed = JSON.parse(savedTasks) as Task[]
        const migrated = parsed.map(t => {
          // 检查是否已经是新的优先级类型
          if (t.priority === 'urgent' || t.priority === 'chill') {
            return {
              ...t,
              reminder: t.reminder ?? false,
              notified: t.notified ?? false,
            }
          }
          // 从旧数据迁移
          return {
            ...t,
            priority: t.priority === 'high' || t.priority === 'medium' 
              ? 'urgent' as const
              : t.priority === 'low' 
                ? 'chill' as const 
                : 'chill' as const,
            reminder: t.reminder ?? false,
            notified: t.notified ?? false,
          }
        })
        setTasks(migrated)
      }
      if (savedNotes) setNotes(JSON.parse(savedNotes))
    } catch (e) {
      console.error('Failed to load data:', e)
    }
    setIsLoaded(true)
  }, [])

  // 保存任务 - Taro: Taro.setStorageSync
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
    }
  }, [tasks, isLoaded])

  // 保存笔记 - Taro: Taro.setStorageSync
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
    }
  }, [notes, isLoaded])

  // 任务操作
  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      createdAt: new Date().toISOString(),
    }
    setTasks(prev => [newTask, ...prev])
    return newTask
  }, [])

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ))
  }, [])

  // 标记任务已提醒
  const markNotified = useCallback((id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, notified: true } : t
    ))
  }, [])

  // 笔记操作
  const addNote = useCallback((note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newNote: Note = {
      ...note,
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      createdAt: now,
      updatedAt: now,
    }
    setNotes(prev => [newNote, ...prev])
    return newNote
  }, [])

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => 
      n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
    ))
  }, [])

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }, [])

  // 按日期筛选
  const getTasksByDate = useCallback((date: string) => {
    return tasks.filter(t => t.date === date)
  }, [tasks])

  const getNotesByDate = useCallback((date: string) => {
    return notes.filter(n => n.date === date)
  }, [notes])

  // 统计
  const getStats = useCallback(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const pending = total - completed
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, pending, rate }
  }, [tasks])

  return {
    tasks,
    notes,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    markNotified,
    addNote,
    updateNote,
    deleteNote,
    getTasksByDate,
    getNotesByDate,
    getStats,
  }
}

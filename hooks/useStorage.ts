import { useState, useEffect, useCallback } from 'react'
import type { Task, Note } from '../types'

const TASKS_KEY = 'plannote_tasks'
const NOTES_KEY = 'plannote_notes'

export function useStorage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(TASKS_KEY)
      const savedNotes = localStorage.getItem(NOTES_KEY)
      if (savedTasks) setTasks(JSON.parse(savedTasks))
      if (savedNotes) setNotes(JSON.parse(savedNotes))
    } catch (error) {
      console.error('Failed to load PlanNote data:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isLoaded) localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
  }, [tasks, isLoaded])

  useEffect(() => {
    if (isLoaded) localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
  }, [notes, isLoaded])

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
    }
    setTasks(prev => [newTask, ...prev])
    return newTask
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, completed: !task.completed } : task))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }, [])

  const markNotified = useCallback((id: string) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, notified: true } : task))
  }, [])

  const addNote = useCallback((note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newNote: Note = {
      ...note,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      createdAt: now,
      updatedAt: now,
    }
    setNotes(prev => [newNote, ...prev])
    return newNote
  }, [])

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note))
  }, [])

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id))
  }, [])

  const getTasksByDate = useCallback((date: string) => tasks.filter(task => task.date === date), [tasks])
  const getNotesByDate = useCallback((date: string) => notes.filter(note => note.date === date), [notes])

  const getStats = useCallback(() => {
    const total = tasks.length
    const completed = tasks.filter(task => task.completed).length
    const pending = total - completed
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, pending, rate }
  }, [tasks])

  return {
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
  }
}

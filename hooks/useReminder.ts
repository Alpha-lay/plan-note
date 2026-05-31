import { useState, useEffect, useCallback, useRef } from 'react'
import type { Task } from '../types'

const SENDKEY_STORAGE = 'plannote_sendkey'

export function useReminder(tasks: Task[], onNotified: (taskId: string) => void) {
  const [sendKey, setSendKey] = useState('')
  const checkInterval = useRef<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(SENDKEY_STORAGE)
    if (saved) setSendKey(saved)
  }, [])

  const updateSendKey = useCallback((key: string) => {
    setSendKey(key)
    if (key) localStorage.setItem(SENDKEY_STORAGE, key)
    else localStorage.removeItem(SENDKEY_STORAGE)
  }, [])

  const sendServerChanNotification = useCallback(async (task: Task) => {
    if (!sendKey) return false

    try {
      const title = `Task Reminder: ${task.title}`
      const desp = `Date: ${task.date} Time: ${task.time || ''}`
      const response = await fetch(`https://sctapi.ftqq.com/${sendKey}.send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `title=${encodeURIComponent(title)}&desp=${encodeURIComponent(desp)}`,
      })
      const data = await response.json()
      return data.code === 0
    } catch (error) {
      console.error('ServerChan notification failed:', error)
      return false
    }
  }, [sendKey])

  const sendBrowserNotification = useCallback((task: Task) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return
    new Notification('任务提醒', {
      body: `${task.title}\n${task.time || ''}`,
      icon: '/icon.svg',
      tag: task.id,
    })
  }, [])

  const checkReminders = useCallback(async () => {
    const now = new Date()
    const currentDate = now.toISOString().split('T')[0]
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    for (const task of tasks) {
      if (task.reminder && task.time && !task.completed && !task.notified && task.date === currentDate && task.time === currentTime) {
        const sent = sendKey ? await sendServerChanNotification(task) : false
        if (!sent) sendBrowserNotification(task)
        onNotified(task.id)
      }
    }
  }, [tasks, sendKey, sendServerChanNotification, sendBrowserNotification, onNotified])

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    checkInterval.current = window.setInterval(checkReminders, 60000)
    checkReminders()

    return () => {
      if (checkInterval.current) clearInterval(checkInterval.current)
    }
  }, [checkReminders])

  const testNotification = useCallback(async () => {
    if (!sendKey) {
      alert('请先设置 ServerChan SendKey')
      return false
    }

    const testTask: Task = {
      id: 'test',
      title: 'PlanNote Test',
      completed: false,
      date: new Date().toISOString().split('T')[0],
      reminder: true,
      priority: 'chill',
      createdAt: new Date().toISOString(),
    }

    const ok = await sendServerChanNotification(testTask)
    alert(ok ? '推送成功，请检查微信消息' : '推送失败，请检查 SendKey')
    return ok
  }, [sendKey, sendServerChanNotification])

  return {
    sendKey,
    updateSendKey,
    testNotification,
    hasSendKey: !!sendKey,
  }
}

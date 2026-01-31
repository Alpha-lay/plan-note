import { useState, useEffect, useCallback, useRef } from 'react'
import type { Task } from '../types'

/**
 * 提醒功能 Hook - 支持 Server酱 微信推送
 * 
 * iOS 注意：Safari PWA 后台运行受限，建议保持页面打开
 */

const SENDKEY_STORAGE = 'plannote_sendkey'

export function useReminder(
  tasks: Task[],
  onNotified: (taskId: string) => void
) {
  const [sendKey, setSendKey] = useState<string>('')
  const checkInterval = useRef<number | null>(null)

  // 加载 SendKey
  useEffect(() => {
    const saved = localStorage.getItem(SENDKEY_STORAGE)
    if (saved) setSendKey(saved)
  }, [])

  // 保存 SendKey
  const updateSendKey = useCallback((key: string) => {
    setSendKey(key)
    if (key) {
      localStorage.setItem(SENDKEY_STORAGE, key)
    } else {
      localStorage.removeItem(SENDKEY_STORAGE)
    }
  }, [])

  // 发送 Server酱 通知
  const sendServerChanNotification = useCallback(async (task: Task) => {
    if (!sendKey) return false

    try {
      const title = `Task Reminder: ${task.title}`
      const desp = `Date: ${task.date} Time: ${task.time}\nPriority: ${task.priority === 'urgent' ? 'Urgent' : 'Chill'}`
      
      const response = await fetch(`https://sctapi.ftqq.com/${sendKey}.send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `title=${encodeURIComponent(title)}&desp=${encodeURIComponent(desp)}`,
      })

      const data = await response.json()
      return data.code === 0
    } catch (error) {
      console.error('Server酱推送失败:', error)
      return false
    }
  }, [sendKey])

  // 发送浏览器通知（备用）
  const sendBrowserNotification = useCallback((task: Task) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return
    }

    new Notification('任务提醒', {
      body: `${task.title}\n${task.time}`,
      icon: '/icon.svg',
      tag: task.id,
    })
  }, [])

  // 检查是否需要提醒
  const checkReminders = useCallback(async () => {
    const now = new Date()
    const currentDate = now.toISOString().split('T')[0]
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    for (const task of tasks) {
      if (
        task.reminder &&
        task.time &&
        !task.completed &&
        !task.notified &&
        task.date === currentDate &&
        task.time === currentTime
      ) {
        // 优先使用 Server酱
        if (sendKey) {
          const success = await sendServerChanNotification(task)
          if (success) {
            onNotified(task.id)
            continue
          }
        }
        
        // 备用：浏览器通知
        sendBrowserNotification(task)
        onNotified(task.id)
      }
    }
  }, [tasks, sendKey, sendServerChanNotification, sendBrowserNotification, onNotified])

  // 初始化
  useEffect(() => {
    // 请求浏览器通知权限（备用）
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // 每分钟检查一次
    checkInterval.current = window.setInterval(checkReminders, 60000)
    checkReminders()

    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current)
      }
    }
  }, [checkReminders])

  // 测试推送
  const testNotification = useCallback(async () => {
    if (!sendKey) {
      alert('请先设置 Server酱 SendKey')
      return false
    }

    try {
      const response = await fetch(`https://sctapi.ftqq.com/${sendKey}.send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `title=${encodeURIComponent('🎉 PlanNote Test')}&desp=${encodeURIComponent('Success! Server酱已配置成功！')}`,
      })

      const data = await response.json()
      if (data.code === 0) {
        alert('推送成功！请检查微信消息')
        return true
      } else {
        alert(`推送失败：${data.message || '未知错误'}`)
        return false
      }
    } catch (error) {
      alert('推送失败，请检查网络')
      return false
    }
  }, [sendKey])

  return { 
    sendKey, 
    updateSendKey, 
    testNotification,
    hasSendKey: !!sendKey,
  }
}

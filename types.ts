// 类型定义 - 便于 Taro 迁移复用

// 优先级：urgent=火烧眉毛 chill=随缘
export type Priority = 'urgent' | 'chill'

export interface Task {
  id: string
  title: string
  completed: boolean
  date: string // YYYY-MM-DD 格式
  time?: string // HH:mm 格式，可选
  reminder: boolean // 是否开启提醒
  priority: Priority
  createdAt: string
  notified?: boolean // 是否已发送提醒
}

export interface Note {
  id: string
  content: string
  date: string // YYYY-MM-DD 格式
  tags: string[]
  createdAt: string
  updatedAt: string
}

export type ViewType = 'calendar' | 'tasks' | 'notes'

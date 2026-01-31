import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// 样式合并工具
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 生成唯一ID - Taro迁移时可替换为 Taro.getRandomValues
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// 日期格式化 - Taro迁移时逻辑不变
export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDate(date1) === formatDate(date2)
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

// 获取月份天数
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

// 获取月份第一天是星期几 (0=周日)
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

// 中文星期
export const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

// 中文月份
export const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', 
                       '七月', '八月', '九月', '十月', '十一月', '十二月']

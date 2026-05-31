import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { Note } from '../types'

interface NoteListProps {
  notes: Note[]
  selectedDate: string
  onAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdate: (id: string, updates: Partial<Note>) => void
  onDelete: (id: string) => void
  showDate?: boolean
}

export function NoteList({ notes, selectedDate, onAdd, onUpdate, onDelete, showDate = false }: NoteListProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')

  const submit = () => {
    if (!content.trim()) return
    onAdd({
      content: content.trim(),
      date: selectedDate,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    })
    setContent('')
    setTags('')
    setIsAdding(false)
  }

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">笔记 <span className="text-sm text-muted-foreground font-normal">{notes.length}</span></h3>
        {!isAdding && <button onClick={() => setIsAdding(true)} className="btn-primary btn-sm"><Plus className="w-4 h-4" />添加</button>}
      </div>

      {isAdding && (
        <div className="card p-4 space-y-3 animate-slide-up">
          <textarea value={content} onChange={event => setContent(event.target.value)} placeholder="写下一条笔记..." className="input-field min-h-28" autoFocus />
          <input value={tags} onChange={event => setTags(event.target.value)} placeholder="标签，用逗号分隔" className="input-field" />
          <div className="flex gap-2">
            <button onClick={submit} className="btn-primary btn-sm flex-1">保存</button>
            <button onClick={() => setIsAdding(false)} className="btn-secondary btn-sm flex-1">取消</button>
          </div>
        </div>
      )}

      {notes.length === 0 ? (
        <div className="card p-8 text-center text-muted-foreground">
          <p>暂无笔记</p>
          <p className="text-sm mt-1">记录今天的想法和计划</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notes.map(note => (
            <div key={note.id} className="card p-4 space-y-2">
              {showDate && <div className="text-xs text-muted-foreground">{note.date}</div>}
              <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.map(tag => <span key={tag} className="tag bg-primary/10 text-primary">{tag}</span>)}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button onClick={() => {
                  const next = window.prompt('编辑笔记', note.content)
                  if (next !== null) onUpdate(note.id, { content: next })
                }} className="text-xs text-primary">编辑</button>
                <button onClick={() => onDelete(note.id)} className="btn-icon btn-ghost text-muted-foreground hover:text-destructive w-8 h-8"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Plus, X, Clock, Zap, ThumbsUp, ThumbsDown } from 'lucide-react'
import { cn, generateId } from '../lib/utils'
import type { Decision, Option } from '../types'

interface CreateDecisionProps {
  onSubmit: (decision: Decision) => void
}

export function CreateDecision({ onSubmit }: CreateDecisionProps) {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState<Option[]>([
    { id: generateId(), text: '', pros: [], cons: [], votes: 0 },
    { id: generateId(), text: '', pros: [], cons: [], votes: 0 },
  ])
  const [deadlineMinutes, setDeadlineMinutes] = useState(5)
  const [expandedOption, setExpandedOption] = useState<string | null>(null)
  const [newPro, setNewPro] = useState('')
  const [newCon, setNewCon] = useState('')

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, { id: generateId(), text: '', pros: [], cons: [], votes: 0 }])
    }
  }

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(opt => opt.id !== id))
    }
  }

  const updateOptionText = (id: string, text: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt))
  }

  const addPro = (optionId: string) => {
    if (newPro.trim()) {
      setOptions(options.map(opt => 
        opt.id === optionId ? { ...opt, pros: [...opt.pros, newPro.trim()] } : opt
      ))
      setNewPro('')
    }
  }

  const addCon = (optionId: string) => {
    if (newCon.trim()) {
      setOptions(options.map(opt => 
        opt.id === optionId ? { ...opt, cons: [...opt.cons, newCon.trim()] } : opt
      ))
      setNewCon('')
    }
  }

  const removePro = (optionId: string, index: number) => {
    setOptions(options.map(opt => 
      opt.id === optionId ? { ...opt, pros: opt.pros.filter((_, i) => i !== index) } : opt
    ))
  }

  const removeCon = (optionId: string, index: number) => {
    setOptions(options.map(opt => 
      opt.id === optionId ? { ...opt, cons: opt.cons.filter((_, i) => i !== index) } : opt
    ))
  }

  const handleSubmit = () => {
    const validOptions = options.filter(opt => opt.text.trim())
    if (question.trim() && validOptions.length >= 2) {
      const deadline = new Date(Date.now() + deadlineMinutes * 60 * 1000)
      onSubmit({
        id: generateId(),
        question: question.trim(),
        options: validOptions,
        deadline,
        createdAt: new Date(),
        isExpired: false,
      })
    }
  }

  const isValid = question.trim() && options.filter(opt => opt.text.trim()).length >= 2

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
          <Zap className="w-4 h-4" />
          快速决策
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">创建决策</h1>
        <p className="text-muted-foreground">列出选项，设置时限，快速得出结论</p>
      </div>

      <div className="card p-6 md:p-8 space-y-6">
        {/* Question */}
        <div>
          <label className="block text-sm font-medium mb-2">决策问题</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="我们应该选择哪个方案？"
            className="input-field text-lg"
          />
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm font-medium mb-3">选项</label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={option.id} className="space-y-2 animate-scale-in">
                <div className="flex gap-2">
                  <div className="flex items-center justify-center w-10 h-11 rounded-lg bg-primary/10 text-primary font-bold text-sm shrink-0">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOptionText(option.id, e.target.value)}
                    placeholder={`选项 ${String.fromCharCode(65 + index)}`}
                    className="input-field flex-1"
                  />
                  <button
                    onClick={() => setExpandedOption(expandedOption === option.id ? null : option.id)}
                    className={cn(
                      "btn-ghost btn-sm px-3 text-muted-foreground hover:text-foreground",
                      expandedOption === option.id && "bg-accent text-accent-foreground"
                    )}
                    title="添加优缺点"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                  {options.length > 2 && (
                    <button
                      onClick={() => removeOption(option.id)}
                      className="btn-ghost btn-sm px-3 text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Pros and Cons */}
                {expandedOption === option.id && (
                  <div className="ml-12 p-4 rounded-lg bg-muted/50 space-y-4 animate-slide-up">
                    {/* Pros */}
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-success mb-2">
                        <ThumbsUp className="w-4 h-4" />
                        优点
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {option.pros.map((pro, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-success/10 text-success text-sm">
                            {pro}
                            <button onClick={() => removePro(option.id, i)} className="hover:text-success/70">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newPro}
                          onChange={(e) => setNewPro(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addPro(option.id)}
                          placeholder="添加优点..."
                          className="input-field h-9 text-sm flex-1"
                        />
                        <button onClick={() => addPro(option.id)} className="btn-secondary btn-sm">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Cons */}
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-destructive mb-2">
                        <ThumbsDown className="w-4 h-4" />
                        缺点
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {option.cons.map((con, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-destructive/10 text-destructive text-sm">
                            {con}
                            <button onClick={() => removeCon(option.id, i)} className="hover:text-destructive/70">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCon}
                          onChange={(e) => setNewCon(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addCon(option.id)}
                          placeholder="添加缺点..."
                          className="input-field h-9 text-sm flex-1"
                        />
                        <button onClick={() => addCon(option.id)} className="btn-secondary btn-sm">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {options.length < 6 && (
            <button onClick={addOption} className="btn-secondary btn-sm mt-3 w-full">
              <Plus className="w-4 h-4" />
              添加选项
            </button>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium mb-3">
            <Clock className="w-4 h-4 inline mr-1" />
            截止时间
          </label>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 5, 10, 15, 30].map((mins) => (
              <button
                key={mins}
                onClick={() => setDeadlineMinutes(mins)}
                className={cn(
                  "btn-sm rounded-full transition-all",
                  deadlineMinutes === mins 
                    ? "gradient-primary text-primary-foreground shadow-glow" 
                    : "btn-secondary"
                )}
              >
                {mins} 分钟
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button 
          onClick={handleSubmit} 
          disabled={!isValid}
          className="btn-primary btn-lg w-full"
        >
          <Zap className="w-5 h-5" />
          开始投票
        </button>
      </div>
    </div>
  )
}

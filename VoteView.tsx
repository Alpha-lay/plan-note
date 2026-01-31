import { useState } from 'react'
import { Check, ThumbsUp, ThumbsDown, Trophy, Clock, RotateCcw, Share2, Copy } from 'lucide-react'
import { cn } from '../lib/utils'
import { useCountdown } from '../hooks/useCountdown'
import type { Decision, Option } from '../types'

interface VoteViewProps {
  decision: Decision
  onVote: (optionId: string) => void
  onReset: () => void
  votedOptionId: string | null
}

export function VoteView({ decision, onVote, onReset, votedOptionId }: VoteViewProps) {
  const [showProsConsFor, setShowProsConsFor] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { hours, minutes, seconds, isExpired } = useCountdown(decision.deadline)
  
  const totalVotes = decision.options.reduce((sum, opt) => sum + opt.votes, 0)
  const sortedOptions = [...decision.options].sort((a, b) => b.votes - a.votes)
  const winner = isExpired && totalVotes > 0 ? sortedOptions[0] : null
  const hasMultipleWinners = winner && sortedOptions.filter(o => o.votes === winner.votes).length > 1

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0
    return Math.round((votes / totalVotes) * 100)
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  const isUrgent = !isExpired && hours === 0 && minutes < 1

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="text-center mb-8">
        {isExpired ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-success text-success-foreground text-sm font-medium mb-4 animate-scale-in">
            <Trophy className="w-4 h-4" />
            投票结束
          </div>
        ) : (
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4",
            isUrgent ? "gradient-urgent text-white animate-countdown" : "gradient-warning text-warning-foreground"
          )}>
            <Clock className="w-4 h-4" />
            {hours > 0 && `${hours}时 `}{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{decision.question}</h1>
        <p className="text-muted-foreground">
          {isExpired 
            ? `共 ${totalVotes} 票` 
            : votedOptionId 
              ? '你已投票，等待其他人...' 
              : '选择你支持的选项'}
        </p>
      </div>

      {/* Winner Banner */}
      {winner && !hasMultipleWinners && (
        <div className="card p-6 mb-6 border-2 border-success bg-success/5 animate-winner">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full gradient-success flex items-center justify-center shadow-glow-success">
              <Trophy className="w-6 h-6 text-success-foreground" />
            </div>
            <div>
              <div className="text-sm font-medium text-success">获胜选项</div>
              <div className="text-xl font-bold">{winner.text}</div>
            </div>
            <div className="ml-auto text-3xl font-bold text-success">
              {getPercentage(winner.votes)}%
            </div>
          </div>
        </div>
      )}

      {hasMultipleWinners && (
        <div className="card p-4 mb-6 border-2 border-warning bg-warning/5">
          <div className="flex items-center gap-2 text-warning font-medium">
            <Clock className="w-5 h-5" />
            平票！可能需要再投一轮
          </div>
        </div>
      )}

      {/* Options */}
      <div className="space-y-3 mb-6">
        {(isExpired ? sortedOptions : decision.options).map((option, index) => {
          const percentage = getPercentage(option.votes)
          const isWinner = winner?.id === option.id && !hasMultipleWinners
          const isVoted = votedOptionId === option.id
          const hasProsOrCons = option.pros.length > 0 || option.cons.length > 0

          return (
            <div key={option.id} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
              <button
                onClick={() => !isExpired && !votedOptionId && onVote(option.id)}
                disabled={isExpired || !!votedOptionId}
                className={cn(
                  "card w-full p-4 text-left transition-all duration-200",
                  !isExpired && !votedOptionId && "hover:shadow-card-hover hover:border-primary/50 cursor-pointer",
                  isWinner && "border-2 border-success shadow-glow-success",
                  isVoted && !isExpired && "border-2 border-primary shadow-glow"
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-all",
                    isWinner ? "gradient-success text-success-foreground" :
                    isVoted ? "gradient-primary text-primary-foreground" :
                    "bg-primary/10 text-primary"
                  )}>
                    {isVoted ? <Check className="w-5 h-5" /> : String.fromCharCode(65 + decision.options.findIndex(o => o.id === option.id))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "font-semibold truncate",
                      isWinner && "text-success"
                    )}>
                      {option.text}
                    </div>
                    {(isExpired || votedOptionId) && (
                      <div className="text-sm text-muted-foreground">
                        {option.votes} 票
                      </div>
                    )}
                  </div>
                  {(isExpired || votedOptionId) && (
                    <div className={cn(
                      "text-2xl font-bold",
                      isWinner ? "text-success" : "text-muted-foreground"
                    )}>
                      {percentage}%
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {(isExpired || votedOptionId) && (
                  <div className="progress-bar">
                    <div 
                      className={cn(
                        "progress-bar-fill",
                        isWinner ? "gradient-success" : "gradient-primary opacity-60"
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}

                {/* Pros/Cons Toggle */}
                {hasProsOrCons && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowProsConsFor(showProsConsFor === option.id ? null : option.id)
                    }}
                    className="mt-3 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <ThumbsDown className="w-3 h-3" />
                    查看优缺点
                  </button>
                )}
              </button>

              {/* Pros and Cons Expanded */}
              {showProsConsFor === option.id && hasProsOrCons && (
                <div className="mt-2 p-4 rounded-lg bg-muted/50 space-y-3 animate-slide-up">
                  {option.pros.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-success mb-2">
                        <ThumbsUp className="w-4 h-4" />
                        优点
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {option.pros.map((pro, i) => (
                          <span key={i} className="px-2 py-1 rounded-md bg-success/10 text-success text-sm">
                            {pro}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {option.cons.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-destructive mb-2">
                        <ThumbsDown className="w-4 h-4" />
                        缺点
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {option.cons.map((con, i) => (
                          <span key={i} className="px-2 py-1 rounded-md bg-destructive/10 text-destructive text-sm">
                            {con}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={handleShare} className="btn-secondary btn-md flex-1">
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {copied ? '已复制' : '分享链接'}
        </button>
        <button onClick={onReset} className="btn-primary btn-md flex-1">
          <RotateCcw className="w-4 h-4" />
          新决策
        </button>
      </div>
    </div>
  )
}

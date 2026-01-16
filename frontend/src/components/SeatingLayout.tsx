import { useState, useEffect } from 'react'
import { Participant, SeatingAssignment } from '../App'

interface SeatingLayoutProps {
  participants: Participant[]
  seating: SeatingAssignment[]
  onOptimize: () => void
  isLoading: boolean
}

const SEAT_LAYOUT = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
]

export default function SeatingLayout({
  participants,
  seating,
  onOptimize,
  isLoading,
}: SeatingLayoutProps) {
  const [displaySeating, setDisplaySeating] = useState<SeatingAssignment[]>([])
  const [animatingNames, setAnimatingNames] = useState<Set<string>>(new Set())

  // 最適化結果が来たらアニメーション開始
  useEffect(() => {
    if (seating.length > 0 && seating !== displaySeating) {
      // まず全席クリア
      setDisplaySeating([])
      setAnimatingNames(new Set(participants.map(p => p.name)))
      
      // 順番に席に配置していく
      seating.forEach((assignment, index) => {
        setTimeout(() => {
          setDisplaySeating(prev => [...prev, assignment])
          setAnimatingNames(prev => {
            const next = new Set(prev)
            next.delete(assignment.name)
            return next
          })
        }, 300 * (index + 1))
      })
    }
  }, [seating])

  const getSeatName = (seatNumber: number): string => {
    const assignment = displaySeating.find(s => s.seat === seatNumber)
    return assignment?.name || ''
  }

  const isOptimized = displaySeating.length > 0

  return (
    <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-accent-cyan">
        テーブル配置
      </h2>
      
      <div className="mb-4">
        <div className="text-center mb-2">
          <span className="text-sm text-gray-400">【上座】</span>
        </div>
        
        <div className="grid grid-cols-4 gap-3 mb-2">
          {SEAT_LAYOUT[0].map(seat => {
            const name = getSeatName(seat)
            const isHighlighted = isOptimized && name
            return (
              <div
                key={seat}
                className={`h-20 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  isHighlighted
                    ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan'
                    : 'bg-gray-800 border-gray-700 text-gray-500'
                }`}
              >
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">席{seat}</div>
                  <div className="text-xs">{name || '空席'}</div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="text-center my-2">
          <div className="h-px bg-gray-700 mx-4"></div>
          <span className="text-xs text-gray-500">テーブル</span>
        </div>
        
        <div className="grid grid-cols-4 gap-3 mt-2">
          {SEAT_LAYOUT[1].map(seat => {
            const name = getSeatName(seat)
            const isHighlighted = isOptimized && name
            return (
              <div
                key={seat}
                className={`h-20 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  isHighlighted
                    ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan'
                    : 'bg-gray-800 border-gray-700 text-gray-500'
                }`}
              >
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">席{seat}</div>
                  <div className="text-xs">{name || '空席'}</div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="text-center mt-2">
          <span className="text-sm text-gray-400">【下座・出入口側】</span>
        </div>
      </div>

      {/* 出席者欄 */}
      <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
        <h3 className="text-sm font-medium text-gray-400 mb-2">出席者</h3>
        <div className="flex flex-wrap gap-2">
          {participants.map(p => {
            const isAssigned = displaySeating.find(s => s.name === p.name)
            const isAnimating = animatingNames.has(p.name)
            return (
              <div
                key={p.id}
                className={`px-2 py-1 rounded text-xs transition-all duration-300 ${
                  isAssigned
                    ? 'opacity-30 bg-gray-700 text-gray-500'
                    : isAnimating && isLoading
                    ? 'bg-accent-cyan/30 text-accent-cyan animate-pulse'
                    : 'bg-accent-orange/20 text-accent-orange border border-accent-orange/50'
                }`}
              >
                {p.name}（{p.role}, {p.age}歳）
              </div>
            )
          })}
        </div>
      </div>

      <button
        onClick={onOptimize}
        disabled={isLoading}
        className="w-full py-3 px-4 bg-accent-cyan text-dark-bg font-bold rounded-lg hover:bg-accent-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? '最適化中...' : '最適化実行'}
      </button>
    </div>
  )
}

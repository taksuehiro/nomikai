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
  const getSeatName = (seatNumber: number): string => {
    const assignment = seating.find(s => s.seat === seatNumber)
    return assignment?.name || ''
  }

  const isOptimized = seating.length > 0

  return (
    <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-accent-cyan">
        テーブル配置
      </h2>
      
      <div className="mb-6">
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
                className={`h-20 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all ${
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
                className={`h-20 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all ${
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

import { useState } from 'react'
import { participants, constraints } from './data'
import ConstraintsPanel from './components/ConstraintsPanel'
import SeatingLayout from './components/SeatingLayout'
import ReasoningPanel from './components/ReasoningPanel'
import { optimizeSeating } from './api'

export interface Participant {
  id: number
  name: string
  role: string
  age: number
}

export interface Constraint {
  id: number
  text: string
  default: boolean
}

export interface SeatingAssignment {
  seat: number
  name: string
}

export interface OptimizationResult {
  seating: SeatingAssignment[]
  reasoning: string
}

function App() {
  const [selectedConstraints, setSelectedConstraints] = useState<number[]>(
    constraints.filter(c => c.default).map(c => c.id)
  )
  const [seating, setSeating] = useState<SeatingAssignment[]>([])
  const [reasoning, setReasoning] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleOptimize = async () => {
    setIsLoading(true)
    try {
      const activeConstraints = constraints
        .filter(c => selectedConstraints.includes(c.id))
        .map(c => c.text)
      
      const result = await optimizeSeating(participants, activeConstraints)
      setSeating(result.seating)
      setReasoning(result.reasoning)
    } catch (error) {
      console.error('最適化エラー:', error)
      setReasoning('エラーが発生しました。APIエンドポイントを確認してください。')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConstraintToggle = (id: number) => {
    setSelectedConstraints(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-accent-cyan">
          飲み会席順オプティマイザー
        </h1>
        <p className="text-gray-400 mb-6">
          AIが最適な席順を提案します
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左カラム: 制約条件 */}
          <div className="lg:col-span-1">
            <ConstraintsPanel
              constraints={constraints}
              selectedConstraints={selectedConstraints}
              onToggle={handleConstraintToggle}
            />
          </div>

          {/* 中央カラム: テーブル配置 */}
          <div className="lg:col-span-1">
            <SeatingLayout
              participants={participants}
              seating={seating}
              onOptimize={handleOptimize}
              isLoading={isLoading}
            />
          </div>

          {/* 右カラム: AIの判断理由 */}
          <div className="lg:col-span-1">
            <ReasoningPanel reasoning={reasoning} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

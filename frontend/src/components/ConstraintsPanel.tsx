import { Constraint } from '../App'

interface ConstraintsPanelProps {
  constraints: Constraint[]
  selectedConstraints: number[]
  onToggle: (id: number) => void
}

export default function ConstraintsPanel({
  constraints,
  selectedConstraints,
  onToggle,
}: ConstraintsPanelProps) {
  return (
    <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-accent-cyan">
        制約条件
      </h2>
      <div className="space-y-3">
        {constraints.map(constraint => (
          <label
            key={constraint.id}
            className="flex items-start space-x-3 p-3 rounded hover:bg-gray-800 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedConstraints.includes(constraint.id)}
              onChange={() => onToggle(constraint.id)}
              className="mt-1 w-5 h-5 text-accent-cyan bg-gray-700 border-gray-600 rounded focus:ring-accent-cyan focus:ring-2"
            />
            <span className="flex-1 text-sm text-gray-300">
              {constraint.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

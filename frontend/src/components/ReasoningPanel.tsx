interface ReasoningPanelProps {
  reasoning: string
}

export default function ReasoningPanel({ reasoning }: ReasoningPanelProps) {
  return (
    <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-accent-cyan">
        AIの判断理由
      </h2>
      <div className="min-h-[400px]">
        {reasoning ? (
          <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
            {reasoning}
          </div>
        ) : (
          <div className="text-gray-500 text-sm italic">
            最適化を実行すると、AIが配置の理由を説明します。
          </div>
        )}
      </div>
    </div>
  )
}

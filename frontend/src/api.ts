import { Participant, OptimizationResult } from './App'

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000/optimize'

export async function optimizeSeating(
  participants: Participant[],
  constraints: string[]
): Promise<OptimizationResult> {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      participants,
      constraints,
    }),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

import levenshtein from 'js-levenshtein'

export function textIsRoughlySimilar (text: string, goalText: string): boolean {
  const normalGoal = normalize(goalText)
  const normalValue = normalize(text)

  return normalValue.length >= normalGoal.length &&
    levenshtein(normalGoal, normalValue) <= Math.max(Math.ceil(normalGoal.length / 6), 2)
}

export function normalize (text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z]/g, '')
}

export const fetchSummarization = (input: string) => (fetch('/api/title-gen', { method: 'POST', body: input }).then(res => res.text()))

export const fetchTranslation = (input: string) => (fetch(`/api/translate?text=${encodeURIComponent(input)}`).then(res => res.text()))

export const fetchModeration: (input: string) => Promise<{ flags: string[], category_scores: Record<string, number> }> = input => (fetch('/api/moderate', { method: 'POST', body: input }).then(res => res.json()))

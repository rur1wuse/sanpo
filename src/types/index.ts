export type SuggestionType = 'where' | 'what'

export interface TaskGroup {
  id: string
  name: string
  description: string | null
  is_default: boolean
  user_id: string | null
  created_at: string
}

export interface Suggestion {
  id: string
  type: SuggestionType
  content: string
  category: string | null
  is_active: boolean
  group_id: string | null
  user_id: string | null
  created_at: string
}

export interface SuggestionHistory {
  id: string
  user_id: string | null
  where_to_go: string
  what_to_do: string
  created_at: string
}

export interface User {
  id: string
  device_id: string
  created_at: string
}

export interface ExportData {
  group: {
    name: string
    description: string | null
  }
  tasks: {
    type: SuggestionType
    content: string
    category: string | null
  }[]
}

import { supabase } from './supabase'
import { Suggestion, SuggestionHistory, SuggestionType, TaskGroup, ExportData } from '../types'
import { getDeviceId } from './utils'

// Ensure user exists (create if not)
export async function ensureUser(): Promise<string | null> {
  const deviceId = getDeviceId()
  
  // Check if user exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('device_id', deviceId)
    .single()

  if (existingUser) {
    return existingUser.id
  }

  // Create new user
  const { data: newUser, error } = await supabase
    .from('users')
    .insert({ device_id: deviceId })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating user:', error)
    return null
  }

  return newUser.id
}

// Get a random suggestion of a specific type
// Now supports filtering by active task groups
export async function getRandomSuggestion(type: SuggestionType, activeGroupId?: string): Promise<Suggestion | null> {
  const userId = await ensureUser()
  
  let query = supabase
    .from('suggestions')
    .select('*')
    .eq('type', type)
    .eq('is_active', true)
  
  if (activeGroupId) {
    query = query.eq('group_id', activeGroupId)
  } else if (userId) {
    // If no active group specified, fallback to logic: (group.is_default = true) OR (group.user_id = userId)
    // But since we are adding a selector, maybe we should default to "Default Pack" if nothing selected?
    // Let's keep the broad search as a fallback if no specific group is selected.
    
    const { data: groups } = await supabase
      .from('task_groups')
      .select('id')
      .or(`is_default.eq.true,user_id.eq.${userId}`)
      
    if (groups && groups.length > 0) {
      const groupIds = groups.map(g => g.id)
      query = query.in('group_id', groupIds)
    }
  } else {
    // Only default groups
    const { data: groups } = await supabase
      .from('task_groups')
      .select('id')
      .eq('is_default', true)
      
    if (groups && groups.length > 0) {
      const groupIds = groups.map(g => g.id)
      query = query.in('group_id', groupIds)
    }
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching suggestions:', error)
    return null
  }

  if (!data || data.length === 0) return null

  // Randomly select one
  const randomIndex = Math.floor(Math.random() * data.length)
  return data[randomIndex] as Suggestion
}

// Save suggestion history
export async function saveSuggestionHistory(where: string, what: string): Promise<boolean> {
  const userId = await ensureUser()
  
  if (!userId) return false

  const { error } = await supabase
    .from('suggestion_history')
    .insert({
      user_id: userId,
      where_to_go: where,
      what_to_do: what
    })

  if (error) {
    console.error('Error saving history:', error)
    return false
  }

  return true
}

// Get history
export async function getHistory(): Promise<SuggestionHistory[]> {
  const userId = await ensureUser()
  
  if (!userId) return []

  const { data, error } = await supabase
    .from('suggestion_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching history:', error)
    return []
  }

  return data as SuggestionHistory[]
}

// Clear history
export async function clearHistory(): Promise<boolean> {
  const userId = await ensureUser()
  
  if (!userId) return false

  const { error } = await supabase
    .from('suggestion_history')
    .delete()
    .eq('user_id', userId)

  if (error) {
    console.error('Error clearing history:', error)
    return false
  }

  return true
}

// --- Task Management Features ---

// Get all available task groups (Default + User's)
export async function getAvailableTaskGroups(): Promise<TaskGroup[]> {
  const userId = await ensureUser()
  
  let query = supabase
    .from('task_groups')
    .select('*')
    .order('created_at', { ascending: false })

  if (userId) {
    query = query.or(`is_default.eq.true,user_id.eq.${userId}`)
  } else {
    query = query.eq('is_default', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching available task groups:', error)
    return []
  }

  return data as TaskGroup[]
}

// Get user's task groups
export async function getUserTaskGroups(): Promise<TaskGroup[]> {
  const userId = await ensureUser()
  if (!userId) return []

  const { data, error } = await supabase
    .from('task_groups')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching task groups:', error)
    return []
  }

  return data as TaskGroup[]
}

// Create a new task group
export async function createTaskGroup(name: string, description?: string): Promise<TaskGroup | null> {
  const userId = await ensureUser()
  if (!userId) return null

  const { data, error } = await supabase
    .from('task_groups')
    .insert({
      name,
      description,
      user_id: userId,
      is_default: false
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating task group:', error)
    return null
  }

  return data as TaskGroup
}

// Add a task to a group
export async function addTaskToGroup(
  groupId: string, 
  type: SuggestionType, 
  content: string, 
  category?: string
): Promise<Suggestion | null> {
  const userId = await ensureUser()
  if (!userId) return null

  const { data, error } = await supabase
    .from('suggestions')
    .insert({
      group_id: groupId,
      user_id: userId,
      type,
      content,
      category,
      is_active: true
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding task:', error)
    return null
  }

  return data as Suggestion
}

// Get tasks in a group
export async function getGroupTasks(groupId: string): Promise<Suggestion[]> {
  const { data, error } = await supabase
    .from('suggestions')
    .select('*')
    .eq('group_id', groupId)

  if (error) {
    console.error('Error fetching group tasks:', error)
    return []
  }

  return data as Suggestion[]
}

// Delete a task
export async function deleteTask(taskId: string): Promise<boolean> {
  const userId = await ensureUser()
  if (!userId) return false

  const { error } = await supabase
    .from('suggestions')
    .delete()
    .eq('id', taskId)
    .eq('user_id', userId) // Security check

  if (error) {
    console.error('Error deleting task:', error)
    return false
  }

  return true
}

// Delete a task group (and its tasks)
export async function deleteTaskGroup(groupId: string): Promise<boolean> {
  const userId = await ensureUser()
  if (!userId) return false

  // First delete tasks
  await supabase.from('suggestions').delete().eq('group_id', groupId)
  
  // Then delete group
  const { error } = await supabase
    .from('task_groups')
    .delete()
    .eq('id', groupId)
    .eq('user_id', userId) // Security check

  if (error) {
    console.error('Error deleting task group:', error)
    return false
  }

  return true
}

// Export task group data
export async function exportTaskGroup(groupId: string): Promise<string | null> {
  const { data: group, error: groupError } = await supabase
    .from('task_groups')
    .select('name, description')
    .eq('id', groupId)
    .single()

  if (groupError || !group) return null

  const tasks = await getGroupTasks(groupId)

  const exportData: ExportData = {
    group: {
      name: group.name,
      description: group.description
    },
    tasks: tasks.map(t => ({
      type: t.type,
      content: t.content,
      category: t.category
    }))
  }

  return JSON.stringify(exportData)
}

// Import task group data
export async function importTaskGroup(jsonString: string): Promise<boolean> {
  try {
    const data: ExportData = JSON.parse(jsonString)
    
    // Create group
    const newGroup = await createTaskGroup(
      data.group.name + ' (导入)', 
      data.group.description
    )
    
    if (!newGroup) return false

    // Add tasks
    for (const task of data.tasks) {
      await addTaskToGroup(
        newGroup.id,
        task.type,
        task.content,
        task.category || 'imported'
      )
    }

    return true
  } catch (e) {
    console.error('Error importing task group:', e)
    return false
  }
}

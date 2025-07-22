import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/server-database'
import type { TimeEntryInsert } from '@/types/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let query = supabase
      .from('time_entries')
      .select(`
        *,
        projects (
          id,
          name,
          client_id
        ),
        user_profiles (
          id,
          full_name,
          avatar_url
        )
      `)

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (startDate) {
      query = query.gte('date_worked', startDate)
    }

    if (endDate) {
      query = query.lte('date_worked', endDate)
    }

    const { data: timeEntries, error } = await query.order('date_worked', { ascending: false })

    if (error) throw error

    return NextResponse.json({ timeEntries })
  } catch (error: any) {
    console.error('Error fetching time entries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch time entries', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate required fields
    const {
      project_id,
      user_id,
      hours_worked,
      description,
      date_worked,
      entry_type = 'development',
      is_billable = true,
      hourly_rate,
      start_time,
      end_time
    } = body

    if (!project_id || !user_id || !hours_worked || !description || !date_worked) {
      return NextResponse.json(
        { error: 'project_id, user_id, hours_worked, description, and date_worked are required' },
        { status: 400 }
      )
    }

    // Validate hours_worked is reasonable
    if (hours_worked <= 0 || hours_worked > 24) {
      return NextResponse.json(
        { error: 'hours_worked must be between 0 and 24' },
        { status: 400 }
      )
    }

    // Validate time range if provided
    if (start_time && end_time) {
      const startDate = new Date(start_time)
      const endDate = new Date(end_time)
      if (startDate >= endDate) {
        return NextResponse.json(
          { error: 'start_time must be before end_time' },
          { status: 400 }
        )
      }
    }

    const timeEntryData: TimeEntryInsert = {
      project_id,
      user_id,
      start_time: start_time || null,
      end_time: end_time || null,
      hours_worked: Number(hours_worked),
      description,
      entry_type,
      is_billable,
      hourly_rate: hourly_rate ? Number(hourly_rate) : null,
      date_worked
    }

    const { data: newTimeEntry, error } = await supabase
      .from('time_entries')
      .insert(timeEntryData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ timeEntry: newTimeEntry }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating time entry:', error)
    return NextResponse.json(
      { error: 'Failed to create time entry', details: error.message },
      { status: 500 }
    )
  }
}

// Helper function to calculate hours from time range
export function calculateHoursFromTimeRange(startTime: string, endTime: string): number {
  const start = new Date(startTime)
  const end = new Date(endTime)
  const diffMs = end.getTime() - start.getTime()
  return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100 // Round to 2 decimal places
}
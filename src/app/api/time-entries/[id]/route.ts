import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/server-database'
import type { TimeEntryUpdate } from '@/types/database'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const entryId = params.id
    const body = await request.json()

    if (!entryId) {
      return NextResponse.json({ error: 'Time entry ID is required' }, { status: 400 })
    }

    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate hours_worked if provided
    if (body.hours_worked !== undefined) {
      if (body.hours_worked <= 0 || body.hours_worked > 24) {
        return NextResponse.json(
          { error: 'hours_worked must be between 0 and 24' },
          { status: 400 }
        )
      }
    }

    // Validate time range if provided
    if (body.start_time && body.end_time) {
      const startDate = new Date(body.start_time)
      const endDate = new Date(body.end_time)
      if (startDate >= endDate) {
        return NextResponse.json(
          { error: 'start_time must be before end_time' },
          { status: 400 }
        )
      }
    }

    // Convert numbers to ensure proper types
    const updateData: TimeEntryUpdate = { ...body }
    if (updateData.hours_worked !== undefined) {
      updateData.hours_worked = Number(updateData.hours_worked)
    }
    if (updateData.hourly_rate !== undefined) {
      updateData.hourly_rate = Number(updateData.hourly_rate)
    }

    const { data: updatedTimeEntry, error } = await supabase
      .from('time_entries')
      .update(updateData)
      .eq('id', entryId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ timeEntry: updatedTimeEntry })
  } catch (error: any) {
    console.error('Error updating time entry:', error)
    return NextResponse.json(
      { error: 'Failed to update time entry', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const entryId = params.id

    if (!entryId) {
      return NextResponse.json({ error: 'Time entry ID is required' }, { status: 400 })
    }

    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('time_entries')
      .delete()
      .eq('id', entryId)

    if (error) throw error

    return NextResponse.json({ message: 'Time entry deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting time entry:', error)
    return NextResponse.json(
      { error: 'Failed to delete time entry', details: error.message },
      { status: 500 }
    )
  }
}
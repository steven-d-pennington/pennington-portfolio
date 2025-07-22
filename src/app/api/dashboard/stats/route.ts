import { NextRequest, NextResponse } from 'next/server'
import { getDashboardStats } from '@/lib/server-database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const isAdmin = searchParams.get('isAdmin') === 'true'

    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stats = await getDashboardStats(userId, isAdmin)

    return NextResponse.json({ stats })
  } catch (error: unknown) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
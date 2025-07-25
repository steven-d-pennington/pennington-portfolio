import { NextRequest, NextResponse } from 'next/server'
import { demoData } from '@/lib/demo-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    // Return specific data type or all data
    switch (type) {
      case 'clients':
        return NextResponse.json({ clients: demoData.clients })
      case 'projects':
        return NextResponse.json({ projects: demoData.projects })
      case 'stats':
        return NextResponse.json({ stats: demoData.stats })
      case 'time-entries':
        return NextResponse.json({ timeEntries: demoData.timeEntries })
      case 'invoices':
        return NextResponse.json({ invoices: demoData.invoices })
      default:
        return NextResponse.json(demoData)
    }
  } catch (error: unknown) {
    console.error('Error serving demo data:', error)
    return NextResponse.json(
      { error: 'Failed to serve demo data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
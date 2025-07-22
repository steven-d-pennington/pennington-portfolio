import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, getProjects } from '@/lib/server-database'
import type { ProjectInsert } from '@/types/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const isAdmin = searchParams.get('isAdmin') === 'true'

    // Get user from auth header or session
    const authHeader = request.headers.get('authorization')
    if (!authHeader && !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get projects
    const projects = await getProjects(userId || undefined, isAdmin)

    return NextResponse.json({ projects })
  } catch (error: unknown) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('CREATE PROJECT - Request body:', body)
    
    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      console.log('CREATE PROJECT - No auth header')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate required fields
    const { name, client_id, description, github_repo_url, hourly_rate, fixed_price, start_date, end_date, estimated_hours } = body

    if (!name || !client_id) {
      console.log('CREATE PROJECT - Missing required fields:', { name, client_id })
      return NextResponse.json(
        { error: 'Project name and client_id are required' },
        { status: 400 }
      )
    }

    // Validate GitHub repo URL format if provided
    if (github_repo_url && !isValidGitHubUrl(github_repo_url)) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL format' },
        { status: 400 }
      )
    }

    // Extract GitHub repo name from URL
    let github_repo_name = null
    const github_default_branch = 'main'
    if (github_repo_url) {
      const repoMatch = github_repo_url.match(/github\.com\/([^\/]+\/[^\/]+)/i)
      if (repoMatch) {
        github_repo_name = repoMatch[1]
      }
    }

    const projectData: ProjectInsert = {
      name,
      description: description || null,
      client_id,
      github_repo_url: github_repo_url || null,
      github_repo_name,
      github_default_branch,
      status: 'planning',
      start_date: start_date || null,
      end_date: end_date || null,
      estimated_hours: estimated_hours || null,
      hourly_rate: hourly_rate || null,
      fixed_price: fixed_price || null
    }

    console.log('CREATE PROJECT - Inserting project data:', projectData)
    const { data: newProject, error } = await supabaseAdmin
      .from('projects')
      .insert(projectData)
      .select()
      .single()

    if (error) {
      console.log('CREATE PROJECT - Database error:', error)
      throw error
    }

    console.log('CREATE PROJECT - Success:', newProject)
    return NextResponse.json({ project: newProject }, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

function isValidGitHubUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname === 'github.com' && parsedUrl.pathname.split('/').filter(Boolean).length >= 2
  } catch {
    return false
  }
}
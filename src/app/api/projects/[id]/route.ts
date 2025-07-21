import { NextRequest, NextResponse } from 'next/server'
import { supabase, getProject } from '@/lib/server-database'
import type { ProjectUpdateType } from '@/types/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const project = await getProject(projectId)

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error: any) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project', details: error.message },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    const body = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate GitHub repo URL if being updated
    if (body.github_repo_url && !isValidGitHubUrl(body.github_repo_url)) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL format' },
        { status: 400 }
      )
    }

    // Extract GitHub repo name if URL is being updated
    let updateData: ProjectUpdateType = { ...body }
    if (body.github_repo_url) {
      const repoMatch = body.github_repo_url.match(/github\.com\/([^\/]+\/[^\/]+)/i)
      if (repoMatch) {
        updateData.github_repo_name = repoMatch[1]
      }
    }

    const { data: updatedProject, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ project: updatedProject })
  } catch (error: any) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Note: Due to CASCADE constraints, this will also delete:
    // - Project members
    // - Time entries
    // - Invoices and line items
    // - GitHub webhook events
    // - Project updates
    const { error: deleteError } = await supabase.from('projects').delete().eq('id', projectId)
    
    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project', details: error.message },
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
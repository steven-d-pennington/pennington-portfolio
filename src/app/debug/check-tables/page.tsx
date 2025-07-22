'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase'

export default function CheckTablesPage() {
  const [results, setResults] = useState<unknown>(null)
  const [loading, setLoading] = useState(false)

  const checkTables = async () => {
    setLoading(true)
    try {
      // Check if projects table exists
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('count', { count: 'exact', head: true })

      // Check if user_profiles has new columns
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, role, company_name, phone, address, timezone')
        .limit(1)

      setResults({
        projects: {
          exists: !projectsError,
          error: projectsError?.message,
          count: projectsData
        },
        user_profiles: {
          hasNewColumns: !profilesError,
          error: profilesError?.message,
          sample: profilesData
        }
      })
    } catch (error: unknown) {
      setResults({ error: error instanceof Error ? error.message : String(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Database Tables Check</h1>
      
      <button 
        onClick={checkTables}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
      >
        {loading ? 'Checking...' : 'Check Database Tables'}
      </button>

      {results && (results as any) && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Results:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-bold text-yellow-800 mb-2">If Tables Don't Exist:</h3>
        <p className="text-sm text-yellow-700">
          You need to run the database migration. Go to your Supabase dashboard → SQL Editor 
          and run the migration file: <code>sql-migrations/2025-01-21_15-00_extend-user-profiles-for-dashboard.sql</code>
        </p>
      </div>
    </div>
  )
}
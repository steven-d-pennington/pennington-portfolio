'use client'

interface QuickStatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red'
  trend?: {
    value: number
    isPositive: boolean
  }
}

export default function QuickStatsCard({ title, value, icon, color, trend }: QuickStatsCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900',
          text: 'text-blue-600 dark:text-blue-400',
          valueText: 'text-blue-600'
        }
      case 'green':
        return {
          bg: 'bg-green-100 dark:bg-green-900',
          text: 'text-green-600 dark:text-green-400',
          valueText: 'text-green-600'
        }
      case 'purple':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900',
          text: 'text-purple-600 dark:text-purple-400',
          valueText: 'text-purple-600'
        }
      case 'yellow':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900',
          text: 'text-yellow-600 dark:text-yellow-400',
          valueText: 'text-yellow-600'
        }
      case 'red':
        return {
          bg: 'bg-red-100 dark:bg-red-900',
          text: 'text-red-600 dark:text-red-400',
          valueText: 'text-red-600'
        }
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-700',
          text: 'text-gray-600 dark:text-gray-400',
          valueText: 'text-gray-600'
        }
    }
  }

  const colors = getColorClasses(color)

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <div className={colors.text}>
            {icon}
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <div className="flex items-center justify-between">
            <p className={`text-2xl font-bold ${colors.valueText}`}>{value}</p>
            {trend && (
              <div className={`flex items-center text-sm ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <svg
                  className={`w-4 h-4 mr-1 ${trend.isPositive ? '' : 'rotate-180'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l10-10M17 7l-10 10" />
                </svg>
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
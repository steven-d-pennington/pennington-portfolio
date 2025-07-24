'use client';

import { useUser } from './AuthProvider';
import { navigationConfig } from '@/types/navigation';

export default function NavigationDebug() {
  const { user, userProfile, loading } = useUser();

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-300 p-4 rounded-lg text-xs max-w-xs z-50">
      <h4 className="font-bold text-yellow-800 mb-2">Navigation Debug</h4>
      <div className="space-y-1 text-yellow-700">
        <div><strong>User:</strong> {user.email}</div>
        <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
        <div><strong>Profile:</strong> {userProfile ? 'Loaded' : 'Not loaded'}</div>
        <div><strong>Role:</strong> {userProfile?.role || 'None'}</div>
        <div><strong>Full Name:</strong> {userProfile?.full_name || 'None'}</div>
        <div><strong>Protected Items Count:</strong> {navigationConfig.protected?.length || 0}</div>
        <div className="mt-2">
          <strong>Protected Items:</strong>
          <ul className="ml-2">
            {navigationConfig.protected?.map(item => (
              <li key={item.href}>
                {item.name} - {item.href}
                {(item.href === '/dashboard/users' || item.href === '/dashboard/clients') && 
                 userProfile?.role !== 'admin' ? ' (HIDDEN)' : ' (VISIBLE)'}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
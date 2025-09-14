'use client';

import { useState } from 'react';
import { Leva, useControls } from 'leva';
import RealtimeVortex from '@/components/RealtimeVortex';
import { useRealtimePresence } from '@/hooks/useRealtimePresence';
import { samplePeople30, generateSamplePeople } from '@/lib/sampleData';
import { getTailwindColorsFromId, getInitialsFromName } from '@/lib/colorUtils';
import { useVortexStore, selectMode } from '@/stores/vortexStore';

// Helper function to pluralize text
const pluralize = (count: number, singular: string, plural: string) => {
  return count === 1 ? singular : plural;
};

// Helper function to group users into lines (similar to VortexAvatars grouping logic)
const groupUsersIntoLines = (users: any[]) => {
  const peoplePerGroup = 3;
  const completeGroups = Math.floor(users.length / peoplePerGroup);
  const leftoverPeople = users.length % peoplePerGroup;
  
  // Handle edge case: if we have fewer than 3 people total, create 1 group
  const totalGroups = completeGroups === 0 ? 1 : completeGroups;
  
  const groups: any[][] = [];
  
  if (completeGroups === 0) {
    // Special case: fewer than 3 people total, just place them in one group
    groups.push(users.slice(0));
  } else {
    // First, place all complete groups of 3
    for (let g = 0; g < completeGroups; g++) {
      const startIdx = g * peoplePerGroup;
      const endIdx = startIdx + peoplePerGroup;
      groups.push(users.slice(startIdx, endIdx));
    }
    
    // Now distribute leftover people among the first few groups
    const leftoverUsers = users.slice(completeGroups * peoplePerGroup);
    for (let i = 0; i < leftoverPeople; i++) {
      const groupIndex = i % totalGroups; // Cycle through groups
      groups[groupIndex].push(leftoverUsers[i]);
    }
  }
  
  return groups;
};

export default function LivePage() {
  const [hasJoined, setHasJoined] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { joinRoom, leaveRoom, users, isConnected, connectionError, addTestUsers, clearTestUsers } = useRealtimePresence('live');
  const mode = useVortexStore(selectMode);

  // Leva controls for testing
  const _controls = useControls({
    'Add 30 Test Users': {
      value: false,
      onChange: (value: boolean) => {
        if (value) {
          handleAddTestUsers();
        }
      }
    },
    'Clear Test Users': {
      value: false,
      onChange: (value: boolean) => {
        if (value) {
          clearTestUsers();
        }
      }
    }
  });

  const handleAddTestUsers = () => {
    const testPeople = generateSamplePeople(30);
    
    // Convert to the format expected by addTestUsers
    const testUsersData = testPeople.map(person => ({
      name: person.name,
      email: `${person.name.toLowerCase().replace(' ', '.')}@test.com`
    }));
    
    addTestUsers(testUsersData);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      await joinRoom({ name: name.trim(), email: email.trim() });
      setHasJoined(true);
    }
  };

  const handleLeave = async () => {
    await leaveRoom();
    setHasJoined(false);
    setName('');
    setEmail('');
  };

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-8">
        <div className="bg-white shadow-lg border border-gray-200 rounded-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Join Live Meet</h2>
          <form onSubmit={handleJoin} className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="submit"
              disabled={!isConnected || !!connectionError}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition border border-blue-600"
            >
              {connectionError 
                ? 'Connection Error' 
                : isConnected 
                  ? `Join Live (${users.length} ${pluralize(users.length, 'person', 'people')} online)` 
                  : 'Connecting...'}
            </button>
            
            {connectionError && (
              <div className="text-red-700 text-sm text-center p-3 bg-red-50 rounded-xl border border-red-200">
                ⚠️ {connectionError}
                <br />
                <small>Please check your Supabase configuration in .env.local</small>
              </div>
            )}
          </form>
          <p className="text-xs text-gray-500 text-center mt-4">
            Join the live session and see real people in the meet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
      {/* Leva Controls */}
      <Leva collapsed={false} />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
           ({users.length} {pluralize(users.length, 'person', 'people')} online)
          </h1>
          
        </div>
        
        <div className="space-y-8">
          {/* Full Width Vortex Visualization */}
          <div>

            <div className="rounded-2xl p-6 h-[600px]">
              <RealtimeVortex 
                roomName="live"
                users={users}
                isConnected={isConnected}
                fallbackPeople={samplePeople30}
                className="w-full h-full"
                showControls={true}
              />
            
            </div>
          </div>

          {/* User List */}
          <div>
            <div className="bg-white shadow-lg border border-gray-200 rounded-2xl p-6 h-[400px] overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 sticky top-0 bg-inherit">
                {mode === 'groups' ? `User Groups (${users.length} people)` : `Online Users (${users.length})`}
              </h3>
              
              {users.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  {connectionError ? (
                    <>
                      ❌ Connection Error: {connectionError}
                      <br />
                      <small className="text-red-600">Check your Supabase configuration in .env.local</small>
                    </>
                  ) : (
                    <>
                      No users online yet... 
                      <br />
                      <small>Connection status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</small>
                    </>
                  )}
                </div>
              ) : mode === 'groups' ? (
                // Grouped display: names arranged in lines
                <div className="space-y-4">
                  {groupUsersIntoLines(users).map((group, groupIndex) => (
                    <div key={groupIndex} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex flex-wrap items-center gap-3">
                        {group.map((user) => {
                          const colors = getTailwindColorsFromId(user.id);
                          return (
                            <div key={user.id} className="flex items-center gap-2">
                              <div className={`w-8 h-8 ${colors.bg} rounded-full flex items-center justify-center ${colors.text} font-semibold border ${colors.border} text-xs`}>
                                {getInitialsFromName(user.name)}
                              </div>
                              <span className="text-sm font-medium text-gray-800">{user.name}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Group {groupIndex + 1} • {group.length} {pluralize(group.length, 'person', 'people')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Vortex display: individual cards
                <div className="space-y-3">
                  {users.map((user, _index) => {
                    const colors = getTailwindColorsFromId(user.id);
                    return (
                    <div 
                      key={user.id} 
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className={`w-10 h-10 ${colors.bg} rounded-full flex items-center justify-center ${colors.text} font-semibold border ${colors.border}`}>
                        {getInitialsFromName(user.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 truncate">{user.name}</div>
                        <div className="text-sm text-gray-500 truncate">{user.email}</div>
                      </div>
                      <div className="text-xs text-gray-400 text-right">
                        {new Date(user.joinedAt).toLocaleTimeString()}
                      </div>
                    </div>
                  )})}
                  
                </div>
              )}
              
              {/* Debug info */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <details className="text-xs text-gray-500">
                  <summary className="cursor-pointer hover:text-gray-700">Debug Info</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto text-gray-700">
                    {JSON.stringify({
                      isConnected,
                      connectionError,
                      userCount: users.length,
                      users: users.map(u => ({ id: u.id, name: u.name, email: u.email })),
                      environment: {
                        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                      }
                    }, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          </div>
        </div>
        
        {/* Leave Button */}
        {/* <div className="text-center mt-8">
          <button
            onClick={handleLeave}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition border border-red-600"
          >
            Leave Room
          </button>
        </div> */}
      </div>
    </div>
  );
}

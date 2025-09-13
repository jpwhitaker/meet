'use client';

import { useState } from 'react';
import RealtimeVortex from '@/components/RealtimeVortex';
import { useRealtimePresence } from '@/hooks/useRealtimePresence';
import { samplePeople30 } from '@/lib/sampleData';

export default function LivePage() {
  const [hasJoined, setHasJoined] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { joinRoom, leaveRoom, users, isConnected, connectionError } = useRealtimePresence('live');

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
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 flex items-center justify-center p-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Join Live Vortex</h2>
          <form onSubmit={handleJoin} className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
            <button
              type="submit"
              disabled={!isConnected || !!connectionError}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white rounded-xl font-semibold transition"
            >
              {connectionError 
                ? 'Connection Error' 
                : isConnected 
                  ? `Join Live (${users.length} people online)` 
                  : 'Connecting...'}
            </button>
            
            {connectionError && (
              <div className="text-red-300 text-sm text-center p-3 bg-red-900/20 rounded-xl border border-red-500/30">
                ⚠️ {connectionError}
                <br />
                <small>Please check your Supabase configuration in .env.local</small>
              </div>
            )}
          </form>
          <p className="text-xs text-white/60 text-center mt-4">
            Join the live session and see real people in the vortex
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Live Vortex ({users.length} people online)
          </h1>
          <p className="text-xl text-emerald-200">
            Real-time collaboration in the vortex
          </p>
        </div>
        
        {/* Debug: Simple list of online users */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Online Users ({users.length})
            </h3>
            
            {users.length === 0 ? (
              <div className="text-emerald-200/60 text-center py-8">
                {connectionError ? (
                  <>
                    ❌ Connection Error: {connectionError}
                    <br />
                    <small className="text-red-300">Check your Supabase configuration in .env.local</small>
                  </>
                ) : (
                  <>
                    No users online yet... 
                    <br />
                    <small>Connection status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</small>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user, index) => (
                  <div 
                    key={user.id} 
                    className="flex items-center gap-4 p-3 bg-white/10 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-sm text-emerald-200/60">{user.email}</div>
                    </div>
                    <div className="text-xs text-emerald-200/40">
                      Joined: {new Date(user.joinedAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Debug info */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <details className="text-xs text-emerald-200/60">
                <summary className="cursor-pointer hover:text-emerald-200">Debug Info</summary>
                <pre className="mt-2 p-2 bg-black/20 rounded text-xs overflow-x-auto">
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
        
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-emerald-200/80">
            Share this URL with others to see them join in real-time!
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleLeave}
              className="px-6 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-200 rounded-xl text-sm transition border border-red-400/30"
            >
              Leave Session
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm transition"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

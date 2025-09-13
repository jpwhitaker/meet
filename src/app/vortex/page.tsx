'use client';

import { useState } from 'react';
import RealtimeVortex from '@/components/RealtimeVortex';
import { useRealtimePresence } from '@/hooks/useRealtimePresence';
import { samplePeople40 } from '@/lib/sampleData';

// Helper function to pluralize text
const pluralize = (count: number, singular: string, plural: string) => {
  return count === 1 ? singular : plural;
};

export default function VortexPage() {
  const [hasJoined, setHasJoined] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { joinRoom, users, isConnected } = useRealtimePresence('vortex');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      await joinRoom({ name: name.trim(), email: email.trim() });
      setHasJoined(true);
    }
  };

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center p-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Join the Vortex</h2>
          <form onSubmit={handleJoin} className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
            <button
              type="submit"
              disabled={!isConnected}
              className="w-full py-3 bg-white/20 hover:bg-white/30 disabled:bg-gray-600 text-white rounded-xl font-semibold transition border border-white/30"
            >
              {isConnected ? `Join (${users.length} ${pluralize(users.length, 'person', 'people')} online)` : 'Connecting...'}
            </button>
          </form>
          <p className="text-xs text-white/60 text-center mt-4">
            Enter your details to see others in the vortex
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Vortex Avatars ({users.length} {pluralize(users.length, 'person', 'people')} online)
          </h1>
          <p className="text-xl text-slate-300">
            Watch as people join and leave in real-time!
          </p>
        </div>
        
        <div className="flex justify-center">
          <RealtimeVortex 
            roomName="vortex" 
            fallbackPeople={samplePeople40}
            className="w-full max-w-4xl h-[600px]"
          />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            Click the toggle button to switch between vortex and grouped modes
          </p>
          <button
            onClick={() => setHasJoined(false)}
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm transition"
          >
            Leave Vortex
          </button>
        </div>
      </div>
    </div>
  );
}

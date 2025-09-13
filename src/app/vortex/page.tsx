'use client';

import VortexAvatars from '../vortex';

export default function VortexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Vortex Avatars
          </h1>
          <p className="text-xl text-slate-300">
            An organic whirlpool of avatars with smooth transitions
          </p>
        </div>
        
        <div className="flex justify-center">
          <VortexAvatars />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            Click the toggle button to switch between vortex and grouped modes
          </p>
        </div>
      </div>
    </div>
  );
}

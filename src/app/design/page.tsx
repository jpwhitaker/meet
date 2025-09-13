'use client';

import { useState } from 'react';
import VortexAvatars from '@/components/VortexAvatars';
import { samplePeople30, generateSamplePeople } from '@/lib/sampleData';

export default function DesignPage() {
  const [peopleCount, setPeopleCount] = useState(30);
  const [people, setPeople] = useState(samplePeople30);

  const handleCountChange = (newCount: number) => {
    setPeopleCount(newCount);
    setPeople(generateSamplePeople(newCount));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Design Mode
          </h1>
          <p className="text-xl text-purple-200">
            Perfect for testing and demonstrations with sample data
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-center gap-6">
            <div className="text-white">
              <label className="block text-sm font-medium mb-2">Number of Avatars</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={peopleCount}
                  onChange={(e) => handleCountChange(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-2xl font-bold w-12 text-center">{peopleCount}</span>
              </div>
            </div>
            <div className="border-l border-white/20 pl-6">
              <div className="flex gap-2">
                {[10, 30, 50, 100].map((count) => (
                  <button
                    key={count}
                    onClick={() => handleCountChange(count)}
                    className={`px-3 py-1 rounded-lg text-sm transition ${
                      peopleCount === count
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/20 text-white/80 hover:bg-white/30'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-l border-white/20 pl-6">
              <button
                onClick={() => handleCountChange(peopleCount)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition"
              >
                🎲 Regenerate
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <VortexAvatars 
            people={people}
            showControls={true}
            showStats={true}
            statusText="🎨 Design Mode"
            className="w-full max-w-4xl h-[600px]"
          />
        </div>
        
        <div className="mt-8 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-2">Design Mode Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-200">
              <div>
                <span className="font-medium">📊 Adjustable Count:</span><br />
                Test with 5-100 avatars
              </div>
              <div>
                <span className="font-medium">🎲 Random Generation:</span><br />
                Fresh names every time
              </div>
              <div>
                <span className="font-medium">🎨 Perfect for Demos:</span><br />
                No signup required
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

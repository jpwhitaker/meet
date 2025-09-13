
'use client';

import { QRCodeSVG } from 'qrcode.react';

export default function Home() {
  // Use your ngrok URL for easy access from anywhere
  const signupUrl = 'https://ec9c841de615.ngrok-free.app/signup';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
      <div className="text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Meet
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Scan the QR code below to sign up
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <QRCodeSVG
              value={signupUrl}
              size={300}
              level="M"
              includeMargin={true}
              fgColor="#000000"
              bgColor="#FFFFFF"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            Point your camera at the QR code
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Or visit: <span className="font-mono text-indigo-600 dark:text-indigo-400">{signupUrl}</span>
          </p>
          
          {/* Vortex Demo Links */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Try the Vortex Demos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/live"
                className="p-4 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl hover:bg-emerald-200 dark:hover:bg-emerald-900/30 transition"
              >
                <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">🔴 Live</h4>
                <p className="text-sm text-emerald-600 dark:text-emerald-300">Real people, real-time</p>
              </a>
              <a
                href="/design"
                className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/30 transition"
              >
                <h4 className="font-semibold text-purple-800 dark:text-purple-200">🎨 Design</h4>
                <p className="text-sm text-purple-600 dark:text-purple-300">30 sample avatars</p>
              </a>
              <a
                href="/vortex"
                className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/30 transition"
              >
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">🌪️ Vortex</h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">Original demo</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

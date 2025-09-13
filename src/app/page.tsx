
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
        
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            Point your camera at the QR code
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Or visit: <span className="font-mono text-indigo-600 dark:text-indigo-400">{signupUrl}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

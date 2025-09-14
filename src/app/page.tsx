
'use client';

import { QRCodeSVG } from 'qrcode.react';
import SudoLogo from '@/components/SudoLogo';

function getAppUrl(): string {
  // Allow custom override
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // Use Vercel URL when deployed
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  
  // Default to localhost for development
  return 'http://localhost:3000';
}

export default function Home() {
  // Dynamic URL based on environment
  const signupUrl = `${getAppUrl()}/live`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
      <div className="text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Meet!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Scan the QR code below to sign up
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <SudoLogo size={120} />
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
            Or visit: <a href={signupUrl} className="font-mono text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 underline">{signupUrl}</a>
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useMemo, useEffect } from 'react';
import VortexAvatars, { type Person } from './VortexAvatars';

export default function RealtimeVortex({ 
  roomName,
  users = [],
  fallbackPeople = [],
  className,
  showControls = true,
  isConnected = true
}: {
  roomName: string;
  users?: any[];
  fallbackPeople?: Person[];
  className?: string;
  showControls?: boolean;
  isConnected?: boolean;
}) {
  // Debug effect to track users changes
  useEffect(() => {
    console.log('RealtimeVortex - users changed:', users);
  }, [users]);

  // Convert Realtime users to Person format, fallback to provided people if no users
  const people = useMemo<Person[]>(() => {
    console.log('🔍 RealtimeVortex - useMemo recalculating');
    console.log('   - users:', users);
    console.log('   - users.length:', users.length);
    console.log('   - fallbackPeople.length:', fallbackPeople.length);
    console.log('   - roomName:', roomName);
    
    if (users.length > 0) {
      const convertedUsers = users.map(user => ({
        id: user.id,
        name: user.name,
        image: undefined // Could add Gravatar integration later
      }));
      console.log('✅ RealtimeVortex - using real users:', convertedUsers);
      return convertedUsers;
    }
    
    console.log('⚠️ RealtimeVortex - using fallback people (no real users found)');
    return fallbackPeople;
  }, [users, fallbackPeople, roomName]);

  const statusText = isConnected 
    ? users.length > 0 
      ? `🟢 ${users.length} online`
      : '🟢 Connected'
    : '🔴 Connecting...';

  return (
    <VortexAvatars
      people={people}
      statusText={statusText}
      showControls={showControls}
      showStats={true}
      className={className}
    />
  );
}

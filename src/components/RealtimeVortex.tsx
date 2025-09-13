'use client';

import { useMemo, useEffect } from 'react';
import VortexAvatars, { type Person } from './VortexAvatars';
import { useRealtimePresence } from '@/hooks/useRealtimePresence';

export default function RealtimeVortex({ 
  roomName,
  fallbackPeople = [],
  className,
  showControls = true 
}: {
  roomName: string;
  fallbackPeople?: Person[];
  className?: string;
  showControls?: boolean;
}) {
  const { users, isConnected } = useRealtimePresence(roomName);

  // Debug effect to track users changes
  useEffect(() => {
    console.log('RealtimeVortex - users changed:', users);
  }, [users]);

  // Convert Realtime users to Person format, fallback to provided people if no users
  const people = useMemo<Person[]>(() => {
    console.log('RealtimeVortex - useMemo recalculating, users:', users, 'length:', users.length, 'fallbackPeople:', fallbackPeople.length);
    
    if (users.length > 0) {
      const convertedUsers = users.map(user => ({
        id: user.id,
        name: user.name,
        image: undefined // Could add Gravatar integration later
      }));
      console.log('RealtimeVortex - using real users:', convertedUsers);
      return convertedUsers;
    }
    
    console.log('RealtimeVortex - using fallback people');
    return fallbackPeople;
  }, [users, fallbackPeople]);

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

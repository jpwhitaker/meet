import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export type PresenceUser = {
  id: string
  name: string
  email: string
  joinedAt: string
}

export function useRealtimePresence(roomName: string) {
  const [users, setUsers] = useState<PresenceUser[]>([])
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [updateCounter, setUpdateCounter] = useState(0)
  const usersRef = useRef<PresenceUser[]>([])
  
  // Keep ref in sync with state
  useEffect(() => {
    usersRef.current = users
    console.log('✅ Users state updated:', users.length, 'users')
    console.log('📊 State data:', users)
  }, [users])

  useEffect(() => {
    // Check if Supabase is properly configured
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }
    } catch (error) {
      console.error('❌ Supabase configuration error:', error)
      setConnectionError(`Supabase configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return
    }

    const roomChannel = supabase.channel(`presence-${roomName}`, {
      config: {
        presence: {
          key: crypto.randomUUID(), // Unique key for this client
        },
      },
    })

    const updateUsers = () => {
      const presenceState = roomChannel.presenceState()
      const allUsers: PresenceUser[] = []
      
      Object.values(presenceState).forEach((presences: any) => {
        presences.forEach((presence: any) => {
          allUsers.push(presence)
        })
      })
      
      console.log('🔄 Updating users:', allUsers.length, 'users found')
      console.log('📊 Users data:', allUsers)
      
      // Force update with new array
      setUsers(allUsers)
      setUpdateCounter(prev => prev + 1)
    }

    roomChannel
      .on('presence', { event: 'sync' }, () => {
        console.log('Presence sync event')
        updateUsers()
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences)
        updateUsers()
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences)
        updateUsers()
      })
      .subscribe(async (status) => {
        console.log('📡 Channel status:', status)
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
          setConnectionError(null)
        } else if (status === 'CHANNEL_ERROR') {
          setConnectionError('Failed to connect to real-time channel')
          setIsConnected(false)
        } else if (status === 'TIMED_OUT') {
          setConnectionError('Connection timed out')
          setIsConnected(false)
        } else if (status === 'CLOSED') {
          setConnectionError('Connection closed')
          setIsConnected(false)
        }
      })

    setChannel(roomChannel)

    return () => {
      roomChannel.unsubscribe()
      setIsConnected(false)
    }
  }, [roomName])

  const joinRoom = async (user: Omit<PresenceUser, 'id' | 'joinedAt'>) => {
    if (!channel || !isConnected) return

    const userWithMetadata: PresenceUser = {
      id: crypto.randomUUID(),
      name: user.name,
      email: user.email,
      joinedAt: new Date().toISOString(),
    }

    await channel.track(userWithMetadata)
    
    // Force an update after tracking
    setTimeout(() => {
      const presenceState = channel.presenceState()
      const allUsers: PresenceUser[] = []
      
      Object.values(presenceState).forEach((presences: any) => {
        presences.forEach((presence: any) => {
          allUsers.push(presence)
        })
      })
      
      console.log('🚀 Force update after join:', allUsers.length, 'users')
      console.log('📊 Join update data:', allUsers)
      setUsers(allUsers)
      setUpdateCounter(prev => prev + 1)
    }, 100)
  }

  const leaveRoom = async () => {
    if (!channel) return
    await channel.untrack()
  }

  console.log('🎯 Hook returning:', users.length, 'users, counter:', updateCounter);
  
  return {
    users,
    isConnected,
    connectionError,
    joinRoom,
    leaveRoom,
  }
}

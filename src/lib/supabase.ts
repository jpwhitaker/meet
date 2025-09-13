import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

// Lazy initialization function
function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient
  }

  // Only try to create client in browser environment
  if (typeof window === 'undefined') {
    throw new Error('Supabase client should only be initialized on the client side')
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Better error handling for missing environment variables
  if (!supabaseUrl) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
    throw new Error('Supabase URL is required. Please check your .env.local file.')
  }

  if (!supabaseAnonKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
    throw new Error('Supabase anon key is required. Please check your .env.local file.')
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  })

  return supabaseClient
}

// Export a getter function instead of the direct client
export const supabase = {
  get client() {
    return getSupabaseClient()
  },
  // Proxy common methods to maintain compatibility
  channel: (...args: Parameters<SupabaseClient['channel']>) => getSupabaseClient().channel(...args),
  from: (...args: Parameters<SupabaseClient['from']>) => getSupabaseClient().from(...args),
  auth: {
    get signInWithOAuth() {
      return getSupabaseClient().auth.signInWithOAuth.bind(getSupabaseClient().auth)
    },
    get signOut() {
      return getSupabaseClient().auth.signOut.bind(getSupabaseClient().auth)
    },
    get getUser() {
      return getSupabaseClient().auth.getUser.bind(getSupabaseClient().auth)
    },
    get onAuthStateChange() {
      return getSupabaseClient().auth.onAuthStateChange.bind(getSupabaseClient().auth)
    }
  }
}

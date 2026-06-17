// Supabase Client Configuration
// ================================
// This module initializes the Supabase client for workout data persistence.
//
// SETUP INSTRUCTIONS:
// 1. Create a Supabase project at https://supabase.com
// 2. Go to Settings > API in your Supabase dashboard
// 3. Replace SUPABASE_URL with your project's URL (e.g., https://xxxxx.supabase.co)
// 4. Replace SUPABASE_ANON_KEY with your project's anon/public key
// 5. Run the SQL from services/database.sql in your Supabase SQL Editor
// 6. Enable Row Level Security on the workout_sessions table
//
// IMPORTANT: The anon key is safe to include in client-side code because
// Row Level Security (RLS) policies protect the data. Never use the
// service_role key in client-side code.

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// ============================================================
// REPLACE THESE WITH YOUR OWN SUPABASE PROJECT CREDENTIALS
// ============================================================
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
// ============================================================

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export default supabase;

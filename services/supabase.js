// Supabase Client Configuration
// ================================
// This module initializes the Supabase client for workout data persistence.
//
// SETUP INSTRUCTIONS:
// 1. Create a Supabase project at https://supabase.com
// 2. Go to Settings > API in your Supabase dashboard
// 3. Replace SUPABASE_URL with your project's URL (e.g., https://xxxxx.supabase.co)
// 4. Replace SUPABASE_ANON_KEY with your project's anon/public key
// 5. Run the SQL below in your Supabase SQL Editor
// 6. Enable Row Level Security on the workout_sessions table
//
// IMPORTANT: The anon key is safe to include in client-side code because
// Row Level Security (RLS) policies protect the data. Never use the
// service_role key in client-side code.
//
// DATABASE SCHEMA (run in Supabase SQL Editor):
// -----------------------------------------------
// CREATE TABLE IF NOT EXISTS workout_sessions (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
//   exercise_id TEXT NOT NULL,
//   exercise_name TEXT NOT NULL,
//   total_duration_seconds INTEGER NOT NULL DEFAULT 0,
//   total_reps INTEGER NOT NULL DEFAULT 0,
//   sets JSONB NOT NULL DEFAULT '[]'::jsonb,
//   -- sets format: [{"setNumber": 1, "reps": 12, "duration": 45}, ...]
//   started_at TIMESTAMPTZ,
//   completed_at TIMESTAMPTZ,
//   created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
// );
//
// CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);
// CREATE INDEX IF NOT EXISTS idx_workout_sessions_exercise_id ON workout_sessions(exercise_id);
// CREATE INDEX IF NOT EXISTS idx_workout_sessions_completed_at ON workout_sessions(completed_at DESC);
//
// ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
//
// CREATE POLICY "Users can view own workout sessions" ON workout_sessions
//   FOR SELECT USING (auth.uid() = user_id);
// CREATE POLICY "Users can insert own workout sessions" ON workout_sessions
//   FOR INSERT WITH CHECK (auth.uid() = user_id);
// CREATE POLICY "Users can update own workout sessions" ON workout_sessions
//   FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
// CREATE POLICY "Users can delete own workout sessions" ON workout_sessions
//   FOR DELETE USING (auth.uid() = user_id);
// -----------------------------------------------

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

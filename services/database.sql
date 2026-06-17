-- Supabase Database Schema for AI-Powered Workout Tracker
-- =========================================================
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- This creates the required table and Row Level Security (RLS) policies.

-- =====================
-- WORKOUT SESSIONS TABLE
-- =====================
-- Stores completed workout sessions with rep counts and set data.
-- Only numeric/text results are stored here - no video or image data.

CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_id TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  total_duration_seconds INTEGER NOT NULL DEFAULT 0,
  total_reps INTEGER NOT NULL DEFAULT 0,
  sets JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- sets format: [{"setNumber": 1, "reps": 12, "duration": 45}, ...]
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create an index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id
  ON workout_sessions(user_id);

-- Create an index on exercise_id for stats queries
CREATE INDEX IF NOT EXISTS idx_workout_sessions_exercise_id
  ON workout_sessions(exercise_id);

-- Create an index on completed_at for ordering recent workouts
CREATE INDEX IF NOT EXISTS idx_workout_sessions_completed_at
  ON workout_sessions(completed_at DESC);

-- =====================
-- ROW LEVEL SECURITY
-- =====================
-- Enable RLS so users can only access their own workout data.

ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own workout sessions
CREATE POLICY "Users can view own workout sessions"
  ON workout_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own workout sessions
CREATE POLICY "Users can insert own workout sessions"
  ON workout_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own workout sessions
CREATE POLICY "Users can update own workout sessions"
  ON workout_sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own workout sessions
CREATE POLICY "Users can delete own workout sessions"
  ON workout_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

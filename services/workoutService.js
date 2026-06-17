// Workout Service
// ================
// Service layer for persisting workout session data to Supabase.
// Only final results (rep counts, set data, duration) are sent.
// No video or image data is ever transmitted.

import supabase from './supabase';

/**
 * Save a completed workout session to Supabase.
 *
 * @param {Object} sessionData
 * @param {string} sessionData.exerciseId - The exercise identifier
 * @param {string} sessionData.exerciseName - Human-readable exercise name
 * @param {number} sessionData.totalDuration - Total duration in seconds
 * @param {number} sessionData.totalReps - Total reps across all sets
 * @param {Array} sessionData.sets - Array of {setNumber, reps, duration}
 * @param {string} sessionData.startedAt - ISO timestamp when workout started
 * @param {string} sessionData.completedAt - ISO timestamp when workout ended
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function saveWorkoutSession({
  exerciseId,
  exerciseName,
  totalDuration,
  totalReps,
  sets,
  startedAt,
  completedAt,
}) {
  try {
    // Get the current authenticated user for RLS compliance
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      return { data: null, error: { message: 'User not authenticated. Please sign in to save workouts.' } };
    }

    const { data, error } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: userData.user.id,
        exercise_id: exerciseId,
        exercise_name: exerciseName,
        total_duration_seconds: totalDuration,
        total_reps: totalReps,
        sets: sets,
        started_at: startedAt,
        completed_at: completedAt,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: { message: err.message || 'Failed to save workout session' } };
  }
}

/**
 * Fetch recent workout history ordered by completion date.
 *
 * @param {number} [limit=20] - Maximum number of sessions to return
 * @returns {Promise<{data: Array|null, error: Object|null}>}
 */
export async function getWorkoutHistory(limit = 20) {
  try {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: { message: err.message || 'Failed to fetch workout history' } };
  }
}

/**
 * Get aggregate statistics for a specific exercise.
 *
 * @param {string} exerciseId - The exercise identifier to get stats for
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 *   data shape: { totalReps, sessionsCount, bestSet }
 */
export async function getExerciseStats(exerciseId) {
  try {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('exercise_id', exerciseId)
      .order('completed_at', { ascending: false });

    if (error) {
      return { data: null, error };
    }

    if (!data || data.length === 0) {
      return {
        data: { totalReps: 0, sessionsCount: 0, bestSet: null },
        error: null,
      };
    }

    const totalReps = data.reduce((sum, session) => sum + (session.total_reps || 0), 0);
    const sessionsCount = data.length;

    // Find the best single set across all sessions (highest reps in one set)
    let bestSet = null;
    data.forEach((session) => {
      if (session.sets && Array.isArray(session.sets)) {
        session.sets.forEach((set) => {
          if (!bestSet || set.reps > bestSet.reps) {
            bestSet = { ...set, sessionDate: session.completed_at };
          }
        });
      }
    });

    return {
      data: { totalReps, sessionsCount, bestSet },
      error: null,
    };
  } catch (err) {
    return { data: null, error: { message: err.message || 'Failed to fetch exercise stats' } };
  }
}

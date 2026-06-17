/**
 * Exercise configuration - single source of truth for all supported exercises.
 * Defines metadata, thresholds, and detection parameters for each exercise.
 */

const EXERCISE_CONFIG = {
  squats: {
    id: 'squats',
    name: 'Squats',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    difficulty: 'Beginner',
    description: 'Lower body compound exercise targeting quads and glutes',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 12,
    defaultHoldSeconds: null,
    landmarksUsed: ['left_hip', 'right_hip', 'left_knee', 'right_knee', 'left_ankle', 'right_ankle'],
    thresholds: {
      downAngle: 90,
      upAngle: 160,
    },
  },
  push_ups: {
    id: 'push_ups',
    name: 'Push-Ups',
    targetMuscles: ['Chest', 'Triceps', 'Shoulders'],
    difficulty: 'Beginner',
    description: 'Upper body exercise targeting chest and triceps',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 10,
    defaultHoldSeconds: null,
    landmarksUsed: ['left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow', 'left_wrist', 'right_wrist'],
    thresholds: {
      downAngle: 90,
      upAngle: 160,
    },
  },
  lunges: {
    id: 'lunges',
    name: 'Lunges',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    difficulty: 'Beginner',
    description: 'Unilateral leg exercise improving balance and strength',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 10,
    defaultHoldSeconds: null,
    landmarksUsed: ['left_hip', 'right_hip', 'left_knee', 'right_knee', 'left_ankle', 'right_ankle'],
    thresholds: {
      downAngle: 100,
      upAngle: 150,
    },
  },
  bicep_curls: {
    id: 'bicep_curls',
    name: 'Bicep Curls',
    targetMuscles: ['Biceps', 'Forearms'],
    difficulty: 'Beginner',
    description: 'Isolation exercise targeting the biceps',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 12,
    defaultHoldSeconds: null,
    landmarksUsed: ['left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow', 'left_wrist', 'right_wrist'],
    thresholds: {
      downAngle: 140,
      upAngle: 50,
    },
  },
  plank_hold: {
    id: 'plank_hold',
    name: 'Plank Hold',
    targetMuscles: ['Core', 'Shoulders', 'Back'],
    difficulty: 'Intermediate',
    description: 'Isometric core exercise for stability and endurance',
    type: 'hold',
    defaultSets: 3,
    defaultReps: null,
    defaultHoldSeconds: 30,
    landmarksUsed: ['left_shoulder', 'right_shoulder', 'left_hip', 'right_hip', 'left_ankle', 'right_ankle'],
    thresholds: {
      minAlignmentAngle: 160,
      maxAlignmentAngle: 180,
    },
  },
  shoulder_press: {
    id: 'shoulder_press',
    name: 'Shoulder Press',
    targetMuscles: ['Deltoids', 'Triceps', 'Trapezius'],
    difficulty: 'Intermediate',
    description: 'Overhead pressing movement for shoulder development',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 10,
    defaultHoldSeconds: null,
    landmarksUsed: ['left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow', 'left_wrist', 'right_wrist'],
    thresholds: {
      downAngle: 90,
      upAngle: 160,
    },
  },
  jumping_jacks: {
    id: 'jumping_jacks',
    name: 'Jumping Jacks',
    targetMuscles: ['Full Body', 'Cardio'],
    difficulty: 'Beginner',
    description: 'Full body cardio exercise with arm and leg coordination',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 20,
    defaultHoldSeconds: null,
    landmarksUsed: ['left_wrist', 'right_wrist', 'left_ankle', 'right_ankle', 'left_hip', 'right_hip', 'left_shoulder', 'right_shoulder'],
    thresholds: {
      spreadRatio: 1.5,
      closedRatio: 0.5,
    },
  },
  deadlifts: {
    id: 'deadlifts',
    name: 'Deadlifts',
    targetMuscles: ['Back', 'Glutes', 'Hamstrings'],
    difficulty: 'Intermediate',
    description: 'Compound posterior chain exercise for total body strength',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 8,
    defaultHoldSeconds: null,
    landmarksUsed: ['left_shoulder', 'right_shoulder', 'left_hip', 'right_hip', 'left_knee', 'right_knee'],
    thresholds: {
      downAngle: 90,
      upAngle: 160,
    },
  },
};

/**
 * Get the configuration for a specific exercise by id.
 * @param {string} exerciseId - The exercise identifier
 * @returns {Object|null} Exercise configuration or null
 */
function getExerciseConfig(exerciseId) {
  return EXERCISE_CONFIG[exerciseId] || null;
}

/**
 * Get all exercise configurations as an array.
 * @returns {Array} Array of exercise config objects
 */
function getAllExercises() {
  return Object.values(EXERCISE_CONFIG);
}

module.exports = {
  EXERCISE_CONFIG,
  getExerciseConfig,
  getAllExercises,
};

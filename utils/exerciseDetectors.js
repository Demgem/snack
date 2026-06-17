/**
 * Exercise detection state machines for rep counting.
 * Each detector uses a phase-based approach (up/down) to avoid double-counting.
 * Detectors receive landmark data and previous state, returning rep completion status.
 */

import { calculateAngle, calculateDistance, getLandmark } from './poseDetection';

// Phase constants
const PHASE_UP = 'up';
const PHASE_DOWN = 'down';
const PHASE_NEUTRAL = 'neutral';

/**
 * Create initial state for any exercise detector.
 */
function createInitialState() {
  return {
    phase: PHASE_NEUTRAL,
    holdStartTime: null,
    holdSeconds: 0,
    lastAlignedTime: null,
  };
}

/**
 * Squats detector - tracks knee angle (hip-knee-ankle).
 * Rep counts when angle goes below 90 (down) then back above 160 (up).
 */
function detectSquats(landmarks, previousState) {
  const state = previousState || createInitialState();

  const leftHip = getLandmark(landmarks, 'left_hip');
  const leftKnee = getLandmark(landmarks, 'left_knee');
  const leftAnkle = getLandmark(landmarks, 'left_ankle');
  const rightHip = getLandmark(landmarks, 'right_hip');
  const rightKnee = getLandmark(landmarks, 'right_knee');
  const rightAnkle = getLandmark(landmarks, 'right_ankle');

  if (!leftHip || !leftKnee || !leftAnkle || !rightHip || !rightKnee || !rightAnkle) {
    return { repCompleted: false, newState: state, feedback: 'Position your full body in frame' };
  }

  const leftAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  const avgAngle = (leftAngle + rightAngle) / 2;

  let newPhase = state.phase;
  let repCompleted = false;
  let feedback = '';

  if (avgAngle < 90) {
    newPhase = PHASE_DOWN;
    feedback = 'Good depth! Now stand up';
  } else if (avgAngle > 160 && state.phase === PHASE_DOWN) {
    newPhase = PHASE_UP;
    repCompleted = true;
    feedback = 'Rep complete!';
  } else if (avgAngle > 160) {
    newPhase = PHASE_UP;
    feedback = 'Ready - squat down';
  } else if (state.phase === PHASE_DOWN) {
    feedback = 'Go lower';
  } else {
    feedback = 'Squat down';
  }

  return {
    repCompleted,
    newState: { ...state, phase: newPhase },
    feedback,
  };
}

/**
 * Push-ups detector - tracks elbow angle (shoulder-elbow-wrist).
 * Rep counts when angle goes below 90 (down) then back above 160 (up).
 */
function detectPushUps(landmarks, previousState) {
  const state = previousState || createInitialState();

  const leftShoulder = getLandmark(landmarks, 'left_shoulder');
  const leftElbow = getLandmark(landmarks, 'left_elbow');
  const leftWrist = getLandmark(landmarks, 'left_wrist');
  const rightShoulder = getLandmark(landmarks, 'right_shoulder');
  const rightElbow = getLandmark(landmarks, 'right_elbow');
  const rightWrist = getLandmark(landmarks, 'right_wrist');

  if (!leftShoulder || !leftElbow || !leftWrist || !rightShoulder || !rightElbow || !rightWrist) {
    return { repCompleted: false, newState: state, feedback: 'Position your upper body in frame' };
  }

  const leftAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
  const avgAngle = (leftAngle + rightAngle) / 2;

  let newPhase = state.phase;
  let repCompleted = false;
  let feedback = '';

  if (avgAngle < 90) {
    newPhase = PHASE_DOWN;
    feedback = 'Good! Now push up';
  } else if (avgAngle > 160 && state.phase === PHASE_DOWN) {
    newPhase = PHASE_UP;
    repCompleted = true;
    feedback = 'Rep complete!';
  } else if (avgAngle > 160) {
    newPhase = PHASE_UP;
    feedback = 'Ready - lower your body';
  } else if (state.phase === PHASE_DOWN) {
    feedback = 'Push up to full extension';
  } else {
    feedback = 'Lower your body';
  }

  return {
    repCompleted,
    newState: { ...state, phase: newPhase },
    feedback,
  };
}

/**
 * Lunges detector - tracks front knee angle (hip-knee-ankle).
 * Rep counts when angle dips below 100 then returns above 150.
 */
function detectLunges(landmarks, previousState) {
  const state = previousState || createInitialState();

  const leftHip = getLandmark(landmarks, 'left_hip');
  const leftKnee = getLandmark(landmarks, 'left_knee');
  const leftAnkle = getLandmark(landmarks, 'left_ankle');
  const rightHip = getLandmark(landmarks, 'right_hip');
  const rightKnee = getLandmark(landmarks, 'right_knee');
  const rightAnkle = getLandmark(landmarks, 'right_ankle');

  if (!leftHip || !leftKnee || !leftAnkle || !rightHip || !rightKnee || !rightAnkle) {
    return { repCompleted: false, newState: state, feedback: 'Position your full body in frame' };
  }

  // Use the knee with the smaller angle as the front knee
  const leftAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  const frontKneeAngle = Math.min(leftAngle, rightAngle);

  let newPhase = state.phase;
  let repCompleted = false;
  let feedback = '';

  if (frontKneeAngle < 100) {
    newPhase = PHASE_DOWN;
    feedback = 'Good lunge! Now stand up';
  } else if (frontKneeAngle > 150 && state.phase === PHASE_DOWN) {
    newPhase = PHASE_UP;
    repCompleted = true;
    feedback = 'Rep complete!';
  } else if (frontKneeAngle > 150) {
    newPhase = PHASE_UP;
    feedback = 'Ready - step forward and lunge';
  } else if (state.phase === PHASE_DOWN) {
    feedback = 'Stand back up';
  } else {
    feedback = 'Lunge deeper';
  }

  return {
    repCompleted,
    newState: { ...state, phase: newPhase },
    feedback,
  };
}

/**
 * Bicep curls detector - tracks elbow angle (shoulder-elbow-wrist).
 * Rep counts when angle goes below 50 (curled) then back above 140 (extended).
 */
function detectBicepCurls(landmarks, previousState) {
  const state = previousState || createInitialState();

  const leftShoulder = getLandmark(landmarks, 'left_shoulder');
  const leftElbow = getLandmark(landmarks, 'left_elbow');
  const leftWrist = getLandmark(landmarks, 'left_wrist');
  const rightShoulder = getLandmark(landmarks, 'right_shoulder');
  const rightElbow = getLandmark(landmarks, 'right_elbow');
  const rightWrist = getLandmark(landmarks, 'right_wrist');

  if (!leftShoulder || !leftElbow || !leftWrist || !rightShoulder || !rightElbow || !rightWrist) {
    return { repCompleted: false, newState: state, feedback: 'Position your arms in frame' };
  }

  const leftAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
  const avgAngle = (leftAngle + rightAngle) / 2;

  let newPhase = state.phase;
  let repCompleted = false;
  let feedback = '';

  if (avgAngle < 50) {
    newPhase = PHASE_DOWN;
    feedback = 'Good curl! Now lower slowly';
  } else if (avgAngle > 140 && state.phase === PHASE_DOWN) {
    newPhase = PHASE_UP;
    repCompleted = true;
    feedback = 'Rep complete!';
  } else if (avgAngle > 140) {
    newPhase = PHASE_UP;
    feedback = 'Ready - curl up';
  } else if (state.phase === PHASE_DOWN) {
    feedback = 'Lower your arms';
  } else {
    feedback = 'Curl up higher';
  }

  return {
    repCompleted,
    newState: { ...state, phase: newPhase },
    feedback,
  };
}

/**
 * Plank hold detector - tracks body alignment (shoulder-hip-ankle angle near 180).
 * Counts seconds held rather than reps.
 * Includes a 500ms grace period so brief landmark dropout does not reset the timer.
 */
function detectPlankHold(landmarks, previousState) {
  const state = previousState || createInitialState();
  const now = Date.now();

  const GRACE_PERIOD_MS = 500;

  const leftShoulder = getLandmark(landmarks, 'left_shoulder');
  const leftHip = getLandmark(landmarks, 'left_hip');
  const leftAnkle = getLandmark(landmarks, 'left_ankle');
  const rightShoulder = getLandmark(landmarks, 'right_shoulder');
  const rightHip = getLandmark(landmarks, 'right_hip');
  const rightAnkle = getLandmark(landmarks, 'right_ankle');

  if (!leftShoulder || !leftHip || !leftAnkle || !rightShoulder || !rightHip || !rightAnkle) {
    // Grace period: if we had an active hold, don't reset immediately
    if (state.holdStartTime && state.lastAlignedTime) {
      const elapsed = now - state.lastAlignedTime;
      if (elapsed < GRACE_PERIOD_MS) {
        // Within grace period, maintain state but don't count additional time
        return {
          repCompleted: false,
          newState: state,
          feedback: 'Hold steady - tracking...',
        };
      }
    }
    return { repCompleted: false, newState: { ...state, holdStartTime: null, lastAlignedTime: null }, feedback: 'Position your full body in frame' };
  }

  const leftAngle = calculateAngle(leftShoulder, leftHip, leftAnkle);
  const rightAngle = calculateAngle(rightShoulder, rightHip, rightAnkle);
  const avgAngle = (leftAngle + rightAngle) / 2;

  const isAligned = avgAngle >= 160 && avgAngle <= 180;

  let holdStartTime = state.holdStartTime;
  let holdSeconds = state.holdSeconds;
  let lastAlignedTime = state.lastAlignedTime;
  let repCompleted = false;
  let feedback = '';

  if (isAligned) {
    lastAlignedTime = now;
    if (!holdStartTime) {
      holdStartTime = now;
    }
    holdSeconds = Math.floor((now - holdStartTime) / 1000);
    feedback = 'Good form! Hold: ' + holdSeconds + 's';
    // Count a "rep" for each second held
    if (holdSeconds > state.holdSeconds) {
      repCompleted = true;
    }
  } else {
    // Check grace period before resetting
    if (holdStartTime && lastAlignedTime) {
      const elapsed = now - lastAlignedTime;
      if (elapsed < GRACE_PERIOD_MS) {
        // Within grace period, maintain hold state
        feedback = 'Adjust form - hold steady';
        return {
          repCompleted: false,
          newState: { ...state, holdStartTime, holdSeconds, lastAlignedTime },
          feedback,
        };
      }
    }
    if (holdStartTime) {
      feedback = 'Form lost - straighten your body';
    } else {
      feedback = 'Get into plank position';
    }
    holdStartTime = null;
    lastAlignedTime = null;
  }

  return {
    repCompleted,
    newState: { ...state, holdStartTime, holdSeconds, lastAlignedTime },
    feedback,
  };
}

/**
 * Shoulder press detector - tracks elbow angle with wrists above shoulders.
 * Rep counts when arms extend above head then return.
 */
function detectShoulderPress(landmarks, previousState) {
  const state = previousState || createInitialState();

  const leftShoulder = getLandmark(landmarks, 'left_shoulder');
  const leftElbow = getLandmark(landmarks, 'left_elbow');
  const leftWrist = getLandmark(landmarks, 'left_wrist');
  const rightShoulder = getLandmark(landmarks, 'right_shoulder');
  const rightElbow = getLandmark(landmarks, 'right_elbow');
  const rightWrist = getLandmark(landmarks, 'right_wrist');

  if (!leftShoulder || !leftElbow || !leftWrist || !rightShoulder || !rightElbow || !rightWrist) {
    return { repCompleted: false, newState: state, feedback: 'Position your upper body in frame' };
  }

  const leftAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
  const avgAngle = (leftAngle + rightAngle) / 2;

  // Check if wrists are above shoulders (y axis is inverted in screen coords)
  const wristsAbove = leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;

  let newPhase = state.phase;
  let repCompleted = false;
  let feedback = '';

  if (avgAngle > 160 && wristsAbove) {
    if (state.phase === PHASE_DOWN) {
      repCompleted = true;
      feedback = 'Rep complete!';
    } else {
      feedback = 'Arms extended - lower slowly';
    }
    newPhase = PHASE_UP;
  } else if (avgAngle < 90) {
    newPhase = PHASE_DOWN;
    feedback = 'Good - now press up';
  } else if (state.phase === PHASE_UP) {
    feedback = 'Lower to shoulder level';
  } else {
    feedback = 'Press arms overhead';
  }

  return {
    repCompleted,
    newState: { ...state, phase: newPhase },
    feedback,
  };
}

/**
 * Jumping jacks detector - tracks spread of limbs.
 * Rep counts when limbs spread wide then return close together.
 */
function detectJumpingJacks(landmarks, previousState) {
  const state = previousState || createInitialState();

  const leftWrist = getLandmark(landmarks, 'left_wrist');
  const rightWrist = getLandmark(landmarks, 'right_wrist');
  const leftAnkle = getLandmark(landmarks, 'left_ankle');
  const rightAnkle = getLandmark(landmarks, 'right_ankle');
  const leftHip = getLandmark(landmarks, 'left_hip');
  const rightHip = getLandmark(landmarks, 'right_hip');
  const leftShoulder = getLandmark(landmarks, 'left_shoulder');
  const rightShoulder = getLandmark(landmarks, 'right_shoulder');

  if (!leftWrist || !rightWrist || !leftAnkle || !rightAnkle || !leftHip || !rightHip || !leftShoulder || !rightShoulder) {
    return { repCompleted: false, newState: state, feedback: 'Position your full body in frame' };
  }

  // Calculate spread ratios relative to shoulder width
  const shoulderWidth = calculateDistance(leftShoulder, rightShoulder);
  const ankleSpread = calculateDistance(leftAnkle, rightAnkle);
  const wristSpread = calculateDistance(leftWrist, rightWrist);

  const ankleRatio = ankleSpread / shoulderWidth;
  const wristRatio = wristSpread / shoulderWidth;

  // Check if arms are above shoulders (spread position)
  const armsUp = leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;

  const isSpread = ankleRatio > 1.5 && (wristRatio > 2.0 || armsUp);
  const isClosed = ankleRatio < 0.8 && wristRatio < 1.5;

  let newPhase = state.phase;
  let repCompleted = false;
  let feedback = '';

  if (isSpread) {
    newPhase = PHASE_DOWN;
    feedback = 'Spread! Now close';
  } else if (isClosed && state.phase === PHASE_DOWN) {
    newPhase = PHASE_UP;
    repCompleted = true;
    feedback = 'Rep complete!';
  } else if (isClosed) {
    newPhase = PHASE_UP;
    feedback = 'Ready - jump and spread';
  } else {
    feedback = 'Jump!';
  }

  return {
    repCompleted,
    newState: { ...state, phase: newPhase },
    feedback,
  };
}

/**
 * Deadlifts detector - tracks hip angle (shoulder-hip-knee).
 * Rep counts when torso goes from upright to forward lean and back.
 */
function detectDeadlifts(landmarks, previousState) {
  const state = previousState || createInitialState();

  const leftShoulder = getLandmark(landmarks, 'left_shoulder');
  const leftHip = getLandmark(landmarks, 'left_hip');
  const leftKnee = getLandmark(landmarks, 'left_knee');
  const rightShoulder = getLandmark(landmarks, 'right_shoulder');
  const rightHip = getLandmark(landmarks, 'right_hip');
  const rightKnee = getLandmark(landmarks, 'right_knee');

  if (!leftShoulder || !leftHip || !leftKnee || !rightShoulder || !rightHip || !rightKnee) {
    return { repCompleted: false, newState: state, feedback: 'Position your full body in frame' };
  }

  const leftAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
  const rightAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
  const avgAngle = (leftAngle + rightAngle) / 2;

  let newPhase = state.phase;
  let repCompleted = false;
  let feedback = '';

  if (avgAngle < 90) {
    newPhase = PHASE_DOWN;
    feedback = 'Good hinge! Now stand up';
  } else if (avgAngle > 160 && state.phase === PHASE_DOWN) {
    newPhase = PHASE_UP;
    repCompleted = true;
    feedback = 'Rep complete!';
  } else if (avgAngle > 160) {
    newPhase = PHASE_UP;
    feedback = 'Ready - hinge at hips';
  } else if (state.phase === PHASE_DOWN) {
    feedback = 'Drive hips forward';
  } else {
    feedback = 'Hinge forward more';
  }

  return {
    repCompleted,
    newState: { ...state, phase: newPhase },
    feedback,
  };
}

/**
 * Map of exercise IDs to their detector functions.
 */
export const EXERCISE_DETECTORS = {
  squats: detectSquats,
  push_ups: detectPushUps,
  lunges: detectLunges,
  bicep_curls: detectBicepCurls,
  plank_hold: detectPlankHold,
  shoulder_press: detectShoulderPress,
  jumping_jacks: detectJumpingJacks,
  deadlifts: detectDeadlifts,
};

/**
 * Get the detector function for a specific exercise.
 * @param {string} exerciseId - The exercise identifier
 * @returns {Function|null} The detector function or null
 */
export function getDetector(exerciseId) {
  return EXERCISE_DETECTORS[exerciseId] || null;
}

export {
  createInitialState,
  detectSquats,
  detectPushUps,
  detectLunges,
  detectBicepCurls,
  detectPlankHold,
  detectShoulderPress,
  detectJumpingJacks,
  detectDeadlifts,
};

/**
 * Core pose detection utilities.
 * Provides landmark index mapping and geometric calculation helpers
 * for joint angle and distance computation.
 */

// MediaPipe Pose landmark indices mapped to body part names
export const POSE_LANDMARKS = {
  nose: 0,
  left_eye_inner: 1,
  left_eye: 2,
  left_eye_outer: 3,
  right_eye_inner: 4,
  right_eye: 5,
  right_eye_outer: 6,
  left_ear: 7,
  right_ear: 8,
  mouth_left: 9,
  mouth_right: 10,
  left_shoulder: 11,
  right_shoulder: 12,
  left_elbow: 13,
  right_elbow: 14,
  left_wrist: 15,
  right_wrist: 16,
  left_pinky: 17,
  right_pinky: 18,
  left_index: 19,
  right_index: 20,
  left_thumb: 21,
  right_thumb: 22,
  left_hip: 23,
  right_hip: 24,
  left_knee: 25,
  right_knee: 26,
  left_ankle: 27,
  right_ankle: 28,
  left_heel: 29,
  right_heel: 30,
  left_foot_index: 31,
  right_foot_index: 32,
};

/**
 * Calculate the angle at point B formed by points A, B, and C.
 * Uses Math.atan2 for reliable angle computation in degrees.
 *
 * @param {Object} pointA - {x, y} coordinate of point A
 * @param {Object} pointB - {x, y} coordinate of point B (vertex)
 * @param {Object} pointC - {x, y} coordinate of point C
 * @returns {number} Angle in degrees at point B (0-180)
 */
export function calculateAngle(pointA, pointB, pointC) {
  const radians =
    Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
    Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);

  let angle = Math.abs((radians * 180) / Math.PI);

  if (angle > 180) {
    angle = 360 - angle;
  }

  return angle;
}

/**
 * Calculate the Euclidean distance between two points.
 *
 * @param {Object} pointA - {x, y} coordinate of point A
 * @param {Object} pointB - {x, y} coordinate of point B
 * @returns {number} Distance between the two points
 */
export function calculateDistance(pointA, pointB) {
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Get a specific landmark from the landmarks array by name.
 *
 * @param {Array} landmarks - Array of landmark objects with x, y, z
 * @param {string} name - Name of the landmark from POSE_LANDMARKS
 * @returns {Object|null} The landmark {x, y, z} or null if not found
 */
export function getLandmark(landmarks, name) {
  const index = POSE_LANDMARKS[name];
  if (index === undefined || !landmarks || !landmarks[index]) {
    return null;
  }
  return landmarks[index];
}

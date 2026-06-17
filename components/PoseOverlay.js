/**
 * PoseOverlay component - renders SVG-like skeleton visualization
 * over the camera preview using React Native Views.
 * Draws circles at landmarks and lines connecting joints.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

// Skeleton connections (pairs of landmark indices to draw lines between)
const SKELETON_CONNECTIONS = [
  // Torso
  [11, 12], // left_shoulder - right_shoulder
  [11, 23], // left_shoulder - left_hip
  [12, 24], // right_shoulder - right_hip
  [23, 24], // left_hip - right_hip
  // Left arm
  [11, 13], // left_shoulder - left_elbow
  [13, 15], // left_elbow - left_wrist
  // Right arm
  [12, 14], // right_shoulder - right_elbow
  [14, 16], // right_elbow - right_wrist
  // Left leg
  [23, 25], // left_hip - left_knee
  [25, 27], // left_knee - left_ankle
  // Right leg
  [24, 26], // right_hip - right_knee
  [26, 28], // right_knee - right_ankle
];

// Landmark indices that are commonly tracked
const VISIBLE_LANDMARKS = [
  0,  // nose
  11, 12, // shoulders
  13, 14, // elbows
  15, 16, // wrists
  23, 24, // hips
  25, 26, // knees
  27, 28, // ankles
];

/**
 * PoseOverlay renders a stick-figure skeleton on top of the camera feed.
 *
 * @param {Object} props
 * @param {Array} props.landmarks - Array of {x, y, z, visibility} landmark objects (normalized 0-1)
 * @param {number} props.width - Container width in pixels
 * @param {number} props.height - Container height in pixels
 * @param {Array} props.activeLandmarks - Array of landmark names currently relevant to the exercise
 * @param {boolean} props.isCorrectForm - Whether the user has correct form (highlights in green)
 */
export default function PoseOverlay({ landmarks, width, height, activeLandmarks, isCorrectForm }) {
  if (!landmarks || landmarks.length === 0 || !width || !height) {
    return null;
  }

  const activeColor = isCorrectForm ? '#4CAF50' : '#FF9800';
  const defaultColor = 'rgba(255, 255, 255, 0.6)';

  // Convert active landmark names to indices for comparison
  const LANDMARK_NAME_TO_INDEX = {
    nose: 0,
    left_shoulder: 11,
    right_shoulder: 12,
    left_elbow: 13,
    right_elbow: 14,
    left_wrist: 15,
    right_wrist: 16,
    left_hip: 23,
    right_hip: 24,
    left_knee: 25,
    right_knee: 26,
    left_ankle: 27,
    right_ankle: 28,
  };

  const activeIndices = (activeLandmarks || []).map(function (name) {
    return LANDMARK_NAME_TO_INDEX[name];
  }).filter(function (idx) {
    return idx !== undefined;
  });

  const isActiveLandmark = function (index) {
    return activeIndices.indexOf(index) !== -1;
  };

  const isActiveConnection = function (startIdx, endIdx) {
    return isActiveLandmark(startIdx) && isActiveLandmark(endIdx);
  };

  // Render landmark dots
  const renderLandmarks = function () {
    return VISIBLE_LANDMARKS.map(function (index) {
      const landmark = landmarks[index];
      if (!landmark || (landmark.visibility !== undefined && landmark.visibility < 0.5)) {
        return null;
      }

      const x = landmark.x * width;
      const y = landmark.y * height;
      const isActive = isActiveLandmark(index);
      const color = isActive ? activeColor : defaultColor;
      const size = isActive ? 10 : 6;

      return (
        <View
          key={'landmark-' + index}
          style={[
            styles.landmark,
            {
              left: x - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
            },
          ]}
        />
      );
    });
  };

  // Render skeleton connection lines
  const renderConnections = function () {
    return SKELETON_CONNECTIONS.map(function (connection, idx) {
      const startIdx = connection[0];
      const endIdx = connection[1];
      const start = landmarks[startIdx];
      const end = landmarks[endIdx];

      if (!start || !end || (start.visibility !== undefined && start.visibility < 0.5) || (end.visibility !== undefined && end.visibility < 0.5)) {
        return null;
      }

      const x1 = start.x * width;
      const y1 = start.y * height;
      const x2 = end.x * width;
      const y2 = end.y * height;

      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      const isActive = isActiveConnection(startIdx, endIdx);
      const color = isActive ? activeColor : defaultColor;

      return (
        <View
          key={'connection-' + idx}
          style={[
            styles.connection,
            {
              left: x1,
              top: y1,
              width: length,
              backgroundColor: color,
              transform: [{ rotate: angle + 'deg' }],
              transformOrigin: 'left center',
            },
          ]}
        />
      );
    });
  };

  return (
    <View style={[styles.container, { width: width, height: height }]} pointerEvents="none">
      {renderConnections()}
      {renderLandmarks()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  landmark: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  connection: {
    position: 'absolute',
    height: 3,
    borderRadius: 1.5,
  },
});

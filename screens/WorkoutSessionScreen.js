import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import PoseOverlay from '../components/PoseOverlay';
import { getDetector, createInitialState } from '../utils/exerciseDetectors';
import { getExerciseConfig } from '../utils/exerciseConfig';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Simulated pose landmark generation for demo purposes.
// Since MediaPipe cannot run on Snack, we simulate realistic landmark
// movement patterns that drive the exercise detectors and show the UI.

/**
 * Generate a base standing pose with all 33 landmarks.
 * Coordinates are normalized (0-1) matching MediaPipe format.
 */
function generateBasePose() {
  const landmarks = new Array(33).fill(null);

  // Head
  landmarks[0] = { x: 0.5, y: 0.15, z: 0, visibility: 0.9 }; // nose

  // Shoulders
  landmarks[11] = { x: 0.42, y: 0.28, z: 0, visibility: 0.9 }; // left_shoulder
  landmarks[12] = { x: 0.58, y: 0.28, z: 0, visibility: 0.9 }; // right_shoulder

  // Elbows
  landmarks[13] = { x: 0.38, y: 0.40, z: 0, visibility: 0.9 }; // left_elbow
  landmarks[14] = { x: 0.62, y: 0.40, z: 0, visibility: 0.9 }; // right_elbow

  // Wrists
  landmarks[15] = { x: 0.36, y: 0.52, z: 0, visibility: 0.9 }; // left_wrist
  landmarks[16] = { x: 0.64, y: 0.52, z: 0, visibility: 0.9 }; // right_wrist

  // Hips
  landmarks[23] = { x: 0.44, y: 0.52, z: 0, visibility: 0.9 }; // left_hip
  landmarks[24] = { x: 0.56, y: 0.52, z: 0, visibility: 0.9 }; // right_hip

  // Knees
  landmarks[25] = { x: 0.44, y: 0.70, z: 0, visibility: 0.9 }; // left_knee
  landmarks[26] = { x: 0.56, y: 0.70, z: 0, visibility: 0.9 }; // right_knee

  // Ankles
  landmarks[27] = { x: 0.44, y: 0.88, z: 0, visibility: 0.9 }; // left_ankle
  landmarks[28] = { x: 0.56, y: 0.88, z: 0, visibility: 0.9 }; // right_ankle

  return landmarks;
}

/**
 * Animate landmarks for a squat motion cycle.
 * Progress goes 0 -> 1 (down) then 1 -> 0 (up).
 */
function animateSquat(basePose, progress) {
  const landmarks = basePose.map(function (lm) {
    return lm ? { ...lm } : null;
  });

  // Move hips down and knees bend outward
  const hipDrop = progress * 0.15;
  const kneeBend = progress * 0.08;

  if (landmarks[23]) landmarks[23] = { ...landmarks[23], y: 0.52 + hipDrop };
  if (landmarks[24]) landmarks[24] = { ...landmarks[24], y: 0.52 + hipDrop };
  if (landmarks[25]) landmarks[25] = { ...landmarks[25], x: 0.40 - kneeBend, y: 0.70 + hipDrop * 0.3 };
  if (landmarks[26]) landmarks[26] = { ...landmarks[26], x: 0.60 + kneeBend, y: 0.70 + hipDrop * 0.3 };

  return landmarks;
}

/**
 * Animate landmarks for a push-up motion cycle.
 */
function animatePushUp(basePose, progress) {
  const landmarks = basePose.map(function (lm) {
    return lm ? { ...lm } : null;
  });

  // Arms bend - elbows go out, wrists stay in place, body lowers
  const elbowBend = progress * 0.10;
  const bodyDrop = progress * 0.05;

  if (landmarks[13]) landmarks[13] = { ...landmarks[13], x: 0.34, y: 0.40 + elbowBend };
  if (landmarks[14]) landmarks[14] = { ...landmarks[14], x: 0.66, y: 0.40 + elbowBend };
  if (landmarks[11]) landmarks[11] = { ...landmarks[11], y: 0.28 + bodyDrop };
  if (landmarks[12]) landmarks[12] = { ...landmarks[12], y: 0.28 + bodyDrop };

  return landmarks;
}

/**
 * Animate landmarks for a bicep curl motion cycle.
 */
function animateBicepCurl(basePose, progress) {
  const landmarks = basePose.map(function (lm) {
    return lm ? { ...lm } : null;
  });

  // Wrists curl up towards shoulders
  const curlAmount = progress * 0.25;

  if (landmarks[15]) landmarks[15] = { ...landmarks[15], y: 0.52 - curlAmount };
  if (landmarks[16]) landmarks[16] = { ...landmarks[16], y: 0.52 - curlAmount };

  return landmarks;
}

/**
 * Animate landmarks for a generic exercise (lunges, deadlifts, etc.)
 */
function animateGeneric(basePose, progress) {
  const landmarks = basePose.map(function (lm) {
    return lm ? { ...lm } : null;
  });

  const movement = progress * 0.12;

  if (landmarks[23]) landmarks[23] = { ...landmarks[23], y: 0.52 + movement };
  if (landmarks[24]) landmarks[24] = { ...landmarks[24], y: 0.52 + movement };
  if (landmarks[25]) landmarks[25] = { ...landmarks[25], y: 0.70 + movement * 0.5 };
  if (landmarks[26]) landmarks[26] = { ...landmarks[26], y: 0.70 + movement * 0.5 };

  return landmarks;
}

/**
 * Get the animation function for a given exercise.
 */
function getAnimator(exerciseId) {
  switch (exerciseId) {
    case 'squats':
    case 'lunges':
      return animateSquat;
    case 'push_ups':
      return animatePushUp;
    case 'bicep_curls':
    case 'shoulder_press':
      return animateBicepCurl;
    default:
      return animateGeneric;
  }
}

export default function WorkoutSessionScreen({ navigation, route }) {
  const { exercise } = route.params;
  const [reps, setReps] = useState(0);
  const [sets, setSets] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [setsData, setSetsData] = useState([]);
  const [feedback, setFeedback] = useState('Get ready - Tap Start to begin simulation');
  const [landmarks, setLandmarks] = useState(null);
  const [exerciseState, setExerciseState] = useState(createInitialState());
  const [permission, requestPermission] = useCameraPermissions();
  const [simulationPhase, setSimulationPhase] = useState(0); // 0-1 progress
  const [simulationDirection, setSimulationDirection] = useState(1); // 1=down, -1=up
  const timerRef = useRef(null);
  const simulationRef = useRef(null);
  const exerciseStateRef = useRef(exerciseState);

  // Get exercise config for active landmarks info
  const exerciseConfig = getExerciseConfig(exercise.id);
  const detector = getDetector(exercise.id);
  const animator = getAnimator(exercise.id);

  // Keep ref in sync with state for use in simulation
  useEffect(function () {
    exerciseStateRef.current = exerciseState;
  }, [exerciseState]);

  // Request camera permission on mount
  useEffect(function () {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // Back-navigation guard: confirm before leaving with unsaved data
  useEffect(function () {
    const unsubscribe = navigation.addListener('beforeRemove', function (e) {
      if (reps === 0 && setsData.length === 0) {
        return;
      }

      e.preventDefault();

      Alert.alert(
        'Discard Workout?',
        'You have unsaved workout data. Are you sure you want to leave? Your progress will be lost.',
        [
          { text: 'Stay', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: function () {
              navigation.dispatch(e.data.action);
            },
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, reps, setsData]);

  // Pose simulation loop - generates animated landmarks and runs them through the detector
  useEffect(function () {
    if (!isActive) {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
        simulationRef.current = null;
      }
      return;
    }

    const basePose = generateBasePose();
    let phase = 0;
    let direction = 1;
    const speed = 0.04; // Controls how fast the simulation cycles

    simulationRef.current = setInterval(function () {
      phase += speed * direction;

      // Reverse direction at extremes
      if (phase >= 1) {
        phase = 1;
        direction = -1;
      } else if (phase <= 0) {
        phase = 0;
        direction = 1;
      }

      // Generate animated landmarks
      const animatedLandmarks = animator(basePose, phase);
      setLandmarks(animatedLandmarks);

      // Run through the exercise detector
      if (detector) {
        const result = detector(animatedLandmarks, exerciseStateRef.current);

        if (result.feedback) {
          setFeedback(result.feedback);
        }

        setExerciseState(result.newState);

        if (result.repCompleted) {
          setReps(function (prev) { return prev + 1; });
        }
      }
    }, 100);

    return function () {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
        simulationRef.current = null;
      }
    };
  }, [isActive, detector, animator]);

  // Timer
  useEffect(function () {
    return function () {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = function (seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return (
      String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0')
    );
  };

  const handleStart = function () {
    setIsActive(true);
    setExerciseState(createInitialState());
    timerRef.current = setInterval(function () {
      setElapsedTime(function (prev) { return prev + 1; });
    }, 1000);
  };

  const handlePause = function () {
    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleFinishSet = function () {
    handlePause();
    const setData = {
      setNumber: sets,
      reps: reps,
      duration: elapsedTime,
    };
    const updatedSetsData = [...setsData, setData];
    setSetsData(updatedSetsData);
    setSets(sets + 1);
    setReps(0);
    setElapsedTime(0);
    setExerciseState(createInitialState());
    setFeedback('Ready for next set');
  };

  const handleFinishWorkout = function () {
    handlePause();
    const finalSetsData =
      reps > 0
        ? [...setsData, { setNumber: sets, reps: reps, duration: elapsedTime }]
        : setsData;

    navigation.navigate('WorkoutSummary', {
      exercise,
      setsData: finalSetsData,
      totalDuration: finalSetsData.reduce(function (sum, s) { return sum + s.duration; }, 0),
    });
  };

  const renderCamera = function () {
    if (!permission || !permission.granted) {
      return (
        <View style={styles.cameraPlaceholder}>
          <Ionicons name="camera-outline" size={64} color="rgba(255,255,255,0.5)" />
          <Text style={styles.cameraPlaceholderText}>
            Camera permission required
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <Text style={styles.cameraSubText}>
            Pose detection is simulated for demo purposes
          </Text>
        </View>
      );
    }

    return (
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="front"
      />
    );
  };

  const isCorrectForm = feedback && (
    feedback.indexOf('complete') !== -1 ||
    feedback.indexOf('Good') !== -1 ||
    feedback.indexOf('Ready') !== -1
  );

  return (
    <View style={styles.container}>
      {/* Camera Preview */}
      <View style={styles.cameraContainer}>
        {renderCamera()}

        {/* Pose Skeleton Overlay */}
        {landmarks && (
          <PoseOverlay
            landmarks={landmarks}
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT}
            activeLandmarks={exerciseConfig ? exerciseConfig.landmarksUsed : []}
            isCorrectForm={isCorrectForm}
          />
        )}

        {/* Simulation indicator */}
        <View style={styles.simBadge}>
          <Ionicons name="analytics-outline" size={12} color="#fff" />
          <Text style={styles.simBadgeText}>Simulated Pose Detection</Text>
        </View>

        {/* Exercise Info Overlay - Top */}
        <View style={styles.topOverlay}>
          <View style={styles.exerciseInfoBar}>
            <Text style={styles.exerciseNameOverlay}>{exercise.name}</Text>
            <View style={styles.timerBadge}>
              <Ionicons name="time-outline" size={14} color="#fff" />
              <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
            </View>
          </View>
          {/* Real-time feedback */}
          <View style={styles.feedbackContainer}>
            <Text style={[
              styles.feedbackText,
              isCorrectForm && styles.feedbackTextGood,
            ]}>
              {feedback}
            </Text>
          </View>
        </View>

        {/* Rep Counter Overlay - Center */}
        <View style={styles.centerOverlay}>
          <View style={styles.repCounterContainer}>
            <Text style={styles.repLabel}>
              {exerciseConfig && exerciseConfig.type === 'hold' ? 'SECONDS' : 'REPS'}
            </Text>
            <Text style={styles.repCount}>{reps}</Text>
            <Text style={styles.setLabel}>Set {sets}</Text>
          </View>
        </View>

        {/* Controls Overlay - Bottom */}
        <View style={styles.bottomOverlay}>
          <View style={styles.controlsContainer}>
            {!isActive ? (
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStart}
              >
                <Ionicons name="play" size={28} color="#fff" />
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.pauseButton}
                onPress={handlePause}
              >
                <Ionicons name="pause" size={28} color="#fff" />
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.finishSetButton}
              onPress={handleFinishSet}
            >
              <Ionicons name="checkmark-circle" size={28} color="#fff" />
              <Text style={styles.buttonText}>Next Set</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.endButton}
              onPress={handleFinishWorkout}
            >
              <Ionicons name="stop-circle" size={28} color="#fff" />
              <Text style={styles.buttonText}>Finish</Text>
            </TouchableOpacity>
          </View>

          {/* Sets Summary */}
          {setsData.length > 0 && (
            <View style={styles.setsHistory}>
              {setsData.map(function (setItem, index) {
                return (
                  <View key={index} style={styles.setHistoryItem}>
                    <Text style={styles.setHistoryText}>
                      Set {setItem.setNumber}: {setItem.reps} reps
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPlaceholderText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 18,
    marginTop: 12,
  },
  cameraSubText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 13,
    marginTop: 8,
  },
  permissionButton: {
    marginTop: 16,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  simBadge: {
    position: 'absolute',
    top: 40,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(156, 39, 176, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  simBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  exerciseInfoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  exerciseNameOverlay: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76,175,80,0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  timerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  feedbackContainer: {
    marginTop: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },
  feedbackText: {
    color: '#FF9800',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  feedbackTextGood: {
    color: '#4CAF50',
  },
  centerOverlay: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  repCounterContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  repLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
  },
  repCount: {
    color: '#4CAF50',
    fontSize: 64,
    fontWeight: 'bold',
  },
  setLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 4,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  startButton: {
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  pauseButton: {
    alignItems: 'center',
    backgroundColor: '#FF9800',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  finishSetButton: {
    alignItems: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  endButton: {
    alignItems: 'center',
    backgroundColor: '#F44336',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  setsHistory: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'center',
  },
  setHistoryItem: {
    backgroundColor: 'rgba(76,175,80,0.3)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 4,
    marginBottom: 4,
  },
  setHistoryText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
});

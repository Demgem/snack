import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { usePoseDetection } from 'react-native-mediapipe';
import PoseOverlay from '../components/PoseOverlay';
import { getDetector, createInitialState } from '../utils/exerciseDetectors';
import { getExerciseConfig } from '../utils/exerciseConfig';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function WorkoutSessionScreen({ navigation, route }) {
  const { exercise } = route.params;
  const [reps, setReps] = useState(0);
  const [sets, setSets] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [setsData, setSetsData] = useState([]);
  const [feedback, setFeedback] = useState('Get ready');
  const [landmarks, setLandmarks] = useState(null);
  const [exerciseState, setExerciseState] = useState(createInitialState());
  const [cameraPermission, setCameraPermission] = useState(null);
  const timerRef = useRef(null);
  const exerciseStateRef = useRef(exerciseState);

  // Camera setup
  const device = useCameraDevice('front');

  // Get exercise config for active landmarks info
  const exerciseConfig = getExerciseConfig(exercise.id);
  const detector = getDetector(exercise.id);

  // Keep ref in sync with state for use in frame processor callback
  useEffect(() => {
    exerciseStateRef.current = exerciseState;
  }, [exerciseState]);

  // Request camera permission on mount
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setCameraPermission(status === 'granted');
    })();
  }, []);

  // Pose detection hook
  const { processFrame } = usePoseDetection({
    onPoseDetected: useCallback(function (pose) {
      if (!pose || !pose.landmarks || pose.landmarks.length === 0) {
        return;
      }
      setLandmarks(pose.landmarks);
    }, []),
  });

  // Frame processor for camera frames
  const frameProcessor = useFrameProcessor(function (frame) {
    'worklet';
    processFrame(frame);
  }, [processFrame]);

  // Process landmarks for rep detection
  useEffect(() => {
    if (!landmarks || !isActive || !detector) {
      return;
    }

    const result = detector(landmarks, exerciseStateRef.current);

    if (result.feedback) {
      setFeedback(result.feedback);
    }

    setExerciseState(result.newState);

    if (result.repCompleted) {
      setReps(function (prev) { return prev + 1; });
    }
  }, [landmarks, isActive, detector]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return (
      String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0')
    );
  };

  const handleStart = () => {
    setIsActive(true);
    setExerciseState(createInitialState());
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  };

  const handlePause = () => {
    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleFinishSet = () => {
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

  const handleFinishWorkout = () => {
    handlePause();
    const finalSetsData =
      reps > 0
        ? [...setsData, { setNumber: sets, reps: reps, duration: elapsedTime }]
        : setsData;

    navigation.navigate('WorkoutSummary', {
      exercise,
      setsData: finalSetsData,
      totalDuration: finalSetsData.reduce((sum, s) => sum + s.duration, 0),
    });
  };

  const renderCamera = () => {
    if (cameraPermission === false) {
      return (
        <View style={styles.cameraPlaceholder}>
          <Ionicons name="camera-outline" size={64} color="rgba(255,255,255,0.5)" />
          <Text style={styles.cameraPlaceholderText}>
            Camera permission denied
          </Text>
          <Text style={styles.cameraSubText}>
            Enable camera access in settings
          </Text>
        </View>
      );
    }

    if (!device) {
      return (
        <View style={styles.cameraPlaceholder}>
          <Ionicons name="camera" size={64} color="rgba(255,255,255,0.5)" />
          <Text style={styles.cameraPlaceholderText}>
            Loading Camera...
          </Text>
        </View>
      );
    }

    return (
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        pixelFormat="yuv"
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
              {setsData.map((setItem, index) => (
                <View key={index} style={styles.setHistoryItem}>
                  <Text style={styles.setHistoryText}>
                    Set {setItem.setNumber}: {setItem.reps} reps
                  </Text>
                </View>
              ))}
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
    marginTop: 4,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
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

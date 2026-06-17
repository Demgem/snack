import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const exercises = [
  {
    id: '1',
    name: 'Squats',
    targetMuscles: 'Quads, Glutes, Hamstrings',
    difficulty: 'Beginner',
    icon: 'body-outline',
    description: 'Lower body compound movement tracking knee and hip angles.',
  },
  {
    id: '2',
    name: 'Push-Ups',
    targetMuscles: 'Chest, Triceps, Shoulders',
    difficulty: 'Beginner',
    icon: 'fitness-outline',
    description: 'Upper body push movement tracking elbow and shoulder angles.',
  },
  {
    id: '3',
    name: 'Lunges',
    targetMuscles: 'Quads, Glutes, Hamstrings',
    difficulty: 'Beginner',
    icon: 'walk-outline',
    description: 'Single-leg movement tracking knee flexion and hip alignment.',
  },
  {
    id: '4',
    name: 'Bicep Curls',
    targetMuscles: 'Biceps, Forearms',
    difficulty: 'Beginner',
    icon: 'barbell-outline',
    description: 'Isolation movement tracking elbow angle through curl motion.',
  },
  {
    id: '5',
    name: 'Plank Hold',
    targetMuscles: 'Core, Shoulders, Back',
    difficulty: 'Intermediate',
    icon: 'timer-outline',
    description: 'Isometric hold tracking body alignment and form stability.',
  },
  {
    id: '6',
    name: 'Shoulder Press',
    targetMuscles: 'Shoulders, Triceps, Upper Back',
    difficulty: 'Intermediate',
    icon: 'arrow-up-outline',
    description: 'Overhead press tracking shoulder and elbow extension.',
  },
  {
    id: '7',
    name: 'Jumping Jacks',
    targetMuscles: 'Full Body, Cardio',
    difficulty: 'Beginner',
    icon: 'flash-outline',
    description: 'Full body cardio tracking arm and leg spread positions.',
  },
  {
    id: '8',
    name: 'Deadlifts',
    targetMuscles: 'Back, Glutes, Hamstrings',
    difficulty: 'Advanced',
    icon: 'trending-up-outline',
    description: 'Hip hinge movement tracking spine angle and hip extension.',
  },
];

function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case 'Beginner':
      return '#4CAF50';
    case 'Intermediate':
      return '#FF9800';
    case 'Advanced':
      return '#F44336';
    default:
      return '#4CAF50';
  }
}

export default function ExerciseListScreen({ navigation }) {
  const handleExercisePress = (exercise) => {
    navigation.navigate('WorkoutSession', { exercise });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>AI-Tracked Exercises</Text>
        <Text style={styles.headerSubtitle}>
          Select an exercise to start a tracked workout session
        </Text>
      </View>

      <View style={styles.exerciseList}>
        {exercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={styles.exerciseCard}
            onPress={() => handleExercisePress(exercise)}
          >
            <View style={styles.exerciseIconContainer}>
              <Ionicons name={exercise.icon} size={28} color="#fff" />
            </View>
            <View style={styles.exerciseInfo}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <View style={styles.aiBadge}>
                  <Ionicons name="eye-outline" size={12} color="#4CAF50" />
                  <Text style={styles.aiBadgeText}>AI Tracked</Text>
                </View>
              </View>
              <Text style={styles.exerciseDescription}>
                {exercise.description}
              </Text>
              <View style={styles.exerciseMeta}>
                <Text style={styles.targetMuscles}>
                  {exercise.targetMuscles}
                </Text>
                <View
                  style={[
                    styles.difficultyBadge,
                    {
                      backgroundColor:
                        getDifficultyColor(exercise.difficulty) + '20',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      { color: getDifficultyColor(exercise.difficulty) },
                    ]}
                  >
                    {exercise.difficulty}
                  </Text>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerSection: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  exerciseList: {
    padding: 20,
    paddingTop: 10,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  exerciseIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 15,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  aiBadgeText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 3,
  },
  exerciseDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    justifyContent: 'space-between',
  },
  targetMuscles: {
    fontSize: 11,
    color: '#999',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
});

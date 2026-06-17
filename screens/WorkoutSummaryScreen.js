import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WorkoutSummaryScreen({ navigation, route }) {
  const { exercise, setsData, totalDuration } = route.params;

  const totalReps = setsData.reduce((sum, set) => sum + set.reps, 0);
  const totalSets = setsData.length;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return (
      String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0')
    );
  };

  const handleSaveWorkout = () => {
    // Will integrate with Supabase in a later feature
    navigation.popToTop();
  };

  const handleDiscardWorkout = () => {
    navigation.popToTop();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Success Header */}
      <View style={styles.successHeader}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
        </View>
        <Text style={styles.successTitle}>Workout Complete!</Text>
        <Text style={styles.successSubtitle}>Great job finishing your session</Text>
      </View>

      {/* Exercise Info Card */}
      <View style={styles.exerciseCard}>
        <View style={styles.exerciseCardHeader}>
          <Ionicons name="barbell-outline" size={24} color="#4CAF50" />
          <Text style={styles.exerciseCardName}>{exercise.name}</Text>
        </View>
        <Text style={styles.exerciseCardMuscles}>{exercise.targetMuscles}</Text>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="repeat-outline" size={28} color="#4CAF50" />
          <Text style={styles.statValue}>{totalReps}</Text>
          <Text style={styles.statLabel}>Total Reps</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="layers-outline" size={28} color="#2196F3" />
          <Text style={styles.statValue}>{totalSets}</Text>
          <Text style={styles.statLabel}>Sets</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={28} color="#FF9800" />
          <Text style={styles.statValue}>{formatTime(totalDuration)}</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>
      </View>

      {/* Sets Breakdown */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Sets Breakdown</Text>
        {setsData.map((setItem, index) => (
          <View key={index} style={styles.setRow}>
            <View style={styles.setNumber}>
              <Text style={styles.setNumberText}>{setItem.setNumber}</Text>
            </View>
            <View style={styles.setDetails}>
              <Text style={styles.setReps}>{setItem.reps} reps</Text>
              <Text style={styles.setDuration}>
                {formatTime(setItem.duration)}
              </Text>
            </View>
            <Ionicons name="checkmark" size={20} color="#4CAF50" />
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveWorkout}
        >
          <Ionicons name="cloud-upload-outline" size={22} color="#fff" />
          <Text style={styles.saveButtonText}>Save Workout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.discardButton}
          onPress={handleDiscardWorkout}
        >
          <Text style={styles.discardButtonText}>Discard</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  successHeader: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
  },
  successIcon: {
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  successSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  exerciseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseCardName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  exerciseCardMuscles: {
    fontSize: 13,
    color: '#666',
    marginTop: 6,
    marginLeft: 34,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  setRow: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  setNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  setNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  setDetails: {
    flex: 1,
    marginLeft: 12,
  },
  setReps: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  setDuration: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actionsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  discardButton: {
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  discardButtonText: {
    color: '#999',
    fontSize: 15,
  },
});

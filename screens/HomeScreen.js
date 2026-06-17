import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const statsData = [
  { id: '1', icon: 'footsteps-outline', label: 'Steps', value: '8,432', goal: '10,000' },
  { id: '2', icon: 'flame-outline', label: 'Calories', value: '1,842', goal: '2,200' },
  { id: '3', icon: 'time-outline', label: 'Active Min', value: '45', goal: '60' },
  { id: '4', icon: 'water-outline', label: 'Water (L)', value: '2.1', goal: '3.0' },
];

const workouts = [
  { id: '1', name: 'Morning Run', duration: '30 min', calories: '320', icon: 'walk-outline' },
  { id: '2', name: 'Weight Training', duration: '45 min', calories: '280', icon: 'barbell-outline' },
  { id: '3', name: 'Yoga Session', duration: '25 min', calories: '150', icon: 'body-outline' },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Greeting Section */}
      <View style={styles.greetingSection}>
        <Text style={styles.greetingText}>Good Morning!</Text>
        <Text style={styles.subGreeting}>Let's crush your fitness goals today</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {statsData.map((stat) => (
          <View key={stat.id} style={styles.statCard}>
            <Ionicons name={stat.icon} size={24} color="#4CAF50" />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      (parseFloat(stat.value.replace(',', '')) /
                        parseFloat(stat.goal.replace(',', ''))) *
                        100,
                      100
                    )}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.goalText}>Goal: {stat.goal}</Text>
          </View>
        ))}
      </View>

      {/* Today's Workouts */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Today's Workouts</Text>
        {workouts.map((workout) => (
          <TouchableOpacity key={workout.id} style={styles.workoutCard}>
            <View style={styles.workoutIcon}>
              <Ionicons name={workout.icon} size={28} color="#fff" />
            </View>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutName}>{workout.name}</Text>
              <Text style={styles.workoutDetails}>
                {workout.duration} | {workout.calories} cal
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Weekly Progress */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Weekly Progress</Text>
        <View style={styles.weeklyContainer}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
            (day, index) => (
              <View key={day} style={styles.dayColumn}>
                <View
                  style={[
                    styles.dayBar,
                    {
                      height: [60, 80, 45, 90, 70, 40, 20][index],
                      backgroundColor:
                        index <= 4 ? '#4CAF50' : '#E0E0E0',
                    },
                  ]}
                />
                <Text style={styles.dayLabel}>{day}</Text>
              </View>
            )
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  greetingSection: {
    padding: 20,
    paddingBottom: 10,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  goalText: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  workoutIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutInfo: {
    flex: 1,
    marginLeft: 15,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  workoutDetails: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  weeklyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    height: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayBar: {
    width: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 11,
    color: '#666',
  },
});

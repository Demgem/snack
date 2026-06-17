import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const achievements = [
  { id: '1', icon: 'trophy', label: '7-Day Streak', color: '#FFD700' },
  { id: '2', icon: 'medal', label: '10K Steps', color: '#C0C0C0' },
  { id: '3', icon: 'ribbon', label: 'First Run', color: '#CD7F32' },
  { id: '4', icon: 'star', label: 'Weight Goal', color: '#4CAF50' },
];

const menuItems = [
  { id: '1', icon: 'settings-outline', label: 'Settings' },
  { id: '2', icon: 'notifications-outline', label: 'Notifications' },
  { id: '3', icon: 'heart-outline', label: 'Health Data' },
  { id: '4', icon: 'analytics-outline', label: 'Progress Reports' },
  { id: '5', icon: 'help-circle-outline', label: 'Help & Support' },
];

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color="#fff" />
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>Alex Johnson</Text>
        <Text style={styles.userBio}>Fitness Enthusiast | Runner</Text>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12.5k</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>
      </View>

      {/* Goals Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Goals</Text>
        <View style={styles.goalsContainer}>
          <View style={styles.goalCard}>
            <Ionicons name="scale-outline" size={24} color="#4CAF50" />
            <Text style={styles.goalTitle}>Weight</Text>
            <Text style={styles.goalValue}>75 kg</Text>
            <Text style={styles.goalTarget}>Target: 70 kg</Text>
          </View>
          <View style={styles.goalCard}>
            <Ionicons name="bicycle-outline" size={24} color="#2196F3" />
            <Text style={styles.goalTitle}>Cardio</Text>
            <Text style={styles.goalValue}>3x/week</Text>
            <Text style={styles.goalTarget}>Target: 5x/week</Text>
          </View>
          <View style={styles.goalCard}>
            <Ionicons name="barbell-outline" size={24} color="#FF9800" />
            <Text style={styles.goalTitle}>Strength</Text>
            <Text style={styles.goalValue}>2x/week</Text>
            <Text style={styles.goalTarget}>Target: 4x/week</Text>
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsContainer}>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementBadge}>
              <Ionicons
                name={achievement.icon}
                size={28}
                color={achievement.color}
              />
              <Text style={styles.achievementLabel}>{achievement.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.section}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem}>
            <Ionicons name={item.icon} size={22} color="#666" />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#333',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  userBio: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  goalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  goalTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  goalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  goalTarget: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  achievementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementBadge: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '23%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  achievementLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 6,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  signOutButton: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  signOutText: {
    fontSize: 16,
    color: '#ff4444',
    fontWeight: '600',
  },
});

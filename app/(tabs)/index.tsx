import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  User,
  Settings,
  Bell,
  BookOpen,
} from 'lucide-react-native';
import { 
  Target as TargetIcon, 
  Brain, 
  Heart, 
  Users, 
  Star,
  DollarSign,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import DomainCard from '@/components/DomainCard';
import DailyHardTruth from '@/components/DailyHardTruth';
import QuickHabitTracker from '@/components/QuickHabitTracker';
import FocusMode from '@/components/FocusMode';
import StreakCard from '@/components/StreakCard';
import DailyProgressCard from '@/components/DailyProgressCard';
import WeeklyProgressCard from '@/components/WeeklyProgressCard';
import { userData } from '@/data/mockData';

export default function DashboardScreen() {
  const router = useRouter();
  const [notifications] = useState(3);
  const insets = useSafeAreaInsets();

  const domains = [
    { ...userData.domains[0], icon: TargetIcon },
    { ...userData.domains[1], icon: Brain },
    { ...userData.domains[2], icon: Heart },
    { ...userData.domains[3], icon: Users },
    { ...userData.domains[4], icon: DollarSign },
    { ...userData.domains[5], icon: Star },
  ];

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  const handleNotificationsPress = () => {
    router.push('/notifications');
  };

  const handleStreakPress = () => {
    console.log('Show streak details');
  };

  const handleDailyProgressPress = () => {
    router.push('/(tabs)/quests');
  };

  const handleWeeklyProgressPress = () => {
    router.push('/(tabs)/evolution');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? 88 + insets.bottom + 20 : 68 + insets.bottom + 20
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.avatar}
              onPress={handleProfilePress}
              activeOpacity={0.7}
            >
              <User size={20} color="#FFFFFF" strokeWidth={1.5} />
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userData.profile.name}</Text>
              <Text style={styles.userLevel}>
                Level {userData.profile.level} • {userData.profile.totalXP.toLocaleString()} XP
              </Text>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={handleNotificationsPress}
              activeOpacity={0.7}
            >
              <Bell size={20} color="#A6A6A6" strokeWidth={1.5} />
              {notifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>{notifications}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => router.push('/settings')}
              activeOpacity={0.7}
            >
              <Settings size={20} color="#A6A6A6" strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats - Compact 3 Cards */}
        <View style={styles.statsContainer}>
          <StreakCard onPress={handleStreakPress} />
          <DailyProgressCard onPress={handleDailyProgressPress} />
          <WeeklyProgressCard onPress={handleWeeklyProgressPress} />
        </View>

        {/* Daily Hard Truth */}
        <DailyHardTruth />

        {/* Domains Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Evolution Domains</Text>
        </View>
        
        <View style={styles.domainsGrid}>
          {domains.map((domain) => (
            <View key={domain.id} style={styles.domainCardWrapper}>
              <DomainCard
                domain={domain}
                onPress={(selectedDomain) => {
                  router.push(`/domain/${selectedDomain.id}`);
                }}
              />
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>
        
        <View style={styles.activityContainer}>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <TargetIcon size={16} color="#FF6B6B" strokeWidth={1.5} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Workout Completed</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
            <Text style={styles.activityXP}>+50 XP</Text>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Brain size={16} color="#4DABF7" strokeWidth={1.5} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Meditation Session</Text>
              <Text style={styles.activityTime}>5 hours ago</Text>
            </View>
            <Text style={styles.activityXP}>+40 XP</Text>
          </View>

          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <DollarSign size={16} color="#FFC107" strokeWidth={1.5} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Budget Review</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
            <Text style={styles.activityXP}>+60 XP</Text>
          </View>
        </View>

        {/* Quick Habit Tracker */}
        <QuickHabitTracker />

        {/* Focus Mode - Replaces Quick Actions */}
        <FocusMode />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  userLevel: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  notificationText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 8,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  domainsGrid: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 32,
  },
  domainCardWrapper: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  activityContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#A6A6A6',
  },
  activityXP: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4DABF7',
  },
});
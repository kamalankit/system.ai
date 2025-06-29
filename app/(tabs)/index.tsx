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
import { User, Settings, Flame, Target, Bell, Trophy, BookOpen, TrendingUp, TrendingDown, Minus, Calendar, Zap, Brain, CircleCheck as CheckCircle } from 'lucide-react-native';
import { 
  Target as TargetIcon, 
  Brain as BrainIcon, 
  Heart, 
  Users, 
  Star,
  DollarSign,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import DomainCard from '@/components/DomainCard';
import DailyHardTruth from '@/components/DailyHardTruth';
import FocusMode from '@/components/FocusMode';
import { userData } from '@/data/mockData';
import { enhancedUserData, getSuccessRateForPeriod, getStreakData, getTrendDirection } from '@/data/enhancedMockData';

export default function DashboardScreen() {
  const router = useRouter();
  const [notifications] = useState(3);
  const insets = useSafeAreaInsets();

  const domains = [
    { ...userData.domains[0], icon: TargetIcon },
    { ...userData.domains[1], icon: BrainIcon },
    { ...userData.domains[2], icon: Heart },
    { ...userData.domains[3], icon: Users },
    { ...userData.domains[4], icon: DollarSign },
    { ...userData.domains[5], icon: Star },
  ];

  const handleProfilePress = () => {
    router.push('/profile');
  };

  const handleNotificationsPress = () => {
    router.push('/notifications');
  };

  // Enhanced success rate calculations
  const todaySuccessRate = getSuccessRateForPeriod(1);
  const weeklySuccessRate = getSuccessRateForPeriod(7);
  const { currentStreak, bestStreak } = getStreakData();
  const trendDirection = getTrendDirection();

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return '#51CF66';
    if (rate >= 50) return '#FFB366';
    return '#FF6B6B';
  };

  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up': return '#51CF66';
      case 'down': return '#FF6B6B';
      default: return '#A6A6A6';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Fixed Header */}
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

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Platform.OS === 'ios' ? 88 + insets.bottom + 20 : 68 + insets.bottom + 20
          }
        ]}
      >
        {/* Enhanced Success Rate Card */}
        <View style={styles.successRateSection}>
          <View style={styles.successRateCard}>
            <View style={styles.successRateHeader}>
              <Text style={styles.successRateTitle}>Success Rate</Text>
              <TouchableOpacity 
                onPress={() => router.push('/progress/analytics')}
                activeOpacity={0.7}
              >
                <Text style={styles.viewDetailsText}>View Details</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.successRateMain}>
              <View style={styles.mainSuccessRate}>
                <Text style={[
                  styles.successRateValue, 
                  { color: getSuccessRateColor(todaySuccessRate) }
                ]}>
                  {todaySuccessRate}%
                </Text>
                <Text style={styles.successRateLabel}>Today</Text>
              </View>
              
              <View style={styles.successRateStats}>
                <View style={styles.successRateStat}>
                  <Text style={styles.successRateStatValue}>{weeklySuccessRate}%</Text>
                  <Text style={styles.successRateStatLabel}>7-day avg</Text>
                </View>
                <View style={styles.successRateStat}>
                  <View style={styles.trendContainer}>
                    {React.createElement(getTrendIcon(), {
                      size: 16,
                      color: getTrendColor(),
                      strokeWidth: 1.5
                    })}
                    <Text style={[styles.trendText, { color: getTrendColor() }]}>
                      {trendDirection === 'stable' ? 'Stable' : 
                       trendDirection === 'up' ? 'Rising' : 'Falling'}
                    </Text>
                  </View>
                  <Text style={styles.successRateStatLabel}>Trend</Text>
                </View>
              </View>
            </View>

            <View style={styles.streakInfo}>
              <View style={styles.streakItem}>
                <Flame size={16} color="#FF6B6B" strokeWidth={1.5} />
                <Text style={styles.streakText}>
                  {currentStreak} day streak
                </Text>
              </View>
              <Text style={styles.bestStreakText}>
                Best: {bestStreak} days
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats - Enhanced */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Target size={16} color="#4DABF7" strokeWidth={1.5} />
            </View>
            <Text style={styles.statLabel}>Today</Text>
            <Text style={styles.statValue}>
              {userData.stats.todayCompleted}/{userData.stats.todayTotal}
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Trophy size={16} color="#51CF66" strokeWidth={1.5} />
            </View>
            <Text style={styles.statLabel}>Week</Text>
            <Text style={styles.statValue}>
              {userData.stats.weeklyCompleted}/{userData.stats.weeklyGoal}
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <CheckCircle size={16} color="#FFB366" strokeWidth={1.5} />
            </View>
            <Text style={styles.statLabel}>System</Text>
            <Text style={styles.statValue}>
              {enhancedUserData.battleTraining.systemData.systemStreak}
            </Text>
          </View>
        </View>

        {/* Hunter's Wisdom (Daily Hard Truth) - Moved here */}
        <DailyHardTruth />

        {/* Battle Training Quick Access */}
        <View style={styles.battleTrainingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Battle Training</Text>
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/battle-training')}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.battleTrainingCards}>
            <TouchableOpacity 
              style={styles.battleTrainingCard}
              onPress={() => router.push('/battle-training/visualization')}
              activeOpacity={0.8}
            >
              <View style={styles.battleTrainingIcon}>
                <Target size={20} color="#4DABF7" strokeWidth={1.5} />
              </View>
              <Text style={styles.battleTrainingTitle}>Visualization</Text>
              <Text style={styles.battleTrainingSubtitle}>3 active goals</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.battleTrainingCard}
              onPress={() => router.push('/battle-training/system')}
              activeOpacity={0.8}
            >
              <View style={styles.battleTrainingIcon}>
                <Brain size={20} color="#51CF66" strokeWidth={1.5} />
              </View>
              <Text style={styles.battleTrainingTitle}>System Mode</Text>
              <Text style={styles.battleTrainingSubtitle}>12 day streak</Text>
            </TouchableOpacity>
          </View>
        </View>

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
              <Target size={16} color="#FF6B6B" strokeWidth={1.5} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Workout Completed</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
            <Text style={styles.activityXP}>+50 XP</Text>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <BrainIcon size={16} color="#4DABF7" strokeWidth={1.5} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Problem Solved</Text>
              <Text style={styles.activityTime}>4 hours ago</Text>
            </View>
            <Text style={styles.activityXP}>+75 XP</Text>
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

        {/* Focus Mode */}
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
    paddingBottom: 16,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#111111',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
  },
  successRateSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  successRateCard: {
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  successRateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  successRateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#4DABF7',
    fontWeight: '600',
  },
  successRateMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainSuccessRate: {
    alignItems: 'center',
    marginRight: 32,
  },
  successRateValue: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 4,
  },
  successRateLabel: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  successRateStats: {
    flex: 1,
    gap: 16,
  },
  successRateStat: {
    alignItems: 'center',
  },
  successRateStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  successRateStatLabel: {
    fontSize: 12,
    color: '#A6A6A6',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  streakInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  streakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bestStreakText: {
    fontSize: 14,
    color: '#A6A6A6',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#A6A6A6',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  battleTrainingSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  battleTrainingCards: {
    flexDirection: 'row',
    gap: 12,
  },
  battleTrainingCard: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  battleTrainingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  battleTrainingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  battleTrainingSubtitle: {
    fontSize: 12,
    color: '#A6A6A6',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewAllText: {
    fontSize: 14,
    color: '#4DABF7',
    fontWeight: '600',
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
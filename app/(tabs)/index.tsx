import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  User,
  Settings,
  Flame,
  Target,
  Plus,
  Bell,
  Trophy,
  Zap,
  BookOpen,
  Timer,
  CheckCircle,
  TrendingUp,
  Calendar,
  Award,
  Clock,
  ChevronRight,
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
import { userData } from '@/data/mockData';

export default function DashboardScreen() {
  const router = useRouter();
  const [notifications] = useState(3);
  const [streakPulse] = useState(new Animated.Value(1));
  const [dailyProgress] = useState(new Animated.Value(0));
  const insets = useSafeAreaInsets();

  const domains = [
    { ...userData.domains[0], icon: TargetIcon },
    { ...userData.domains[1], icon: Brain },
    { ...userData.domains[2], icon: Heart },
    { ...userData.domains[3], icon: Users },
    { ...userData.domains[4], icon: DollarSign },
    { ...userData.domains[5], icon: Star },
  ];

  // Calculate progress percentages
  const dailyProgressPercent = (userData.stats.todayCompleted / userData.stats.todayTotal) * 100;
  const weeklyProgressPercent = (userData.stats.weeklyCompleted / userData.stats.weeklyGoal) * 100;

  // Streak status logic
  const getStreakStatus = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (userData.stats.todayCompleted === 0 && hour > 18) {
      return 'at-risk';
    } else if (userData.stats.streak > 0) {
      return 'active';
    } else {
      return 'broken';
    }
  };

  const getTimeBasedMessage = () => {
    const hour = new Date().getHours();
    const remaining = userData.stats.todayTotal - userData.stats.todayCompleted;
    
    if (hour < 12) {
      return "Ready for today's hunt?";
    } else if (hour < 18) {
      return remaining > 0 ? `Great progress! ${remaining} quest${remaining !== 1 ? 's' : ''} left` : "Amazing! All quests complete!";
    } else {
      return remaining > 0 ? `Finish strong! ${remaining} quest${remaining !== 1 ? 's' : ''} remaining` : "Perfect day, Hunter!";
    }
  };

  const getWeeklyRanking = () => {
    const percentage = Math.round(weeklyProgressPercent);
    if (percentage >= 90) return "Top 5% of hunters this week!";
    if (percentage >= 75) return "Top 15% of hunters this week!";
    if (percentage >= 50) return "Top 40% of hunters this week!";
    return "Keep pushing, Hunter!";
  };

  // Animation effects
  useEffect(() => {
    const streakStatus = getStreakStatus();
    
    if (streakStatus === 'at-risk') {
      // Orange pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(streakPulse, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(streakPulse, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, []);

  useEffect(() => {
    // Animate daily progress
    Animated.timing(dailyProgress, {
      toValue: dailyProgressPercent,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [dailyProgressPercent]);

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  const handleNotificationsPress = () => {
    router.push('/notifications');
  };

  const handleStreakPress = () => {
    // Show streak details modal or navigate to streak screen
    console.log('Show streak details');
  };

  const handleDailyProgressPress = () => {
    router.push('/(tabs)/quests');
  };

  const handleWeeklyProgressPress = () => {
    router.push('/(tabs)/evolution');
  };

  const quickWinTasks = [
    { id: 1, title: "Drink a glass of water", xp: 5, completed: false },
    { id: 2, title: "Take 5 deep breaths", xp: 5, completed: false },
    { id: 3, title: "Write one thing you're grateful for", xp: 10, completed: false },
    { id: 4, title: "Stretch for 30 seconds", xp: 5, completed: false },
  ];

  const [quickWins, setQuickWins] = useState(quickWinTasks);

  const completeQuickWin = (id: number) => {
    setQuickWins(prev => prev.map(task => 
      task.id === id ? { ...task, completed: true } : task
    ));
  };

  const getStreakColor = () => {
    const status = getStreakStatus();
    switch (status) {
      case 'active': return '#51CF66';
      case 'at-risk': return '#FFB366';
      case 'broken': return '#FF6B6B';
      default: return '#51CF66';
    }
  };

  const getStreakGlow = () => {
    const status = getStreakStatus();
    return status === 'active' ? { shadowColor: '#51CF66', shadowOpacity: 0.3, shadowRadius: 8 } : {};
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

        {/* Enhanced Quick Stats */}
        <View style={styles.statsContainer}>
          {/* Streak Counter Card */}
          <TouchableOpacity 
            style={[styles.statCard, styles.streakCard, getStreakGlow()]}
            onPress={handleStreakPress}
            activeOpacity={0.8}
          >
            <Animated.View style={[styles.statContent, { transform: [{ scale: streakPulse }] }]}>
              <View style={styles.statHeader}>
                <View style={[styles.statIcon, { backgroundColor: getStreakColor() + '20' }]}>
                  <Flame size={16} color={getStreakColor()} strokeWidth={1.5} />
                </View>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
              <Text style={[styles.statValue, { color: getStreakColor() }]}>
                {userData.stats.streak}
              </Text>
              <Text style={styles.statSubtext}>
                {getStreakStatus() === 'active' && "🔥 On fire!"}
                {getStreakStatus() === 'at-risk' && "⚠️ At risk"}
                {getStreakStatus() === 'broken' && "💪 Start new"}
              </Text>
              <View style={styles.milestoneContainer}>
                <Text style={styles.milestoneText}>
                  {7 - (userData.stats.streak % 7)} days to Weekly Warrior!
                </Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
          
          {/* Daily Progress Card */}
          <TouchableOpacity 
            style={[styles.statCard, styles.dailyCard]}
            onPress={handleDailyProgressPress}
            activeOpacity={0.8}
          >
            <View style={styles.statContent}>
              <View style={styles.statHeader}>
                <View style={styles.statIcon}>
                  <Target size={16} color="#4DABF7" strokeWidth={1.5} />
                </View>
                <Text style={styles.statLabel}>Today</Text>
              </View>
              <Text style={styles.statValue}>
                {userData.stats.todayCompleted}/{userData.stats.todayTotal}
              </Text>
              <Text style={styles.statSubtext}>
                {getTimeBasedMessage()}
              </Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <Animated.View 
                    style={[
                      styles.progressFill,
                      { 
                        width: dailyProgress.interpolate({
                          inputRange: [0, 100],
                          outputRange: ['0%', '100%'],
                          extrapolate: 'clamp',
                        })
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressPercent}>{Math.round(dailyProgressPercent)}%</Text>
              </View>
              {dailyProgressPercent === 100 && (
                <Text style={styles.celebrationText}>🎉 Perfect day!</Text>
              )}
            </View>
          </TouchableOpacity>
          
          {/* Weekly Progress Card */}
          <TouchableOpacity 
            style={[styles.statCard, styles.weeklyCard]}
            onPress={handleWeeklyProgressPress}
            activeOpacity={0.8}
          >
            <View style={styles.statContent}>
              <View style={styles.statHeader}>
                <View style={styles.statIcon}>
                  <Trophy size={16} color="#51CF66" strokeWidth={1.5} />
                </View>
                <Text style={styles.statLabel}>Week</Text>
              </View>
              <Text style={styles.statValue}>
                {userData.stats.weeklyCompleted}/{userData.stats.weeklyGoal}
              </Text>
              <Text style={styles.statSubtext}>
                {getWeeklyRanking()}
              </Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${Math.min(100, weeklyProgressPercent)}%`,
                        backgroundColor: '#51CF66'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressPercent}>{Math.round(weeklyProgressPercent)}%</Text>
              </View>
              <Text style={styles.domainFocus}>
                Strong in Mental, boost Physical
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Win Section */}
        <View style={styles.quickWinSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Wins</Text>
            <Text style={styles.sectionSubtitle}>2-minute tasks for instant XP</Text>
          </View>
          
          <View style={styles.quickWinGrid}>
            {quickWins.filter(task => !task.completed).slice(0, 4).map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.quickWinCard}
                onPress={() => completeQuickWin(task.id)}
                activeOpacity={0.8}
              >
                <View style={styles.quickWinContent}>
                  <View style={styles.quickWinIcon}>
                    <Zap size={14} color="#FFB366" strokeWidth={1.5} />
                  </View>
                  <Text style={styles.quickWinTitle}>{task.title}</Text>
                  <Text style={styles.quickWinXP}>+{task.xp} XP</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Daily Hard Truth */}
        <DailyHardTruth />

        {/* Combined Habit Tracker & Daily Quests */}
        <View style={styles.combinedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Progress</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/quests')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <QuickHabitTracker />
          
          {/* Next Quest Preview */}
          <View style={styles.nextQuestContainer}>
            <Text style={styles.nextQuestTitle}>Next Quest</Text>
            <TouchableOpacity 
              style={styles.nextQuestCard}
              onPress={() => router.push('/(tabs)/quests')}
              activeOpacity={0.8}
            >
              <View style={styles.nextQuestContent}>
                <View style={styles.nextQuestIcon}>
                  <Target size={16} color="#4DABF7" strokeWidth={1.5} />
                </View>
                <View style={styles.nextQuestInfo}>
                  <Text style={styles.nextQuestName}>30 minutes workout</Text>
                  <Text style={styles.nextQuestDescription}>Complete a full body workout session</Text>
                </View>
                <View style={styles.nextQuestActions}>
                  <Text style={styles.nextQuestXP}>+50 XP</Text>
                  <ChevronRight size={16} color="#A6A6A6" strokeWidth={1.5} />
                </View>
              </View>
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

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {/* Quest Actions Row */}
          <View style={styles.questActionsRow}>
            <TouchableOpacity
              style={styles.primaryAction}
              onPress={() => router.push('/(tabs)/quests')}
              activeOpacity={0.8}
            >
              <Zap size={20} color="#000000" strokeWidth={1.5} />
              <Text style={styles.primaryActionText}>View Daily Quests</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.addQuestButton}
              onPress={() => router.push('/quest/create')}
              activeOpacity={0.8}
            >
              <Plus size={20} color="#FFFFFF" strokeWidth={1.5} />
            </TouchableOpacity>
          </View>

          {/* Journal Actions Row */}
          <View style={styles.journalActionsRow}>
            <TouchableOpacity
              style={styles.journalAction}
              onPress={() => router.push('/journal')}
              activeOpacity={0.8}
            >
              <BookOpen size={20} color="#FFFFFF" strokeWidth={1.5} />
              <Text style={styles.journalActionText}>Shadow Work Journal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAddButton}
              onPress={() => router.push('/journal')}
              activeOpacity={0.8}
            >
              <Plus size={20} color="#A6A6A6" strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </View>
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
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 120,
  },
  streakCard: {
    borderColor: '#51CF66',
    backgroundColor: '#51CF66' + '05',
  },
  dailyCard: {
    borderColor: '#4DABF7',
    backgroundColor: '#4DABF7' + '05',
  },
  weeklyCard: {
    borderColor: '#51CF66',
    backgroundColor: '#51CF66' + '05',
  },
  statContent: {
    flex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 11,
    color: '#A6A6A6',
    marginBottom: 8,
  },
  milestoneContainer: {
    marginTop: 4,
  },
  milestoneText: {
    fontSize: 10,
    color: '#FFB366',
    fontWeight: '500',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4DABF7',
    borderRadius: 2,
  },
  progressPercent: {
    fontSize: 10,
    color: '#A6A6A6',
    fontWeight: '600',
    minWidth: 30,
  },
  celebrationText: {
    fontSize: 10,
    color: '#51CF66',
    fontWeight: '600',
    marginTop: 4,
  },
  domainFocus: {
    fontSize: 10,
    color: '#A6A6A6',
    marginTop: 4,
  },
  quickWinSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  quickWinGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickWinCard: {
    width: '48%',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  quickWinContent: {
    alignItems: 'center',
  },
  quickWinIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFB366' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickWinTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 16,
  },
  quickWinXP: {
    fontSize: 10,
    color: '#FFB366',
    fontWeight: '600',
  },
  combinedSection: {
    marginBottom: 32,
  },
  nextQuestContainer: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  nextQuestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  nextQuestCard: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  nextQuestContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextQuestIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4DABF7' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nextQuestInfo: {
    flex: 1,
  },
  nextQuestName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  nextQuestDescription: {
    fontSize: 12,
    color: '#A6A6A6',
  },
  nextQuestActions: {
    alignItems: 'flex-end',
  },
  nextQuestXP: {
    fontSize: 12,
    color: '#4DABF7',
    fontWeight: '600',
    marginBottom: 4,
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
  sectionSubtitle: {
    fontSize: 12,
    color: '#A6A6A6',
    marginTop: 2,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4DABF7',
    fontWeight: '500',
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
  quickActions: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 16,
  },
  questActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryAction: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    minHeight: 56,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  addQuestButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#4DABF7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  journalActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  journalAction: {
    flex: 1,
    backgroundColor: '#9775FA',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    minHeight: 56,
  },
  journalActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickAddButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
});
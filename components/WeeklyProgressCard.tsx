import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Trophy, TrendingUp, Target, Brain, Heart, Users, DollarSign, Star } from 'lucide-react-native';
import { userData } from '@/data/mockData';

interface WeeklyProgressCardProps {
  onPress?: () => void;
  style?: any;
}

export default function WeeklyProgressCard({ onPress, style }: WeeklyProgressCardProps) {
  const [weeklyRanking, setWeeklyRanking] = useState('');
  const [domainFocus, setDomainFocus] = useState('');
  const [weeklyChallenge, setWeeklyChallenge] = useState('');
  const [progressAnim] = useState(new Animated.Value(0));
  const [rankingAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    calculateWeeklyStats();
    animateProgress();
    animateRanking();
  }, []);

  const calculateWeeklyStats = () => {
    // Calculate weekly ranking (mock calculation)
    const completionRate = userData.stats.weeklyGoal > 0 ? (userData.stats.weeklyCompleted / userData.stats.weeklyGoal) * 100 : 0;
    
    if (completionRate >= 90) {
      setWeeklyRanking('Top 5% of hunters this week!');
    } else if (completionRate >= 75) {
      setWeeklyRanking('Top 15% of hunters this week!');
    } else if (completionRate >= 50) {
      setWeeklyRanking('Top 35% of hunters this week!');
    } else {
      setWeeklyRanking('Keep pushing, Hunter!');
    }

    // Analyze domain performance
    const domainPerformance = userData.domains.map(domain => ({
      name: domain.name,
      progress: domain.progress,
      id: domain.id,
    })).sort((a, b) => b.progress - a.progress);

    const strongest = domainPerformance[0];
    const weakest = domainPerformance[domainPerformance.length - 1];
    
    setDomainFocus(`Strong in ${strongest.name}, boost ${weakest.name}`);

    // Set weekly challenge
    const challenges = [
      'Complete 3 Physical quests this week',
      'Maintain 5-day streak this week',
      'Earn 500 XP in Mental domain',
      'Complete all daily quests 3 days',
      'Join a guild discussion',
    ];
    setWeeklyChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
  };

  const animateProgress = () => {
    const progress = userData.stats.weeklyGoal > 0 ? userData.stats.weeklyCompleted / userData.stats.weeklyGoal : 0;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  };

  const animateRanking = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rankingAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rankingAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const getProgressColor = () => {
    const percentage = userData.stats.weeklyGoal > 0 ? (userData.stats.weeklyCompleted / userData.stats.weeklyGoal) * 100 : 0;
    if (percentage >= 90) return '#51CF66';
    if (percentage >= 75) return '#4DABF7';
    if (percentage >= 50) return '#FFB366';
    return '#FF6B6B';
  };

  const getDomainIcon = (domainName: string) => {
    const icons = {
      Physical: Target,
      Mental: Brain,
      Emotional: Heart,
      Social: Users,
      Financial: DollarSign,
      Spiritual: Star,
    };
    return icons[domainName as keyof typeof icons] || Target;
  };

  const getWeeklyPerformance = () => {
    // Mock weekly performance data (7 days)
    return [0.8, 0.6, 0.9, 0.7, 0.85, 0.4, 0.75]; // Completion rates for each day
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: getProgressColor() + '20' }]}>
            <Trophy size={16} color={getProgressColor()} strokeWidth={1.5} />
          </View>
          <Animated.View style={[
            styles.rankingBadge,
            {
              backgroundColor: getProgressColor() + '20',
              transform: [{
                scale: rankingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.05],
                })
              }]
            }
          ]}>
            <TrendingUp size={12} color={getProgressColor()} strokeWidth={1.5} />
          </Animated.View>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Week</Text>
          <Text style={[styles.value, { color: getProgressColor() }]}>
            {userData.stats.weeklyCompleted}/{userData.stats.weeklyGoal}
          </Text>
          <Text style={styles.ranking}>{weeklyRanking}</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: getProgressColor(),
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.weeklyChart}>
          {getWeeklyPerformance().map((performance, index) => (
            <View key={index} style={styles.chartBar}>
              <View
                style={[
                  styles.chartBarFill,
                  {
                    height: `${performance * 100}%`,
                    backgroundColor: performance > 0.7 ? '#51CF66' : performance > 0.4 ? '#FFB366' : '#FF6B6B',
                  },
                ]}
              />
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.domainFocus}>{domainFocus}</Text>
          <View style={styles.challengeContainer}>
            <Target size={10} color="#4DABF7" strokeWidth={1.5} />
            <Text style={styles.challengeText}>{weeklyChallenge}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankingBadge: {
    borderRadius: 12,
    padding: 6,
  },
  content: {
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#A6A6A6',
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  ranking: {
    fontSize: 10,
    color: '#A6A6A6',
    fontWeight: '500',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 20,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  chartBar: {
    width: 3,
    height: '100%',
    backgroundColor: '#333333',
    borderRadius: 1.5,
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 1.5,
    minHeight: 2,
  },
  footer: {
    alignItems: 'center',
    gap: 4,
  },
  domainFocus: {
    fontSize: 10,
    color: '#FFB366',
    fontWeight: '600',
    textAlign: 'center',
  },
  challengeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  challengeText: {
    fontSize: 9,
    color: '#4DABF7',
    fontWeight: '500',
    textAlign: 'center',
  },
});
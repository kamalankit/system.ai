import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Trophy, TrendingUp, Target } from 'lucide-react-native';
import { userData } from '@/data/mockData';

interface WeeklyProgressCardProps {
  onPress?: () => void;
  style?: any;
}

export default function WeeklyProgressCard({ onPress, style }: WeeklyProgressCardProps) {
  const [weeklyRanking, setWeeklyRanking] = useState('');
  const [domainFocus, setDomainFocus] = useState('');
  const [progressAnim] = useState(new Animated.Value(0));
  const [rankingAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    calculateWeeklyStats();
    animateProgress();
    animateRanking();
  }, []);

  const calculateWeeklyStats = () => {
    const completionRate = userData.stats.weeklyGoal > 0 ? (userData.stats.weeklyCompleted / userData.stats.weeklyGoal) * 100 : 0;
    
    if (completionRate >= 90) {
      setWeeklyRanking('Top 5%');
    } else if (completionRate >= 75) {
      setWeeklyRanking('Top 15%');
    } else if (completionRate >= 50) {
      setWeeklyRanking('Top 35%');
    } else {
      setWeeklyRanking('Keep going!');
    }

    const domainPerformance = userData.domains.map(domain => ({
      name: domain.name,
      progress: domain.progress,
    })).sort((a, b) => b.progress - a.progress);

    const strongest = domainPerformance[0];
    const weakest = domainPerformance[domainPerformance.length - 1];
    
    setDomainFocus(`Strong: ${strongest.name}`);
  };

  const animateProgress = () => {
    const progress = userData.stats.weeklyGoal > 0 ? userData.stats.weeklyCompleted / userData.stats.weeklyGoal : 0;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
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

  const getWeeklyPerformance = () => {
    return [0.8, 0.6, 0.9, 0.7, 0.85, 0.4, 0.75];
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.touchable}>
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: getProgressColor() + '20' }]}>
            <Trophy size={14} color={getProgressColor()} strokeWidth={1.5} />
          </View>
          <Animated.View style={[
            styles.rankingBadge,
            {
              backgroundColor: getProgressColor() + '20',
              transform: [{
                scale: rankingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.03],
                })
              }]
            }
          ]}>
            <TrendingUp size={10} color={getProgressColor()} strokeWidth={1.5} />
          </Animated.View>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Week</Text>
          <Text style={[styles.value, { color: getProgressColor() }]}>
            {userData.stats.weeklyCompleted}/{userData.stats.weeklyGoal}
          </Text>
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
          <Text style={styles.ranking} numberOfLines={1}>{weeklyRanking}</Text>
          <View style={styles.challengeContainer}>
            <Target size={8} color="#4DABF7" strokeWidth={1.5} />
            <Text style={styles.challengeText} numberOfLines={1}>{domainFocus}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
  },
  container: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333333',
    height: 85,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankingBadge: {
    borderRadius: 8,
    padding: 3,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    color: '#A6A6A6',
    fontWeight: '500',
    marginBottom: 2,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
  },
  progressContainer: {
    marginBottom: 6,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#333333',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 12,
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  chartBar: {
    width: 2,
    height: '100%',
    backgroundColor: '#333333',
    borderRadius: 1,
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 1,
    minHeight: 1,
  },
  footer: {
    alignItems: 'center',
    gap: 2,
  },
  ranking: {
    fontSize: 9,
    color: '#FFB366',
    fontWeight: '600',
    textAlign: 'center',
  },
  challengeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  challengeText: {
    fontSize: 8,
    color: '#4DABF7',
    fontWeight: '500',
    flex: 1,
  },
});
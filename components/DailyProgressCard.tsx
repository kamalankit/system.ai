import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Target, CircleCheck as CheckCircle, Clock, Zap } from 'lucide-react-native';
import { userData } from '@/data/mockData';

interface DailyProgressCardProps {
  onPress?: () => void;
  style?: any;
}

export default function DailyProgressCard({ onPress, style }: DailyProgressCardProps) {
  const [timeBasedMessage, setTimeBasedMessage] = useState('');
  const [nextQuest, setNextQuest] = useState<any>(null);
  const [celebrationAnim] = useState(new Animated.Value(0));
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    setTimeBasedMessage(getTimeBasedMessage());
    setNextQuest(getNextIncompleteQuest());
    animateProgress();
    
    if (userData.stats.todayCompleted === userData.stats.todayTotal) {
      startCelebrationAnimation();
    }
  }, []);

  const getTimeBasedMessage = () => {
    const hour = new Date().getHours();
    const remaining = userData.stats.todayTotal - userData.stats.todayCompleted;
    
    if (hour < 12) {
      return "Ready for today's hunt?";
    } else if (hour < 18) {
      return remaining > 0 ? `Great progress! ${remaining} quest${remaining > 1 ? 's' : ''} left` : "Amazing! All quests complete!";
    } else {
      return remaining > 0 ? `Finish strong! ${remaining} quest${remaining > 1 ? 's' : ''} remaining` : "Perfect day, Hunter!";
    }
  };

  const getNextIncompleteQuest = () => {
    const incompleteQuests = userData.quests.filter(q => !q.completed && q.type === 'simple');
    return incompleteQuests.length > 0 ? incompleteQuests[0] : null;
  };

  const animateProgress = () => {
    const progress = userData.stats.todayTotal > 0 ? userData.stats.todayCompleted / userData.stats.todayTotal : 0;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const startCelebrationAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(celebrationAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(celebrationAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 3 }
    ).start();
  };

  const handleQuickComplete = () => {
    if (nextQuest) {
      // Mark quest as completed
      nextQuest.completed = true;
      userData.stats.todayCompleted += 1;
      
      // Add XP
      userData.profile.totalXP += nextQuest.xp;
      const domain = userData.domains.find(d => d.id === nextQuest.domain);
      if (domain) {
        domain.xp += nextQuest.xp;
      }
      
      // Update next quest
      setNextQuest(getNextIncompleteQuest());
      setTimeBasedMessage(getTimeBasedMessage());
      animateProgress();
      
      if (userData.stats.todayCompleted === userData.stats.todayTotal) {
        startCelebrationAnimation();
      }
    }
  };

  const getProgressColor = () => {
    const percentage = userData.stats.todayTotal > 0 ? (userData.stats.todayCompleted / userData.stats.todayTotal) * 100 : 0;
    if (percentage === 100) return '#51CF66';
    if (percentage >= 75) return '#4DABF7';
    if (percentage >= 50) return '#FFB366';
    return '#FF6B6B';
  };

  const isComplete = userData.stats.todayCompleted === userData.stats.todayTotal;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View style={[
        styles.container, 
        style,
        isComplete && {
          transform: [{ scale: celebrationAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.02],
          })}],
          shadowColor: '#51CF66',
          shadowOpacity: celebrationAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.3],
          }),
          shadowRadius: 8,
          elevation: 8,
        }
      ]}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: getProgressColor() + '20' }]}>
            <Target size={16} color={getProgressColor()} strokeWidth={1.5} />
          </View>
          {isComplete && (
            <View style={styles.completeBadge}>
              <CheckCircle size={16} color="#51CF66" strokeWidth={1.5} />
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Today</Text>
          <Text style={[styles.value, { color: getProgressColor() }]}>
            {userData.stats.todayCompleted}/{userData.stats.todayTotal}
          </Text>
          <Text style={styles.message}>{timeBasedMessage}</Text>
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

        {nextQuest && !isComplete && (
          <TouchableOpacity style={styles.quickCompleteButton} onPress={handleQuickComplete}>
            <Zap size={12} color="#4DABF7" strokeWidth={1.5} />
            <Text style={styles.quickCompleteText} numberOfLines={1}>
              {nextQuest.title}
            </Text>
          </TouchableOpacity>
        )}

        {isComplete && (
          <View style={styles.celebrationContainer}>
            <Text style={styles.celebrationText}>🎉 Perfect Day!</Text>
          </View>
        )}
      </Animated.View>
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
  completeBadge: {
    backgroundColor: '#51CF66' + '20',
    borderRadius: 12,
    padding: 4,
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
  message: {
    fontSize: 11,
    color: '#A6A6A6',
    fontWeight: '500',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 8,
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
  quickCompleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4DABF7' + '20',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
  },
  quickCompleteText: {
    fontSize: 10,
    color: '#4DABF7',
    fontWeight: '600',
    flex: 1,
  },
  celebrationContainer: {
    alignItems: 'center',
  },
  celebrationText: {
    fontSize: 12,
    color: '#51CF66',
    fontWeight: '700',
  },
});
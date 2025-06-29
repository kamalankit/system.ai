import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Target, CircleCheck as CheckCircle, Zap } from 'lucide-react-native';
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
      return "Ready to hunt?";
    } else if (hour < 18) {
      return remaining > 0 ? `${remaining} left` : "All done!";
    } else {
      return remaining > 0 ? `${remaining} remaining` : "Perfect!";
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
      duration: 800,
      useNativeDriver: false,
    }).start();
  };

  const startCelebrationAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(celebrationAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(celebrationAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 2 }
    ).start();
  };

  const handleQuickComplete = () => {
    if (nextQuest) {
      nextQuest.completed = true;
      userData.stats.todayCompleted += 1;
      userData.profile.totalXP += nextQuest.xp;
      
      const domain = userData.domains.find(d => d.id === nextQuest.domain);
      if (domain) {
        domain.xp += nextQuest.xp;
      }
      
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
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.touchable}>
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
            outputRange: [0, 0.2],
          }),
          shadowRadius: 4,
          elevation: 4,
        }
      ]}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: getProgressColor() + '20' }]}>
            <Target size={14} color={getProgressColor()} strokeWidth={1.5} />
          </View>
          {isComplete && (
            <View style={styles.completeBadge}>
              <CheckCircle size={12} color="#51CF66" strokeWidth={1.5} />
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Today</Text>
          <Text style={[styles.value, { color: getProgressColor() }]}>
            {userData.stats.todayCompleted}/{userData.stats.todayTotal}
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

        <View style={styles.footer}>
          {nextQuest && !isComplete ? (
            <TouchableOpacity style={styles.quickCompleteButton} onPress={handleQuickComplete}>
              <Zap size={10} color="#4DABF7" strokeWidth={1.5} />
              <Text style={styles.quickCompleteText} numberOfLines={1}>
                {nextQuest.title}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.message} numberOfLines={1}>{timeBasedMessage}</Text>
          )}
        </View>
      </Animated.View>
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
  completeBadge: {
    backgroundColor: '#51CF66' + '20',
    borderRadius: 8,
    padding: 2,
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
    marginBottom: 4,
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
  footer: {
    alignItems: 'center',
    minHeight: 16,
    justifyContent: 'center',
  },
  quickCompleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4DABF7' + '20',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 3,
    maxWidth: '100%',
  },
  quickCompleteText: {
    fontSize: 9,
    color: '#4DABF7',
    fontWeight: '600',
    flex: 1,
  },
  message: {
    fontSize: 9,
    color: '#A6A6A6',
    fontWeight: '500',
    textAlign: 'center',
  },
});
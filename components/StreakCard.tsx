import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Flame, Trophy, Calendar, Target } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userData } from '@/data/mockData';

interface StreakCardProps {
  onPress?: () => void;
  style?: any;
}

type StreakState = 'active' | 'at-risk' | 'broken';

export default function StreakCard({ onPress, style }: StreakCardProps) {
  const [streakState, setStreakState] = useState<StreakState>('active');
  const [bestStreak, setBestStreak] = useState(0);
  const [streakTier, setStreakTier] = useState('Bronze');
  const [nextMilestone, setNextMilestone] = useState('');
  const [glowAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    loadStreakData();
    determineStreakState();
    startAnimations();
  }, []);

  const loadStreakData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('streakData');
      if (storedData) {
        const { bestStreak: stored } = JSON.parse(storedData);
        setBestStreak(stored || userData.stats.streak);
      } else {
        setBestStreak(userData.stats.streak);
      }
      
      // Determine streak tier
      const currentStreak = userData.stats.streak;
      if (currentStreak >= 30) setStreakTier('Gold');
      else if (currentStreak >= 14) setStreakTier('Silver');
      else setStreakTier('Bronze');

      // Calculate next milestone
      if (currentStreak < 7) {
        setNextMilestone(`${7 - currentStreak} days to Weekly Warrior badge!`);
      } else if (currentStreak < 14) {
        setNextMilestone(`${14 - currentStreak} days to Silver streak!`);
      } else if (currentStreak < 30) {
        setNextMilestone(`${30 - currentStreak} days to Gold streak!`);
      } else {
        setNextMilestone('Legendary streak achieved!');
      }
    } catch (error) {
      console.error('Error loading streak data:', error);
    }
  };

  const determineStreakState = () => {
    const now = new Date();
    const lastActivity = new Date(); // In real app, get from user's last activity
    const hoursSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
    
    if (userData.stats.streak === 0) {
      setStreakState('broken');
    } else if (hoursSinceActivity > 20) { // After 8 PM, streak at risk
      setStreakState('at-risk');
    } else {
      setStreakState('active');
    }
  };

  const startAnimations = () => {
    if (streakState === 'active') {
      // Green glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else if (streakState === 'at-risk') {
      // Orange pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  };

  const getStreakColor = () => {
    switch (streakState) {
      case 'active': return '#51CF66';
      case 'at-risk': return '#FFB366';
      case 'broken': return '#FF6B6B';
      default: return '#51CF66';
    }
  };

  const getStreakMessage = () => {
    switch (streakState) {
      case 'active': return `${streakTier} Streak`;
      case 'at-risk': return 'Streak at Risk!';
      case 'broken': return 'Streak Broken';
      default: return 'Streak';
    }
  };

  const handlePress = () => {
    if (streakState === 'broken') {
      // Start new streak logic
      userData.stats.streak = 1;
      setStreakState('active');
    }
    onPress?.();
  };

  const animatedStyle = {
    transform: [{ scale: pulseAnim }],
    shadowColor: getStreakColor(),
    shadowOpacity: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.3],
    }),
    shadowRadius: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 10],
    }),
    elevation: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 8],
    }),
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={[styles.container, style, animatedStyle]}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: getStreakColor() + '20' }]}>
            <Flame size={16} color={getStreakColor()} strokeWidth={1.5} />
          </View>
          <View style={[styles.tierBadge, { backgroundColor: getStreakColor() + '20' }]}>
            <Text style={[styles.tierText, { color: getStreakColor() }]}>{streakTier}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Streak</Text>
          <Text style={[styles.value, { color: getStreakColor() }]}>
            {userData.stats.streak}
          </Text>
          <Text style={styles.message}>{getStreakMessage()}</Text>
        </View>

        <View style={styles.footer}>
          {streakState === 'broken' ? (
            <TouchableOpacity style={styles.actionButton}>
              <Target size={12} color="#4DABF7" strokeWidth={1.5} />
              <Text style={styles.actionText}>Start New Streak</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.milestoneContainer}>
              <Trophy size={12} color="#FFB366" strokeWidth={1.5} />
              <Text style={styles.milestoneText}>{nextMilestone}</Text>
            </View>
          )}
        </View>
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
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
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
  },
  footer: {
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4DABF7' + '20',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  actionText: {
    fontSize: 10,
    color: '#4DABF7',
    fontWeight: '600',
  },
  milestoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  milestoneText: {
    fontSize: 10,
    color: '#FFB366',
    fontWeight: '500',
    textAlign: 'center',
  },
});
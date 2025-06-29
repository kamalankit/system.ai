import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Flame, Trophy } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userData } from '@/data/mockData';

interface StreakCardProps {
  onPress?: () => void;
  style?: any;
}

type StreakState = 'active' | 'at-risk' | 'broken';

export default function StreakCard({ onPress, style }: StreakCardProps) {
  const [streakState, setStreakState] = useState<StreakState>('active');
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
      // Determine streak tier
      const currentStreak = userData.stats.streak;
      if (currentStreak >= 30) setStreakTier('Gold');
      else if (currentStreak >= 14) setStreakTier('Silver');
      else setStreakTier('Bronze');

      // Calculate next milestone
      if (currentStreak < 7) {
        setNextMilestone(`${7 - currentStreak} to Weekly Warrior`);
      } else if (currentStreak < 14) {
        setNextMilestone(`${14 - currentStreak} to Silver`);
      } else if (currentStreak < 30) {
        setNextMilestone(`${30 - currentStreak} to Gold`);
      } else {
        setNextMilestone('Legendary!');
      }
    } catch (error) {
      console.error('Error loading streak data:', error);
    }
  };

  const determineStreakState = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (userData.stats.streak === 0) {
      setStreakState('broken');
    } else if (hour > 20) { // After 8 PM, streak at risk
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
            toValue: 1.03,
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

  const handlePress = () => {
    if (streakState === 'broken') {
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
      outputRange: [0, 0.2],
    }),
    shadowRadius: 4,
    elevation: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 4],
    }),
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={styles.touchable}>
      <Animated.View style={[styles.container, style, animatedStyle]}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: getStreakColor() + '20' }]}>
            <Flame size={14} color={getStreakColor()} strokeWidth={1.5} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Streak</Text>
          <Text style={[styles.value, { color: getStreakColor() }]}>
            {userData.stats.streak}
          </Text>
        </View>

        <View style={styles.footer}>
          <Trophy size={10} color="#FFB366" strokeWidth={1.5} />
          <Text style={styles.milestoneText} numberOfLines={1}>
            {nextMilestone}
          </Text>
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
    alignItems: 'flex-end',
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  milestoneText: {
    fontSize: 9,
    color: '#FFB366',
    fontWeight: '500',
    flex: 1,
  },
});
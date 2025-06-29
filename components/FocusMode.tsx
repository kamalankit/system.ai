import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { Target, Play, Pause, Square, Clock, Flame } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userData } from '@/data/mockData';

interface FocusModeProps {
  style?: any;
}

type SessionState = 'inactive' | 'active' | 'break' | 'paused';

interface FocusSession {
  duration: number; // in seconds
  type: 'work' | 'break';
  startTime: number;
}

export default function FocusMode({ style }: FocusModeProps) {
  const [sessionState, setSessionState] = useState<SessionState>('inactive');
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalFocusToday, setTotalFocusToday] = useState(0);
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [focusStreak, setFocusStreak] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [progressAnim] = useState(new Animated.Value(0));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadTodaysFocusData();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (sessionState === 'active') {
      startPulseAnimation();
      startTimer();
    } else {
      stopPulseAnimation();
      stopTimer();
    }

    return () => stopTimer();
  }, [sessionState]);

  const loadTodaysFocusData = async () => {
    try {
      const today = new Date().toDateString();
      const storedData = await AsyncStorage.getItem('focusData');
      
      if (storedData) {
        const { date, totalTime, streak } = JSON.parse(storedData);
        if (date === today) {
          setTotalFocusToday(totalTime);
          setFocusStreak(streak || 0);
        } else {
          // New day, reset daily total but keep streak if it was yesterday
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (date === yesterday.toDateString()) {
            setFocusStreak(streak || 0);
          } else {
            setFocusStreak(0);
          }
          setTotalFocusToday(0);
        }
      }
    } catch (error) {
      console.error('Error loading focus data:', error);
    }
  };

  const saveFocusData = async (additionalTime: number, incrementStreak: boolean = false) => {
    try {
      const today = new Date().toDateString();
      const newTotal = totalFocusToday + additionalTime;
      const newStreak = incrementStreak ? focusStreak + 1 : focusStreak;
      
      await AsyncStorage.setItem('focusData', JSON.stringify({
        date: today,
        totalTime: newTotal,
        streak: newStreak,
      }));
      
      setTotalFocusToday(newTotal);
      setFocusStreak(newStreak);
    } catch (error) {
      console.error('Error saving focus data:', error);
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSessionComplete();
          return 0;
        }
        
        // Update progress animation
        if (currentSession) {
          const progress = (currentSession.duration - prev + 1) / currentSession.duration;
          Animated.timing(progressAnim, {
            toValue: progress,
            duration: 100,
            useNativeDriver: false,
          }).start();
        }
        
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleSessionComplete = () => {
    if (!currentSession) return;

    if (currentSession.type === 'work') {
      // Work session completed
      const sessionMinutes = Math.floor(currentSession.duration / 60);
      saveFocusData(currentSession.duration, true);
      
      // Add XP to mental domain
      const mentalDomain = userData.domains.find(d => d.id === 'mental');
      if (mentalDomain) {
        mentalDomain.xp += 50;
        userData.profile.totalXP += 50;
      }

      // Start break session
      startBreakSession();
    } else {
      // Break session completed
      setSessionState('inactive');
      setCurrentSession(null);
      progressAnim.setValue(0);
    }
  };

  const startFocusSession = (duration: number = 25 * 60) => {
    const session: FocusSession = {
      duration,
      type: 'work',
      startTime: Date.now(),
    };
    
    setCurrentSession(session);
    setTimeLeft(duration);
    setSessionState('active');
    progressAnim.setValue(0);
  };

  const startBreakSession = () => {
    const breakSession: FocusSession = {
      duration: 5 * 60, // 5 minutes
      type: 'break',
      startTime: Date.now(),
    };
    
    setCurrentSession(breakSession);
    setTimeLeft(5 * 60);
    setSessionState('break');
    progressAnim.setValue(0);
  };

  const pauseSession = () => {
    setSessionState('paused');
  };

  const resumeSession = () => {
    setSessionState(currentSession?.type === 'work' ? 'active' : 'break');
  };

  const stopSession = () => {
    setSessionState('inactive');
    setCurrentSession(null);
    setTimeLeft(0);
    progressAnim.setValue(0);
  };

  const skipBreak = () => {
    setSessionState('inactive');
    setCurrentSession(null);
    progressAnim.setValue(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getProgress = () => {
    if (!currentSession || timeLeft === 0) return 0;
    return ((currentSession.duration - timeLeft) / currentSession.duration) * 100;
  };

  const renderInactiveState = () => (
    <View style={styles.inactiveContainer}>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Clock size={16} color="#4DABF7" strokeWidth={1.5} />
          <Text style={styles.statText}>
            Today's Focus: {formatTotalTime(totalFocusToday)}
          </Text>
        </View>
        {focusStreak > 0 && (
          <View style={styles.statItem}>
            <Flame size={16} color="#FF6B6B" strokeWidth={1.5} />
            <Text style={styles.statText}>{focusStreak} day streak</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => startFocusSession()}
        activeOpacity={0.8}
      >
        <Play size={20} color="#FFFFFF" strokeWidth={1.5} />
        <Text style={styles.primaryButtonText}>Start Focus Session</Text>
      </TouchableOpacity>

      <View style={styles.quickButtons}>
        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => startFocusSession(25 * 60)}
          activeOpacity={0.7}
        >
          <Text style={styles.quickButtonText}>25min</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => startFocusSession(45 * 60)}
          activeOpacity={0.7}
        >
          <Text style={styles.quickButtonText}>45min</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => startFocusSession(90 * 60)}
          activeOpacity={0.7}
        >
          <Text style={styles.quickButtonText}>90min</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderActiveState = () => (
    <Animated.View style={[styles.activeContainer, { transform: [{ scale: pulseAnim }] }]}>
      <View style={styles.timerContainer}>
        <View style={styles.circularProgress}>
          <Animated.View
            style={[
              styles.progressRing,
              {
                transform: [{
                  rotate: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  })
                }]
              }
            ]}
          />
          <View style={styles.timerContent}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timerLabel}>
              {currentSession?.type === 'work' ? 'Deep Work' : 'Break Time'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={sessionState === 'paused' ? resumeSession : pauseSession}
          activeOpacity={0.8}
        >
          {sessionState === 'paused' ? (
            <Play size={18} color="#FFFFFF" strokeWidth={1.5} />
          ) : (
            <Pause size={18} color="#FFFFFF" strokeWidth={1.5} />
          )}
          <Text style={styles.controlButtonText}>
            {sessionState === 'paused' ? 'Resume' : 'Pause'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.stopButton]}
          onPress={currentSession?.type === 'break' ? skipBreak : stopSession}
          activeOpacity={0.8}
        >
          <Square size={18} color="#FF6B6B" strokeWidth={1.5} />
          <Text style={[styles.controlButtonText, styles.stopButtonText]}>
            {currentSession?.type === 'break' ? 'Skip' : 'Stop'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Target size={20} color="#4DABF7" strokeWidth={1.5} />
          <Text style={styles.title}>Focus Mode</Text>
        </View>
      </View>

      {sessionState === 'inactive' ? renderInactiveState() : renderActiveState()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  inactiveContainer: {
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4DABF7',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 16,
    gap: 8,
    minHeight: 56,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickButton: {
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  quickButtonText: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '600',
  },
  activeContainer: {
    alignItems: 'center',
  },
  timerContainer: {
    marginBottom: 24,
  },
  circularProgress: {
    width: 160,
    height: 160,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    borderColor: '#4DABF7',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '-90deg' }],
  },
  timerContent: {
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 80,
    width: 140,
    height: 140,
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#333333',
  },
  timerText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  timerLabel: {
    fontSize: 12,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4DABF7',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  controlButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  stopButton: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#333333',
  },
  stopButtonText: {
    color: '#FF6B6B',
  },
});
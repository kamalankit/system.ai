import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Platform } from 'react-native';
import { Timer, Play, Pause, Square, Brain } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userData } from '@/data/mockData';

interface FocusTimerProps {
  style?: any;
}

export default function FocusTimer({ style }: FocusTimerProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [totalFocusToday, setTotalFocusToday] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadTodaysFocusTime();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      startPulseAnimation();
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return 25 * 60; // Reset to 25 minutes
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      stopPulseAnimation();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const loadTodaysFocusTime = async () => {
    try {
      const today = new Date().toDateString();
      const storedData = await AsyncStorage.getItem('focusTimeData');
      
      if (storedData) {
        const { date, totalTime } = JSON.parse(storedData);
        if (date === today) {
          setTotalFocusToday(totalTime);
        }
      }
    } catch (error) {
      console.error('Error loading focus time:', error);
    }
  };

  const saveFocusTime = async (additionalTime: number) => {
    try {
      const today = new Date().toDateString();
      const newTotal = totalFocusToday + additionalTime;
      
      await AsyncStorage.setItem('focusTimeData', JSON.stringify({
        date: today,
        totalTime: newTotal,
      }));
      
      setTotalFocusToday(newTotal);
    } catch (error) {
      console.error('Error saving focus time:', error);
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
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
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleSessionComplete = () => {
    setIsActive(false);
    
    // Add 25 minutes (1500 seconds) to today's total
    saveFocusTime(1500);
    
    // Add XP to mental domain
    const mentalDomain = userData.domains.find(d => d.id === 'mental');
    if (mentalDomain) {
      mentalDomain.xp += 50;
      userData.profile.totalXP += 50;
    }
    
    // Could trigger notification here in a real app
    console.log('Focus session completed! +50 XP');
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
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
    return ((25 * 60 - timeLeft) / (25 * 60)) * 100;
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={() => setShowModal(true)}
        activeOpacity={0.8}
      >
        <Animated.View 
          style={[
            styles.iconContainer,
            isActive && { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <Timer size={16} color="#4DABF7" strokeWidth={1.5} />
        </Animated.View>
        <Text style={styles.label}>Focus</Text>
        <Text style={styles.value}>
          {isActive ? formatTime(timeLeft) : formatTotalTime(totalFocusToday) + ' today'}
        </Text>
      </TouchableOpacity>

      {/* Timer Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowModal(false)}
      >
        <BlurView intensity={20} style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowModal(false)}
          />
          
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Brain size={24} color="#4DABF7" strokeWidth={1.5} />
                <Text style={styles.modalTitle}>Deep Work Session</Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Circular Timer */}
            <View style={styles.timerContainer}>
              <View style={styles.circularTimer}>
                <View style={styles.progressRing}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        transform: [{ 
                          rotate: `${(getProgress() * 3.6)}deg` 
                        }] 
                      }
                    ]} 
                  />
                </View>
                <View style={styles.timerContent}>
                  <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                  <Text style={styles.timerLabel}>
                    {isActive ? 'Focus Time' : 'Ready to Focus'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={resetTimer}
                activeOpacity={0.8}
              >
                <Square size={20} color="#A6A6A6" strokeWidth={1.5} />
                <Text style={styles.controlButtonText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.playButton, isActive && styles.pauseButton]}
                onPress={toggleTimer}
                activeOpacity={0.8}
              >
                {isActive ? (
                  <Pause size={24} color="#FFFFFF" strokeWidth={1.5} />
                ) : (
                  <Play size={24} color="#FFFFFF" strokeWidth={1.5} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setShowModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.controlButtonText}>Close</Text>
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.stats}>
              <Text style={styles.statsText}>
                Today's Focus: {formatTotalTime(totalFocusToday)}
              </Text>
              <Text style={styles.statsSubtext}>
                Complete 25min session for +50 Mental XP
              </Text>
            </View>
          </View>
        </BlurView>
      </Modal>
    </>
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
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#A6A6A6',
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#111111',
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 32,
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#A6A6A6',
    fontWeight: '600',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  circularTimer: {
    width: 200,
    height: 200,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: '#333333',
  },
  progressFill: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: '#4DABF7',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '-90deg' }],
  },
  timerContent: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 20,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  controlButtonText: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '600',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4DABF7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: '#FF6B6B',
  },
  stats: {
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  statsSubtext: {
    fontSize: 12,
    color: '#A6A6A6',
    textAlign: 'center',
  },
});
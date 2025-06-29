import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { CircleCheck as CheckCircle, Circle, Flame, Droplets, BookOpen, Heart, Users, DollarSign } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userData } from '@/data/mockData';

interface Habit {
  id: string;
  name: string;
  domain: string;
  icon: any;
  color: string;
  xp: number;
}

const defaultHabits: Habit[] = [
  {
    id: 'water',
    name: 'Drink 8 glasses water',
    domain: 'physical',
    icon: Droplets,
    color: '#4DABF7',
    xp: 20,
  },
  {
    id: 'reading',
    name: '10 minutes reading',
    domain: 'mental',
    icon: BookOpen,
    color: '#4DABF7',
    xp: 25,
  },
  {
    id: 'gratitude',
    name: 'Gratitude note',
    domain: 'emotional',
    icon: Heart,
    color: '#51CF66',
    xp: 20,
  },
  {
    id: 'connect',
    name: 'Connect with someone',
    domain: 'social',
    icon: Users,
    color: '#FFB366',
    xp: 30,
  },
  {
    id: 'budget',
    name: 'Budget check',
    domain: 'financial',
    icon: DollarSign,
    color: '#9775FA',
    xp: 25,
  },
];

interface HabitData {
  completed: boolean;
  streak: number;
  lastCompleted?: string;
}

interface QuickHabitTrackerProps {
  style?: any;
}

export default function QuickHabitTracker({ style }: QuickHabitTrackerProps) {
  const [habitData, setHabitData] = useState<{ [key: string]: HabitData }>({});
  const [checkAnimations] = useState(
    defaultHabits.reduce((acc, habit) => {
      acc[habit.id] = new Animated.Value(1);
      return acc;
    }, {} as { [key: string]: Animated.Value })
  );

  useEffect(() => {
    loadHabitData();
  }, []);

  const loadHabitData = async () => {
    try {
      const today = new Date().toDateString();
      const storedData = await AsyncStorage.getItem('habitData');
      
      if (storedData) {
        const data = JSON.parse(storedData);
        
        // Reset completed status if it's a new day
        const updatedData = { ...data };
        Object.keys(updatedData).forEach(habitId => {
          if (updatedData[habitId].lastCompleted !== today) {
            updatedData[habitId].completed = false;
          }
        });
        
        setHabitData(updatedData);
      } else {
        // Initialize with default data
        const initialData = defaultHabits.reduce((acc, habit) => {
          acc[habit.id] = {
            completed: false,
            streak: 0,
          };
          return acc;
        }, {} as { [key: string]: HabitData });
        
        setHabitData(initialData);
      }
    } catch (error) {
      console.error('Error loading habit data:', error);
    }
  };

  const saveHabitData = async (newData: { [key: string]: HabitData }) => {
    try {
      await AsyncStorage.setItem('habitData', JSON.stringify(newData));
    } catch (error) {
      console.error('Error saving habit data:', error);
    }
  };

  const toggleHabit = async (habitId: string) => {
    const habit = defaultHabits.find(h => h.id === habitId);
    if (!habit) return;

    const today = new Date().toDateString();
    const currentData = habitData[habitId] || { completed: false, streak: 0 };
    const wasCompleted = currentData.completed;

    // Animate the check
    Animated.sequence([
      Animated.timing(checkAnimations[habitId], {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(checkAnimations[habitId], {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    const newData = {
      ...habitData,
      [habitId]: {
        completed: !wasCompleted,
        streak: !wasCompleted ? currentData.streak + 1 : Math.max(0, currentData.streak - 1),
        lastCompleted: !wasCompleted ? today : currentData.lastCompleted,
      },
    };

    setHabitData(newData);
    await saveHabitData(newData);

    // Add/remove XP
    if (!wasCompleted) {
      // Add XP to domain and total
      const domain = userData.domains.find(d => d.id === habit.domain);
      if (domain) {
        domain.xp += habit.xp;
        userData.profile.totalXP += habit.xp;
      }
    } else {
      // Remove XP (optional - you might not want to do this)
      const domain = userData.domains.find(d => d.id === habit.domain);
      if (domain) {
        domain.xp = Math.max(0, domain.xp - habit.xp);
        userData.profile.totalXP = Math.max(0, userData.profile.totalXP - habit.xp);
      }
    }
  };

  const getCompletedCount = () => {
    return Object.values(habitData).filter(data => data.completed).length;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Habits</Text>
        <View style={styles.progressIndicator}>
          <Text style={styles.progressText}>
            {getCompletedCount()}/{defaultHabits.length}
          </Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.habitsContainer}
      >
        {defaultHabits.map((habit) => {
          const Icon = habit.icon;
          const data = habitData[habit.id] || { completed: false, streak: 0 };
          
          return (
            <Animated.View
              key={habit.id}
              style={[
                styles.habitCard,
                { transform: [{ scale: checkAnimations[habit.id] }] }
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.habitContent,
                  data.completed && styles.habitContentCompleted,
                ]}
                onPress={() => toggleHabit(habit.id)}
                activeOpacity={0.8}
              >
                <View style={styles.habitHeader}>
                  <View style={[styles.habitIcon, { backgroundColor: habit.color + '20' }]}>
                    <Icon size={16} color={habit.color} strokeWidth={1.5} />
                  </View>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => toggleHabit(habit.id)}
                  >
                    {data.completed ? (
                      <CheckCircle size={20} color="#51CF66" strokeWidth={1.5} />
                    ) : (
                      <Circle size={20} color="#333333" strokeWidth={1.5} />
                    )}
                  </TouchableOpacity>
                </View>

                <Text style={[
                  styles.habitName,
                  data.completed && styles.habitNameCompleted,
                ]}>
                  {habit.name}
                </Text>

                <View style={styles.habitFooter}>
                  <View style={styles.streakContainer}>
                    <Flame size={12} color="#FF6B6B" strokeWidth={1.5} />
                    <Text style={styles.streakText}>{data.streak}</Text>
                  </View>
                  <Text style={styles.xpText}>+{habit.xp} XP</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressIndicator: {
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#333333',
  },
  progressText: {
    fontSize: 14,
    color: '#4DABF7',
    fontWeight: '600',
  },
  habitsContainer: {
    paddingRight: 24,
  },
  habitCard: {
    marginRight: 16,
  },
  habitContent: {
    width: 140,
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  habitContentCompleted: {
    borderColor: '#51CF66',
    backgroundColor: '#51CF66' + '10',
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  habitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    padding: 2,
  },
  habitName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 12,
    lineHeight: 18,
  },
  habitNameCompleted: {
    color: '#51CF66',
  },
  habitFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
    marginLeft: 4,
  },
  xpText: {
    fontSize: 12,
    color: '#4DABF7',
    fontWeight: '600',
  },
});
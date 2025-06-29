import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Zap, Brain, Target, Calendar, CircleCheck as CheckCircle, Circle, TrendingUp, Clock, Flame } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SystemData {
  motivationMode: boolean;
  dailyChecks: { [date: string]: boolean[] };
  systemStreak: number;
  lastCheckDate: string;
}

interface DailyCheck {
  id: string;
  title: string;
  description: string;
  category: 'mindset' | 'planning' | 'execution' | 'review';
  color: string;
}

export default function SystemScreen() {
  const router = useRouter();
  const [systemData, setSystemData] = useState<SystemData>({
    motivationMode: false,
    dailyChecks: {},
    systemStreak: 0,
    lastCheckDate: '',
  });
  const [todayChecks, setTodayChecks] = useState<boolean[]>([]);

  const dailySystemChecks: DailyCheck[] = [
    {
      id: 'morning_routine',
      title: 'Morning System Activated',
      description: 'Completed morning routine without relying on motivation',
      category: 'execution',
      color: '#4DABF7',
    },
    {
      id: 'planning_review',
      title: 'Daily Plan Review',
      description: 'Reviewed and adjusted daily plan based on systems',
      category: 'planning',
      color: '#51CF66',
    },
    {
      id: 'decision_framework',
      title: 'Decision Framework Used',
      description: 'Made decisions using logic and systems, not emotions',
      category: 'mindset',
      color: '#FFB366',
    },
    {
      id: 'habit_execution',
      title: 'Core Habits Executed',
      description: 'Completed core habits regardless of motivation level',
      category: 'execution',
      color: '#9775FA',
    },
    {
      id: 'system_adjustment',
      title: 'System Optimization',
      description: 'Identified and implemented system improvements',
      category: 'review',
      color: '#FFC107',
    },
    {
      id: 'motivation_independence',
      title: 'Motivation Independence',
      description: 'Acted without waiting for motivation to strike',
      category: 'mindset',
      color: '#FF6B6B',
    },
  ];

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    try {
      const stored = await AsyncStorage.getItem('systemData');
      if (stored) {
        const data = JSON.parse(stored);
        setSystemData(data);
        
        const today = new Date().toDateString();
        const checks = data.dailyChecks[today] || new Array(dailySystemChecks.length).fill(false);
        setTodayChecks(checks);
      } else {
        const initialChecks = new Array(dailySystemChecks.length).fill(false);
        setTodayChecks(initialChecks);
      }
    } catch (error) {
      console.error('Error loading system data:', error);
    }
  };

  const saveSystemData = async (data: SystemData) => {
    try {
      await AsyncStorage.setItem('systemData', JSON.stringify(data));
      setSystemData(data);
    } catch (error) {
      console.error('Error saving system data:', error);
    }
  };

  const toggleCheck = (index: number) => {
    const newChecks = [...todayChecks];
    newChecks[index] = !newChecks[index];
    setTodayChecks(newChecks);

    const today = new Date().toDateString();
    const updatedData = {
      ...systemData,
      dailyChecks: {
        ...systemData.dailyChecks,
        [today]: newChecks,
      },
      lastCheckDate: today,
    };

    // Calculate streak
    const completedToday = newChecks.filter(Boolean).length;
    const totalChecks = newChecks.length;
    const completionRate = completedToday / totalChecks;

    if (completionRate >= 0.8) { // 80% completion threshold
      if (systemData.lastCheckDate !== today) {
        updatedData.systemStreak = systemData.systemStreak + 1;
      }
    } else if (completedToday === 0) {
      updatedData.systemStreak = 0;
    }

    saveSystemData(updatedData);
  };

  const toggleMotivationMode = () => {
    const updatedData = {
      ...systemData,
      motivationMode: !systemData.motivationMode,
    };
    saveSystemData(updatedData);
  };

  const getCompletionRate = () => {
    const completed = todayChecks.filter(Boolean).length;
    return Math.round((completed / todayChecks.length) * 100);
  };

  const getCategoryStats = () => {
    const categories = ['mindset', 'planning', 'execution', 'review'];
    return categories.map(category => {
      const categoryChecks = dailySystemChecks
        .map((check, index) => ({ check, completed: todayChecks[index] }))
        .filter(item => item.check.category === category);
      
      const completed = categoryChecks.filter(item => item.completed).length;
      const total = categoryChecks.length;
      
      return {
        category,
        completed,
        total,
        rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>System Over Motivation</Text>
          <Text style={styles.headerSubtitle}>Build bulletproof systems</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mode Toggle */}
        <View style={styles.modeSection}>
          <View style={styles.modeCard}>
            <View style={styles.modeHeader}>
              <View style={styles.modeIcon}>
                {systemData.motivationMode ? (
                  <Zap size={24} color="#FFB366" strokeWidth={1.5} />
                ) : (
                  <Brain size={24} color="#4DABF7" strokeWidth={1.5} />
                )}
              </View>
              <View style={styles.modeInfo}>
                <Text style={styles.modeTitle}>
                  {systemData.motivationMode ? 'Motivation Mode' : 'System Mode'}
                </Text>
                <Text style={styles.modeDescription}>
                  {systemData.motivationMode 
                    ? 'Relying on feelings and motivation'
                    : 'Operating on systems and logic'
                  }
                </Text>
              </View>
              <Switch
                value={systemData.motivationMode}
                onValueChange={toggleMotivationMode}
                trackColor={{ false: '#4DABF7', true: '#FFB366' }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            {!systemData.motivationMode && (
              <View style={styles.systemBenefits}>
                <Text style={styles.benefitsTitle}>System Mode Benefits:</Text>
                <Text style={styles.benefitItem}>• Consistent performance regardless of mood</Text>
                <Text style={styles.benefitItem}>• Reduced decision fatigue</Text>
                <Text style={styles.benefitItem}>• Predictable progress</Text>
                <Text style={styles.benefitItem}>• Emotional independence</Text>
              </View>
            )}
          </View>
        </View>

        {/* Daily Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Today's System Performance</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Target size={20} color="#4DABF7" strokeWidth={1.5} />
              <Text style={styles.statValue}>{getCompletionRate()}%</Text>
              <Text style={styles.statLabel}>Completion</Text>
            </View>
            <View style={styles.statCard}>
              <Flame size={20} color="#FF6B6B" strokeWidth={1.5} />
              <Text style={styles.statValue}>{systemData.systemStreak}</Text>
              <Text style={styles.statLabel}>System Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Clock size={20} color="#51CF66" strokeWidth={1.5} />
              <Text style={styles.statValue}>{todayChecks.filter(Boolean).length}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          <View style={styles.categoryGrid}>
            {getCategoryStats().map((stat) => (
              <View key={stat.category} style={styles.categoryCard}>
                <Text style={styles.categoryName}>
                  {stat.category.charAt(0).toUpperCase() + stat.category.slice(1)}
                </Text>
                <Text style={styles.categoryRate}>{stat.rate}%</Text>
                <Text style={styles.categoryProgress}>
                  {stat.completed}/{stat.total}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Daily System Checks */}
        <View style={styles.checksSection}>
          <Text style={styles.sectionTitle}>Daily System Checks</Text>
          <View style={styles.checksList}>
            {dailySystemChecks.map((check, index) => (
              <TouchableOpacity
                key={check.id}
                style={[
                  styles.checkCard,
                  todayChecks[index] && styles.checkCardCompleted
                ]}
                onPress={() => toggleCheck(index)}
                activeOpacity={0.8}
              >
                <View style={styles.checkHeader}>
                  <View style={[styles.checkIcon, { backgroundColor: check.color + '20' }]}>
                    {todayChecks[index] ? (
                      <CheckCircle size={20} color={check.color} strokeWidth={1.5} />
                    ) : (
                      <Circle size={20} color={check.color} strokeWidth={1.5} />
                    )}
                  </View>
                  <View style={styles.checkInfo}>
                    <Text style={[
                      styles.checkTitle,
                      todayChecks[index] && styles.checkTitleCompleted
                    ]}>
                      {check.title}
                    </Text>
                    <Text style={styles.checkDescription}>
                      {check.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* System Principles */}
        <View style={styles.principlesSection}>
          <Text style={styles.sectionTitle}>Core System Principles</Text>
          <View style={styles.principlesList}>
            <View style={styles.principleCard}>
              <Text style={styles.principleTitle}>1. Systems > Goals</Text>
              <Text style={styles.principleText}>
                Focus on the process, not just the outcome. Systems create lasting change.
              </Text>
            </View>
            <View style={styles.principleCard}>
              <Text style={styles.principleTitle}>2. Consistency > Intensity</Text>
              <Text style={styles.principleText}>
                Small daily actions compound over time. Consistency beats sporadic intensity.
              </Text>
            </View>
            <View style={styles.principleCard}>
              <Text style={styles.principleTitle}>3. Logic > Emotion</Text>
              <Text style={styles.principleText}>
                Make decisions based on data and systems, not temporary emotions.
              </Text>
            </View>
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#A6A6A6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  modeSection: {
    marginBottom: 32,
  },
  modeCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
    color: '#A6A6A6',
  },
  systemBenefits: {
    backgroundColor: '#161616',
    borderRadius: 12,
    padding: 16,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4DABF7',
    marginBottom: 12,
  },
  benefitItem: {
    fontSize: 14,
    color: '#A6A6A6',
    marginBottom: 4,
    lineHeight: 20,
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#A6A6A6',
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  categoryRate: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4DABF7',
    marginBottom: 4,
  },
  categoryProgress: {
    fontSize: 12,
    color: '#A6A6A6',
  },
  checksSection: {
    marginBottom: 32,
  },
  checksList: {
    gap: 12,
  },
  checkCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  checkCardCompleted: {
    borderColor: '#51CF66',
    backgroundColor: '#51CF66' + '10',
  },
  checkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  checkInfo: {
    flex: 1,
  },
  checkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  checkTitleCompleted: {
    color: '#51CF66',
  },
  checkDescription: {
    fontSize: 14,
    color: '#A6A6A6',
    lineHeight: 20,
  },
  principlesSection: {
    marginBottom: 32,
  },
  principlesList: {
    gap: 16,
  },
  principleCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  principleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4DABF7',
    marginBottom: 8,
  },
  principleText: {
    fontSize: 14,
    color: '#A6A6A6',
    lineHeight: 20,
  },
});
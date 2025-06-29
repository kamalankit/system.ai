import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Plus, 
  Target, 
  Calendar, 
  TrendingUp, 
  CircleCheck as CheckCircle, 
  Circle,
  Trash2,
  Trophy,
  Flame
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WeeklyGoal {
  id: string;
  title: string;
  domain: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  createdAt: Date;
}

const domains = [
  { id: 'physical', name: 'Physical', color: '#FF6B6B' },
  { id: 'mental', name: 'Mental', color: '#4DABF7' },
  { id: 'emotional', name: 'Emotional', color: '#51CF66' },
  { id: 'social', name: 'Social', color: '#FFB366' },
  { id: 'financial', name: 'Financial', color: '#9775FA' },
  { id: 'spiritual', name: 'Spiritual', color: '#FFC107' },
];

export default function WeeklyGoalsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDomain, setNewGoalDomain] = useState('physical');
  const [newGoalTarget, setNewGoalTarget] = useState('5');

  useEffect(() => {
    loadWeeklyGoals();
  }, []);

  const loadWeeklyGoals = async () => {
    try {
      const stored = await AsyncStorage.getItem('weeklyGoals');
      if (stored) {
        const parsedGoals = JSON.parse(stored).map((goal: any) => ({
          ...goal,
          createdAt: new Date(goal.createdAt),
        }));
        setGoals(parsedGoals);
      } else {
        // Initialize with some default goals
        const defaultGoals: WeeklyGoal[] = [
          {
            id: '1',
            title: 'Complete 5 workouts',
            domain: 'physical',
            targetCount: 5,
            currentCount: 3,
            completed: false,
            createdAt: new Date(),
          },
          {
            id: '2',
            title: 'Read 3 books chapters',
            domain: 'mental',
            targetCount: 3,
            currentCount: 2,
            completed: false,
            createdAt: new Date(),
          },
          {
            id: '3',
            title: 'Connect with 2 friends',
            domain: 'social',
            targetCount: 2,
            currentCount: 2,
            completed: true,
            createdAt: new Date(),
          },
        ];
        setGoals(defaultGoals);
        await AsyncStorage.setItem('weeklyGoals', JSON.stringify(defaultGoals));
      }
    } catch (error) {
      console.error('Error loading weekly goals:', error);
    }
  };

  const saveGoals = async (updatedGoals: WeeklyGoal[]) => {
    try {
      await AsyncStorage.setItem('weeklyGoals', JSON.stringify(updatedGoals));
      setGoals(updatedGoals);
    } catch (error) {
      console.error('Error saving weekly goals:', error);
    }
  };

  const createGoal = () => {
    if (!newGoalTitle.trim()) return;

    const newGoal: WeeklyGoal = {
      id: Date.now().toString(),
      title: newGoalTitle.trim(),
      domain: newGoalDomain,
      targetCount: parseInt(newGoalTarget) || 1,
      currentCount: 0,
      completed: false,
      createdAt: new Date(),
    };

    const updatedGoals = [...goals, newGoal];
    saveGoals(updatedGoals);
    
    setNewGoalTitle('');
    setNewGoalTarget('5');
    setIsCreating(false);
  };

  const updateGoalProgress = (goalId: string, increment: boolean) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newCount = increment 
          ? Math.min(goal.currentCount + 1, goal.targetCount)
          : Math.max(goal.currentCount - 1, 0);
        
        return {
          ...goal,
          currentCount: newCount,
          completed: newCount >= goal.targetCount,
        };
      }
      return goal;
    });
    saveGoals(updatedGoals);
  };

  const deleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    saveGoals(updatedGoals);
  };

  const getDomainInfo = (domainId: string) => {
    return domains.find(d => d.id === domainId) || domains[0];
  };

  const getCompletionRate = () => {
    if (goals.length === 0) return 0;
    const completedGoals = goals.filter(goal => goal.completed).length;
    return Math.round((completedGoals / goals.length) * 100);
  };

  const getTotalProgress = () => {
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetCount, 0);
    const totalCurrent = goals.reduce((sum, goal) => sum + goal.currentCount, 0);
    return { current: totalCurrent, target: totalTarget };
  };

  const { current: totalCurrent, target: totalTarget } = getTotalProgress();

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
        <Text style={styles.headerTitle}>Weekly Goals</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsCreating(true)}
          activeOpacity={0.7}
        >
          <Plus size={20} color="#FFFFFF" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Trophy size={20} color="#FFB366" strokeWidth={1.5} />
          <Text style={styles.statValue}>{getCompletionRate()}%</Text>
          <Text style={styles.statLabel}>Completion Rate</Text>
        </View>
        
        <View style={styles.statCard}>
          <Target size={20} color="#4DABF7" strokeWidth={1.5} />
          <Text style={styles.statValue}>{totalCurrent}/{totalTarget}</Text>
          <Text style={styles.statLabel}>Total Progress</Text>
        </View>

        <View style={styles.statCard}>
          <Flame size={20} color="#FF6B6B" strokeWidth={1.5} />
          <Text style={styles.statValue}>{goals.filter(g => g.completed).length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? 88 + insets.bottom + 20 : 68 + insets.bottom + 20
        }}
      >
        {/* Create Goal Form */}
        {isCreating && (
          <View style={styles.createForm}>
            <Text style={styles.formTitle}>Create New Goal</Text>
            
            <TextInput
              style={styles.titleInput}
              placeholder="Goal title (e.g., Complete 5 workouts)"
              placeholderTextColor="#666666"
              value={newGoalTitle}
              onChangeText={setNewGoalTitle}
              autoFocus
            />

            <View style={styles.formRow}>
              <View style={styles.domainSelector}>
                <Text style={styles.formLabel}>Domain</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.domainOptions}>
                    {domains.map((domain) => (
                      <TouchableOpacity
                        key={domain.id}
                        style={[
                          styles.domainOption,
                          newGoalDomain === domain.id && styles.domainOptionSelected,
                          { borderColor: newGoalDomain === domain.id ? domain.color : '#333333' }
                        ]}
                        onPress={() => setNewGoalDomain(domain.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.domainOptionText,
                          newGoalDomain === domain.id && { color: domain.color }
                        ]}>
                          {domain.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.targetSelector}>
                <Text style={styles.formLabel}>Target</Text>
                <TextInput
                  style={styles.targetInput}
                  placeholder="5"
                  placeholderTextColor="#666666"
                  value={newGoalTarget}
                  onChangeText={setNewGoalTarget}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsCreating(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createButton}
                onPress={createGoal}
                activeOpacity={0.8}
              >
                <Text style={styles.createButtonText}>Create Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Goals List */}
        <View style={styles.goalsList}>
          {goals.map((goal) => {
            const domain = getDomainInfo(goal.domain);
            const progressPercentage = (goal.currentCount / goal.targetCount) * 100;
            
            return (
              <View key={goal.id} style={[
                styles.goalCard,
                goal.completed && styles.goalCardCompleted
              ]}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalInfo}>
                    <View style={styles.goalTitleRow}>
                      <Text style={[
                        styles.goalTitle,
                        goal.completed && styles.goalTitleCompleted
                      ]}>
                        {goal.title}
                      </Text>
                      <View style={[styles.domainBadge, { backgroundColor: domain.color + '20' }]}>
                        <Text style={[styles.domainBadgeText, { color: domain.color }]}>
                          {domain.name}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.goalProgress}>
                      <Text style={styles.progressText}>
                        {goal.currentCount} / {goal.targetCount}
                      </Text>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { 
                              width: `${progressPercentage}%`,
                              backgroundColor: domain.color 
                            }
                          ]} 
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.goalActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => updateGoalProgress(goal.id, false)}
                      disabled={goal.currentCount === 0}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.actionButtonText}>-</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => updateGoalProgress(goal.id, true)}
                      disabled={goal.completed}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.actionButtonText}>+</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteGoal(goal.id)}
                      activeOpacity={0.7}
                    >
                      <Trash2 size={16} color="#FF6B6B" strokeWidth={1.5} />
                    </TouchableOpacity>
                  </View>
                </View>

                {goal.completed && (
                  <View style={styles.completedBadge}>
                    <CheckCircle size={16} color="#51CF66" strokeWidth={1.5} />
                    <Text style={styles.completedText}>Completed!</Text>
                  </View>
                )}
              </View>
            );
          })}

          {goals.length === 0 && !isCreating && (
            <View style={styles.emptyState}>
              <Target size={48} color="#333333" strokeWidth={1} />
              <Text style={styles.emptyTitle}>No Weekly Goals</Text>
              <Text style={styles.emptyDescription}>
                Create your first weekly goal to start tracking your progress
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => setIsCreating(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.emptyButtonText}>Create Goal</Text>
              </TouchableOpacity>
            </View>
          )}
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
    justifyContent: 'space-between',
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4DABF7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 16,
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
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  createForm: {
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  titleInput: {
    backgroundColor: '#161616',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  domainSelector: {
    flex: 1,
  },
  targetSelector: {
    width: 80,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  domainOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  domainOption: {
    backgroundColor: '#161616',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  domainOptionSelected: {
    backgroundColor: '#161616',
  },
  domainOptionText: {
    fontSize: 12,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  targetInput: {
    backgroundColor: '#161616',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#333333',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#A6A6A6',
    fontWeight: '600',
  },
  createButton: {
    flex: 1,
    backgroundColor: '#4DABF7',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  goalsList: {
    gap: 16,
  },
  goalCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  goalCardCompleted: {
    borderColor: '#51CF66',
    backgroundColor: '#51CF66' + '10',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  goalInfo: {
    flex: 1,
    marginRight: 16,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  goalTitleCompleted: {
    color: '#A6A6A6',
    textDecorationLine: 'line-through',
  },
  domainBadge: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  domainBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '500',
    minWidth: 40,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#333333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalActions: {
    flexDirection: 'column',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B6B' + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    gap: 8,
  },
  completedText: {
    fontSize: 14,
    color: '#51CF66',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#A6A6A6',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#4DABF7',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
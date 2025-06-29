import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Crosshair, 
  Target, 
  Calendar, 
  TrendingUp, 
  Plus, 
  Minus, 
  CircleCheck as CheckCircle, 
  Circle, 
  Star, 
  Brain, 
  Heart, 
  Users, 
  DollarSign, 
  Zap,
  Eye,
  Map,
  Compass,
  Flag
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Goal {
  id: string;
  title: string;
  description: string;
  domain: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: '1week' | '1month' | '3months' | '6months' | '1year';
  progress: number;
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'completed' | 'paused';
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
}

interface Vision {
  id: string;
  domain: string;
  statement: string;
  keyValues: string[];
  updatedAt: Date;
}

interface ClarityData {
  goals: Goal[];
  visions: Vision[];
  focusAreas: string[];
  clarityScore: number;
  lastReview: Date;
}

export default function ClarityDirectionScreen() {
  const router = useRouter();
  const [clarityData, setClarityData] = useState<ClarityData>({
    goals: [],
    visions: [],
    focusAreas: [],
    clarityScore: 0,
    lastReview: new Date(),
  });
  const [activeTab, setActiveTab] = useState<'goals' | 'vision' | 'focus'>('goals');
  const [isCreating, setIsCreating] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    domain: 'physical',
    priority: 'medium' as const,
    timeframe: '1month' as const,
  });

  const domains = [
    { id: 'physical', name: 'Physical', icon: Target, color: '#FF6B6B' },
    { id: 'mental', name: 'Mental', icon: Brain, color: '#4DABF7' },
    { id: 'emotional', name: 'Emotional', icon: Heart, color: '#51CF66' },
    { id: 'social', name: 'Social', icon: Users, color: '#FFB366' },
    { id: 'financial', name: 'Financial', icon: DollarSign, color: '#9775FA' },
    { id: 'spiritual', name: 'Spiritual', icon: Star, color: '#FFC107' },
  ];

  const timeframes = [
    { id: '1week', label: '1 Week', color: '#FF6B6B' },
    { id: '1month', label: '1 Month', color: '#4DABF7' },
    { id: '3months', label: '3 Months', color: '#51CF66' },
    { id: '6months', label: '6 Months', color: '#FFB366' },
    { id: '1year', label: '1 Year', color: '#9775FA' },
  ];

  const priorities = [
    { id: 'high', label: 'High', color: '#FF6B6B' },
    { id: 'medium', label: 'Medium', color: '#FFB366' },
    { id: 'low', label: 'Low', color: '#51CF66' },
  ];

  useEffect(() => {
    loadClarityData();
  }, []);

  const loadClarityData = async () => {
    try {
      const stored = await AsyncStorage.getItem('clarityData');
      if (stored) {
        const data = JSON.parse(stored);
        setClarityData({
          ...data,
          lastReview: new Date(data.lastReview),
          goals: data.goals.map((goal: any) => ({
            ...goal,
            createdAt: new Date(goal.createdAt),
            updatedAt: new Date(goal.updatedAt),
          })),
          visions: data.visions.map((vision: any) => ({
            ...vision,
            updatedAt: new Date(vision.updatedAt),
          })),
        });
      }
    } catch (error) {
      console.error('Error loading clarity data:', error);
    }
  };

  const saveClarityData = async (data: ClarityData) => {
    try {
      await AsyncStorage.setItem('clarityData', JSON.stringify(data));
      setClarityData(data);
    } catch (error) {
      console.error('Error saving clarity data:', error);
    }
  };

  const calculateClarityScore = (data: ClarityData) => {
    let score = 0;
    
    // Goals contribution (40%)
    const activeGoals = data.goals.filter(g => g.status === 'active');
    if (activeGoals.length > 0) {
      const avgProgress = activeGoals.reduce((sum, goal) => sum + goal.progress, 0) / activeGoals.length;
      score += (avgProgress / 100) * 40;
    }
    
    // Vision statements (30%)
    const visionCoverage = data.visions.length / domains.length;
    score += Math.min(visionCoverage, 1) * 30;
    
    // Focus areas (20%)
    const focusScore = Math.min(data.focusAreas.length / 3, 1) * 20;
    score += focusScore;
    
    // Recent review (10%)
    const daysSinceReview = (Date.now() - data.lastReview.getTime()) / (1000 * 60 * 60 * 24);
    const reviewScore = Math.max(0, 1 - (daysSinceReview / 7)) * 10;
    score += reviewScore;
    
    return Math.round(score);
  };

  const createGoal = () => {
    if (!newGoal.title.trim() || !newGoal.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      domain: newGoal.domain,
      priority: newGoal.priority,
      timeframe: newGoal.timeframe,
      progress: 0,
      milestones: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
    };

    const updatedData = {
      ...clarityData,
      goals: [...clarityData.goals, goal],
    };
    updatedData.clarityScore = calculateClarityScore(updatedData);

    saveClarityData(updatedData);
    setIsCreating(false);
    setNewGoal({
      title: '',
      description: '',
      domain: 'physical',
      priority: 'medium',
      timeframe: '1month',
    });
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    const updatedData = {
      ...clarityData,
      goals: clarityData.goals.map(goal =>
        goal.id === goalId
          ? { ...goal, progress, updatedAt: new Date() }
          : goal
      ),
    };
    updatedData.clarityScore = calculateClarityScore(updatedData);
    saveClarityData(updatedData);
  };

  const getDomainInfo = (domainId: string) => {
    return domains.find(d => d.id === domainId) || domains[0];
  };

  const getTimeframeInfo = (timeframeId: string) => {
    return timeframes.find(t => t.id === timeframeId) || timeframes[1];
  };

  const getPriorityInfo = (priorityId: string) => {
    return priorities.find(p => p.id === priorityId) || priorities[1];
  };

  const renderGoalsTab = () => (
    <View style={styles.tabContent}>
      {/* Goals Header */}
      <View style={styles.goalsHeader}>
        <View style={styles.goalsStats}>
          <View style={styles.goalsStat}>
            <Text style={styles.goalsStatValue}>{clarityData.goals.filter(g => g.status === 'active').length}</Text>
            <Text style={styles.goalsStatLabel}>Active Goals</Text>
          </View>
          <View style={styles.goalsStat}>
            <Text style={styles.goalsStatValue}>{clarityData.goals.filter(g => g.status === 'completed').length}</Text>
            <Text style={styles.goalsStatLabel}>Completed</Text>
          </View>
          <View style={styles.goalsStat}>
            <Text style={styles.goalsStatValue}>{clarityData.clarityScore}%</Text>
            <Text style={styles.goalsStatLabel}>Clarity Score</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsCreating(true)}
          activeOpacity={0.8}
        >
          <Plus size={20} color="#FFFFFF" strokeWidth={1.5} />
          <Text style={styles.addButtonText}>New Goal</Text>
        </TouchableOpacity>
      </View>

      {/* Create Goal Form */}
      {isCreating && (
        <View style={styles.createForm}>
          <Text style={styles.formTitle}>Create New Goal</Text>
          
          <TextInput
            style={styles.formInput}
            placeholder="Goal title..."
            placeholderTextColor="#666666"
            value={newGoal.title}
            onChangeText={(text) => setNewGoal({ ...newGoal, title: text })}
          />
          
          <TextInput
            style={[styles.formInput, styles.formTextArea]}
            placeholder="Describe your goal in detail..."
            placeholderTextColor="#666666"
            value={newGoal.description}
            onChangeText={(text) => setNewGoal({ ...newGoal, description: text })}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          {/* Domain Selection */}
          <Text style={styles.formLabel}>Domain</Text>
          <View style={styles.optionsGrid}>
            {domains.map((domain) => {
              const Icon = domain.icon;
              return (
                <TouchableOpacity
                  key={domain.id}
                  style={[
                    styles.optionButton,
                    newGoal.domain === domain.id && styles.optionButtonSelected,
                    { borderColor: newGoal.domain === domain.id ? domain.color : '#333333' }
                  ]}
                  onPress={() => setNewGoal({ ...newGoal, domain: domain.id })}
                  activeOpacity={0.7}
                >
                  <Icon size={16} color={domain.color} strokeWidth={1.5} />
                  <Text style={styles.optionButtonText}>{domain.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Priority Selection */}
          <Text style={styles.formLabel}>Priority</Text>
          <View style={styles.optionsRow}>
            {priorities.map((priority) => (
              <TouchableOpacity
                key={priority.id}
                style={[
                  styles.optionButton,
                  newGoal.priority === priority.id && styles.optionButtonSelected,
                  { borderColor: newGoal.priority === priority.id ? priority.color : '#333333' }
                ]}
                onPress={() => setNewGoal({ ...newGoal, priority: priority.id as any })}
                activeOpacity={0.7}
              >
                <Text style={styles.optionButtonText}>{priority.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Timeframe Selection */}
          <Text style={styles.formLabel}>Timeframe</Text>
          <View style={styles.optionsRow}>
            {timeframes.map((timeframe) => (
              <TouchableOpacity
                key={timeframe.id}
                style={[
                  styles.optionButton,
                  newGoal.timeframe === timeframe.id && styles.optionButtonSelected,
                  { borderColor: newGoal.timeframe === timeframe.id ? timeframe.color : '#333333' }
                ]}
                onPress={() => setNewGoal({ ...newGoal, timeframe: timeframe.id as any })}
                activeOpacity={0.7}
              >
                <Text style={styles.optionButtonText}>{timeframe.label}</Text>
              </TouchableOpacity>
            ))}
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
        {clarityData.goals.filter(g => g.status === 'active').map((goal) => {
          const domain = getDomainInfo(goal.domain);
          const timeframe = getTimeframeInfo(goal.timeframe);
          const priority = getPriorityInfo(goal.priority);
          const Icon = domain.icon;

          return (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={[styles.goalIcon, { backgroundColor: domain.color + '20' }]}>
                  <Icon size={20} color={domain.color} strokeWidth={1.5} />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                </View>
                <View style={styles.goalBadges}>
                  <View style={[styles.priorityBadge, { backgroundColor: priority.color + '20' }]}>
                    <Text style={[styles.priorityBadgeText, { color: priority.color }]}>
                      {priority.label}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.goalProgress}>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressText}>{goal.progress}% Complete</Text>
                  <Text style={styles.timeframeText}>{timeframe.label}</Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${goal.progress}%`,
                        backgroundColor: domain.color 
                      }
                    ]} 
                  />
                </View>
              </View>

              <View style={styles.goalActions}>
                <TouchableOpacity
                  style={styles.progressButton}
                  onPress={() => updateGoalProgress(goal.id, Math.min(100, goal.progress + 10))}
                  activeOpacity={0.8}
                >
                  <Plus size={16} color="#51CF66" strokeWidth={1.5} />
                  <Text style={styles.progressButtonText}>+10%</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.progressButton}
                  onPress={() => updateGoalProgress(goal.id, Math.max(0, goal.progress - 10))}
                  activeOpacity={0.8}
                >
                  <Minus size={16} color="#FF6B6B" strokeWidth={1.5} />
                  <Text style={styles.progressButtonText}>-10%</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {clarityData.goals.filter(g => g.status === 'active').length === 0 && (
          <View style={styles.emptyState}>
            <Target size={48} color="#333333" strokeWidth={1} />
            <Text style={styles.emptyTitle}>No Active Goals</Text>
            <Text style={styles.emptyDescription}>
              Create your first goal to start building clarity and direction in your life.
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderVisionTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.visionHeader}>
        <View style={styles.visionStats}>
          <Eye size={24} color="#4DABF7" strokeWidth={1.5} />
          <Text style={styles.visionTitle}>Vision Statements</Text>
        </View>
        <Text style={styles.visionSubtitle}>
          Define your ideal future across all life domains
        </Text>
      </View>

      <View style={styles.visionGrid}>
        {domains.map((domain) => {
          const Icon = domain.icon;
          const vision = clarityData.visions.find(v => v.domain === domain.id);
          
          return (
            <View key={domain.id} style={styles.visionCard}>
              <View style={styles.visionCardHeader}>
                <View style={[styles.visionIcon, { backgroundColor: domain.color + '20' }]}>
                  <Icon size={20} color={domain.color} strokeWidth={1.5} />
                </View>
                <Text style={styles.visionDomain}>{domain.name}</Text>
              </View>
              
              {vision ? (
                <View style={styles.visionContent}>
                  <Text style={styles.visionStatement}>{vision.statement}</Text>
                  <View style={styles.visionValues}>
                    {vision.keyValues.map((value, index) => (
                      <View key={index} style={styles.valueTag}>
                        <Text style={styles.valueTagText}>{value}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.visionEmpty}>
                  <Text style={styles.visionEmptyText}>No vision defined</Text>
                  <TouchableOpacity style={styles.visionAddButton}>
                    <Plus size={16} color="#4DABF7" strokeWidth={1.5} />
                    <Text style={styles.visionAddText}>Add Vision</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderFocusTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.focusHeader}>
        <View style={styles.focusStats}>
          <Compass size={24} color="#51CF66" strokeWidth={1.5} />
          <Text style={styles.focusTitle}>Focus Areas</Text>
        </View>
        <Text style={styles.focusSubtitle}>
          Identify your top 3 focus areas for maximum impact
        </Text>
      </View>

      <View style={styles.focusContent}>
        <View style={styles.focusCards}>
          {[1, 2, 3].map((index) => {
            const focusArea = clarityData.focusAreas[index - 1];
            
            return (
              <View key={index} style={styles.focusCard}>
                <View style={styles.focusCardHeader}>
                  <Flag size={20} color="#51CF66" strokeWidth={1.5} />
                  <Text style={styles.focusCardTitle}>Focus Area #{index}</Text>
                </View>
                
                {focusArea ? (
                  <Text style={styles.focusAreaText}>{focusArea}</Text>
                ) : (
                  <View style={styles.focusEmpty}>
                    <Text style={styles.focusEmptyText}>Not defined</Text>
                    <TouchableOpacity style={styles.focusAddButton}>
                      <Plus size={16} color="#51CF66" strokeWidth={1.5} />
                      <Text style={styles.focusAddText}>Define Focus</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.focusGuidance}>
          <Text style={styles.guidanceTitle}>💡 Focus Area Guidelines</Text>
          <Text style={styles.guidanceText}>
            • Choose areas that align with your core values and long-term vision
          </Text>
          <Text style={styles.guidanceText}>
            • Focus on what will have the biggest impact on your life
          </Text>
          <Text style={styles.guidanceText}>
            • Review and adjust quarterly based on your progress
          </Text>
          <Text style={styles.guidanceText}>
            • Ensure each area is specific and actionable
          </Text>
        </View>
      </View>
    </View>
  );

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
          <Text style={styles.headerTitle}>Clarity & Direction</Text>
          <Text style={styles.headerSubtitle}>Define your path with precision</Text>
        </View>
      </View>

      {/* Clarity Score */}
      <View style={styles.clarityScore}>
        <View style={styles.scoreContainer}>
          <View style={styles.scoreIcon}>
            <Crosshair size={24} color="#FFB366" strokeWidth={1.5} />
          </View>
          <View style={styles.scoreInfo}>
            <Text style={styles.scoreValue}>{clarityData.clarityScore}%</Text>
            <Text style={styles.scoreLabel}>Clarity Score</Text>
          </View>
        </View>
        <Text style={styles.scoreDescription}>
          Your overall clarity across goals, vision, and focus areas
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'goals' && styles.tabActive]}
          onPress={() => setActiveTab('goals')}
          activeOpacity={0.7}
        >
          <Target size={16} color={activeTab === 'goals' ? '#FFFFFF' : '#A6A6A6'} strokeWidth={1.5} />
          <Text style={[styles.tabText, activeTab === 'goals' && styles.tabTextActive]}>
            Goals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'vision' && styles.tabActive]}
          onPress={() => setActiveTab('vision')}
          activeOpacity={0.7}
        >
          <Eye size={16} color={activeTab === 'vision' ? '#FFFFFF' : '#A6A6A6'} strokeWidth={1.5} />
          <Text style={[styles.tabText, activeTab === 'vision' && styles.tabTextActive]}>
            Vision
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'focus' && styles.tabActive]}
          onPress={() => setActiveTab('focus')}
          activeOpacity={0.7}
        >
          <Compass size={16} color={activeTab === 'focus' ? '#FFFFFF' : '#A6A6A6'} strokeWidth={1.5} />
          <Text style={[styles.tabText, activeTab === 'focus' && styles.tabTextActive]}>
            Focus
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'goals' && renderGoalsTab()}
        {activeTab === 'vision' && renderVisionTab()}
        {activeTab === 'focus' && renderFocusTab()}
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
    paddingBottom: 16,
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
  clarityScore: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFB366' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFB366',
    marginBottom: 2,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scoreDescription: {
    fontSize: 14,
    color: '#A6A6A6',
    lineHeight: 20,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#4DABF7',
  },
  tabText: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  tabContent: {
    paddingBottom: 100,
  },
  goalsHeader: {
    marginBottom: 24,
  },
  goalsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  goalsStat: {
    alignItems: 'center',
  },
  goalsStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  goalsStatLabel: {
    fontSize: 12,
    color: '#A6A6A6',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4DABF7',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  createForm: {
    backgroundColor: '#111111',
    borderRadius: 16,
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
  formInput: {
    backgroundColor: '#161616',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  formTextArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#333333',
    gap: 6,
  },
  optionButtonSelected: {
    backgroundColor: '#161616',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
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
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: '#A6A6A6',
    lineHeight: 20,
  },
  goalBadges: {
    alignItems: 'flex-end',
  },
  priorityBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priorityBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  goalProgress: {
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  timeframeText: {
    fontSize: 12,
    color: '#A6A6A6',
  },
  progressBar: {
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
    flexDirection: 'row',
    gap: 12,
  },
  progressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 4,
  },
  progressButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#A6A6A6',
    textAlign: 'center',
    lineHeight: 20,
  },
  visionHeader: {
    marginBottom: 24,
  },
  visionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  visionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  visionSubtitle: {
    fontSize: 14,
    color: '#A6A6A6',
    lineHeight: 20,
  },
  visionGrid: {
    gap: 16,
  },
  visionCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  visionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  visionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  visionDomain: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  visionContent: {
    gap: 12,
  },
  visionStatement: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  visionValues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  valueTag: {
    backgroundColor: '#333333',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  valueTagText: {
    fontSize: 12,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  visionEmpty: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  visionEmptyText: {
    fontSize: 14,
    color: '#A6A6A6',
    marginBottom: 12,
  },
  visionAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4DABF7' + '20',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  visionAddText: {
    fontSize: 12,
    color: '#4DABF7',
    fontWeight: '600',
  },
  focusHeader: {
    marginBottom: 24,
  },
  focusStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  focusTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  focusSubtitle: {
    fontSize: 14,
    color: '#A6A6A6',
    lineHeight: 20,
  },
  focusContent: {
    gap: 24,
  },
  focusCards: {
    gap: 16,
  },
  focusCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  focusCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  focusCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  focusAreaText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  focusEmpty: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  focusEmptyText: {
    fontSize: 14,
    color: '#A6A6A6',
    marginBottom: 12,
  },
  focusAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#51CF66' + '20',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  focusAddText: {
    fontSize: 12,
    color: '#51CF66',
    fontWeight: '600',
  },
  focusGuidance: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  guidanceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  guidanceText: {
    fontSize: 14,
    color: '#A6A6A6',
    lineHeight: 20,
    marginBottom: 8,
  },
});
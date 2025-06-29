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
import { ChevronLeft, Chrome as Home, Car, DollarSign, User, Camera, Plus, Target, Calendar, TrendingUp } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface VisualizationGoal {
  id: string;
  category: 'house_family' | 'car' | 'house_personal' | 'money' | 'physical';
  timeframe: '6months' | '1year' | '2years' | '5years' | '10years';
  description: string;
  imageUrl?: string;
  targetAmount?: number;
  createdAt: Date;
  updatedAt: Date;
  progress: number;
}

export default function VisualizationScreen() {
  const router = useRouter();
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1year');
  const [goals, setGoals] = useState<VisualizationGoal[]>([]);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);

  const timeframes = [
    { id: '6months', label: '6 Months', color: '#FF6B6B' },
    { id: '1year', label: '1 Year', color: '#4DABF7' },
    { id: '2years', label: '2 Years', color: '#51CF66' },
    { id: '5years', label: '5 Years', color: '#FFB366' },
    { id: '10years', label: '10 Years', color: '#9775FA' },
  ];

  const categories = [
    {
      id: 'house_family',
      name: 'Family Home',
      icon: Home,
      color: '#51CF66',
      placeholder: 'Describe your ideal family home...',
      hasAmount: true,
    },
    {
      id: 'car',
      name: 'Dream Car',
      icon: Car,
      color: '#4DABF7',
      placeholder: 'Describe your dream car...',
      hasAmount: true,
    },
    {
      id: 'house_personal',
      name: 'Personal House',
      icon: Home,
      color: '#FFB366',
      placeholder: 'Describe your personal space...',
      hasAmount: true,
    },
    {
      id: 'money',
      name: 'Bank Balance',
      icon: DollarSign,
      color: '#FFC107',
      placeholder: 'Financial goals and targets...',
      hasAmount: true,
    },
    {
      id: 'physical',
      name: 'Physical Form',
      icon: User,
      color: '#FF6B6B',
      placeholder: 'Describe your ideal physical appearance...',
      hasAmount: false,
    },
  ];

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem('visualizationGoals');
      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const saveGoals = async (updatedGoals: VisualizationGoal[]) => {
    try {
      await AsyncStorage.setItem('visualizationGoals', JSON.stringify(updatedGoals));
      setGoals(updatedGoals);
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  };

  const createOrUpdateGoal = (category: string, description: string, targetAmount?: number) => {
    const existingGoalIndex = goals.findIndex(
      g => g.category === category && g.timeframe === selectedTimeframe
    );

    const goalData = {
      id: existingGoalIndex >= 0 ? goals[existingGoalIndex].id : Date.now().toString(),
      category: category as VisualizationGoal['category'],
      timeframe: selectedTimeframe as VisualizationGoal['timeframe'],
      description,
      targetAmount,
      createdAt: existingGoalIndex >= 0 ? goals[existingGoalIndex].createdAt : new Date(),
      updatedAt: new Date(),
      progress: existingGoalIndex >= 0 ? goals[existingGoalIndex].progress : 0,
    };

    let updatedGoals;
    if (existingGoalIndex >= 0) {
      updatedGoals = [...goals];
      updatedGoals[existingGoalIndex] = goalData;
    } else {
      updatedGoals = [...goals, goalData];
    }

    saveGoals(updatedGoals);
    setEditingGoal(null);
  };

  const getGoalForCategory = (category: string) => {
    return goals.find(g => g.category === category && g.timeframe === selectedTimeframe);
  };

  const handleImageUpload = (category: string) => {
    Alert.alert(
      'Add Image',
      'Choose how you want to add an image for this goal',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Gallery', onPress: () => console.log('Gallery selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const filteredGoals = goals.filter(g => g.timeframe === selectedTimeframe);
  const completionRate = filteredGoals.length > 0 
    ? Math.round(filteredGoals.reduce((sum, goal) => sum + goal.progress, 0) / filteredGoals.length)
    : 0;

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
          <Text style={styles.headerTitle}>Visualization Goals</Text>
          <Text style={styles.headerSubtitle}>Create your future reality</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Target size={20} color="#4DABF7" strokeWidth={1.5} />
          <Text style={styles.statValue}>{filteredGoals.length}</Text>
          <Text style={styles.statLabel}>Active Goals</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={20} color="#51CF66" strokeWidth={1.5} />
          <Text style={styles.statValue}>{completionRate}%</Text>
          <Text style={styles.statLabel}>Completion</Text>
        </View>
        <View style={styles.statCard}>
          <Calendar size={20} color="#FFB366" strokeWidth={1.5} />
          <Text style={styles.statValue}>{selectedTimeframe}</Text>
          <Text style={styles.statLabel}>Timeline</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Timeline Selector */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timelineContainer}
          >
            {timeframes.map((timeframe) => (
              <TouchableOpacity
                key={timeframe.id}
                style={[
                  styles.timelineButton,
                  selectedTimeframe === timeframe.id && styles.timelineButtonActive,
                  { borderColor: timeframe.color }
                ]}
                onPress={() => setSelectedTimeframe(timeframe.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.timelineButtonText,
                    selectedTimeframe === timeframe.id && styles.timelineButtonTextActive,
                    selectedTimeframe === timeframe.id && { color: timeframe.color }
                  ]}
                >
                  {timeframe.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Goal Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Goal Categories</Text>
          <View style={styles.categoriesList}>
            {categories.map((category) => {
              const Icon = category.icon;
              const existingGoal = getGoalForCategory(category.id);
              const isEditing = editingGoal === category.id;

              return (
                <View key={category.id} style={styles.categoryCard}>
                  <View style={styles.categoryHeader}>
                    <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                      <Icon size={24} color={category.color} strokeWidth={1.5} />
                    </View>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      {existingGoal && (
                        <Text style={styles.categoryProgress}>
                          {existingGoal.progress}% complete
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => setEditingGoal(isEditing ? null : category.id)}
                      activeOpacity={0.7}
                    >
                      <Plus 
                        size={20} 
                        color="#A6A6A6" 
                        strokeWidth={1.5}
                        style={{ transform: [{ rotate: isEditing ? '45deg' : '0deg' }] }}
                      />
                    </TouchableOpacity>
                  </View>

                  {existingGoal && !isEditing && (
                    <View style={styles.goalDisplay}>
                      <Text style={styles.goalDescription}>{existingGoal.description}</Text>
                      {existingGoal.targetAmount && (
                        <Text style={styles.goalAmount}>
                          Target: ${existingGoal.targetAmount.toLocaleString()}
                        </Text>
                      )}
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { 
                              width: `${existingGoal.progress}%`,
                              backgroundColor: category.color 
                            }
                          ]} 
                        />
                      </View>
                    </View>
                  )}

                  {isEditing && (
                    <GoalEditor
                      category={category}
                      existingGoal={existingGoal}
                      onSave={createOrUpdateGoal}
                      onCancel={() => setEditingGoal(null)}
                      onImageUpload={() => handleImageUpload(category.id)}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface GoalEditorProps {
  category: any;
  existingGoal?: VisualizationGoal;
  onSave: (category: string, description: string, targetAmount?: number) => void;
  onCancel: () => void;
  onImageUpload: () => void;
}

function GoalEditor({ category, existingGoal, onSave, onCancel, onImageUpload }: GoalEditorProps) {
  const [description, setDescription] = useState(existingGoal?.description || '');
  const [targetAmount, setTargetAmount] = useState(
    existingGoal?.targetAmount?.toString() || ''
  );

  const handleSave = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description for your goal');
      return;
    }

    const amount = category.hasAmount && targetAmount ? parseFloat(targetAmount) : undefined;
    onSave(category.id, description.trim(), amount);
  };

  return (
    <View style={styles.editorContainer}>
      <TextInput
        style={styles.descriptionInput}
        placeholder={category.placeholder}
        placeholderTextColor="#666666"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      {category.hasAmount && (
        <TextInput
          style={styles.amountInput}
          placeholder="Target amount ($)"
          placeholderTextColor="#666666"
          value={targetAmount}
          onChangeText={setTargetAmount}
          keyboardType="numeric"
        />
      )}

      <TouchableOpacity
        style={styles.imageButton}
        onPress={onImageUpload}
        activeOpacity={0.8}
      >
        <Camera size={20} color="#A6A6A6" strokeWidth={1.5} />
        <Text style={styles.imageButtonText}>Add Image</Text>
      </TouchableOpacity>

      <View style={styles.editorActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Save Goal</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  timelineSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  timelineContainer: {
    paddingRight: 24,
  },
  timelineButton: {
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#333333',
  },
  timelineButtonActive: {
    backgroundColor: '#161616',
  },
  timelineButtonText: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '600',
  },
  timelineButtonTextActive: {
    fontWeight: '700',
  },
  categoriesSection: {
    marginBottom: 32,
  },
  categoriesList: {
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  categoryProgress: {
    fontSize: 14,
    color: '#51CF66',
    fontWeight: '500',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalDisplay: {
    marginTop: 8,
  },
  goalDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 8,
  },
  goalAmount: {
    fontSize: 16,
    color: '#4DABF7',
    fontWeight: '600',
    marginBottom: 12,
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
  editorContainer: {
    marginTop: 8,
    gap: 12,
  },
  descriptionInput: {
    backgroundColor: '#161616',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#333333',
  },
  amountInput: {
    backgroundColor: '#161616',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#333333',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#161616',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
    gap: 8,
  },
  imageButtonText: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  editorActions: {
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
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4DABF7',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
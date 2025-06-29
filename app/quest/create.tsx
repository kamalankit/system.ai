import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Save, Target, Brain, Heart, Users, Star, DollarSign, Clock, Zap, Camera, Timer, SquareCheck as CheckSquare, Plus, Minus } from 'lucide-react-native';
import { userData, addQuest } from '@/data/mockData';

interface QuestData {
  title: string;
  description: string;
  domain: string;
  type: 'simple' | 'photo' | 'timer' | 'checklist';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: number;
  xp: number;
  duration?: number; // for timer quests
  subtasks?: string[]; // for checklist quests
}

export default function CreateQuestScreen() {
  const router = useRouter();
  const [questData, setQuestData] = useState<QuestData>({
    title: '',
    description: '',
    domain: 'physical',
    type: 'simple',
    difficulty: 'Easy',
    estimatedTime: 15,
    xp: 30,
    subtasks: [],
  });
  const [newSubtask, setNewSubtask] = useState('');

  // Refs for input focus management
  const titleRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);
  const subtaskRef = useRef<TextInput>(null);

  const domains = [
    { id: 'physical', name: 'Physical', icon: Target, color: '#FF6B6B' },
    { id: 'mental', name: 'Mental', icon: Brain, color: '#4DABF7' },
    { id: 'emotional', name: 'Emotional', icon: Heart, color: '#51CF66' },
    { id: 'social', name: 'Social', icon: Users, color: '#FFB366' },
    { id: 'financial', name: 'Financial', icon: DollarSign, color: '#9775FA' },
    { id: 'spiritual', name: 'Spiritual', icon: Star, color: '#FFC107' },
  ];

  const questTypes = [
    { id: 'simple', name: 'Simple Task', icon: Zap, description: 'Basic completion quest' },
    { id: 'photo', name: 'Photo Quest', icon: Camera, description: 'Take a photo to complete' },
    { id: 'timer', name: 'Timed Quest', icon: Timer, description: 'Complete within set time' },
    { id: 'checklist', name: 'Checklist', icon: CheckSquare, description: 'Multiple subtasks' },
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const calculateXP = () => {
    let baseXP = 20;
    
    // Difficulty multiplier
    switch (questData.difficulty) {
      case 'Easy': baseXP = 20; break;
      case 'Medium': baseXP = 40; break;
      case 'Hard': baseXP = 60; break;
    }
    
    // Time multiplier
    const timeMultiplier = Math.max(1, questData.estimatedTime / 15);
    
    // Type multiplier
    let typeMultiplier = 1;
    switch (questData.type) {
      case 'simple': typeMultiplier = 1; break;
      case 'photo': typeMultiplier = 1.2; break;
      case 'timer': typeMultiplier = 1.3; break;
      case 'checklist': typeMultiplier = 1.5; break;
    }
    
    // Subtasks bonus
    const subtaskBonus = questData.subtasks ? questData.subtasks.length * 5 : 0;
    
    return Math.round(baseXP * timeMultiplier * typeMultiplier) + subtaskBonus;
  };

  const handleSave = () => {
    Keyboard.dismiss();
    
    // Validate required fields
    if (!questData.title.trim()) {
      Alert.alert('Error', 'Quest title is required');
      return;
    }
    
    if (!questData.description.trim()) {
      Alert.alert('Error', 'Quest description is required');
      return;
    }

    if (questData.type === 'checklist' && (!questData.subtasks || questData.subtasks.length === 0)) {
      Alert.alert('Error', 'Checklist quests need at least one subtask');
      return;
    }

    if (questData.type === 'timer' && (!questData.duration || questData.duration <= 0)) {
      Alert.alert('Error', 'Timer quests need a valid duration');
      return;
    }

    // Calculate final XP
    const finalXP = calculateXP();
    
    // Create the quest
    const newQuest = {
      ...questData,
      xp: finalXP,
      completed: false,
      id: Date.now(), // Simple ID generation
    };

    // Add to mock data (in real app, this would be an API call)
    addQuest(newQuest);

    Alert.alert(
      'Quest Created!',
      `Your quest "${questData.title}" has been created successfully!`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const updateField = (field: keyof QuestData, value: any) => {
    setQuestData(prev => ({ ...prev, [field]: value }));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      const updatedSubtasks = [...(questData.subtasks || []), newSubtask.trim()];
      updateField('subtasks', updatedSubtasks);
      setNewSubtask('');
      subtaskRef.current?.focus();
    }
  };

  const removeSubtask = (index: number) => {
    const updatedSubtasks = questData.subtasks?.filter((_, i) => i !== index) || [];
    updateField('subtasks', updatedSubtasks);
  };

  const selectedDomain = domains.find(d => d.id === questData.domain);
  const selectedType = questTypes.find(t => t.id === questData.type);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              Keyboard.dismiss();
              router.back();
            }}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Quest</Text>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            activeOpacity={0.7}
          >
            <Save size={20} color="#4DABF7" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardDismissMode="none"
          bounces={false}
        >
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Quest Title *</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  ref={titleRef}
                  style={styles.input}
                  placeholder="Enter quest title..."
                  placeholderTextColor="#666666"
                  value={questData.title}
                  onChangeText={(text) => updateField('title', text)}
                  autoCapitalize="sentences"
                  autoCorrect={true}
                  autoFocus={false}
                  blurOnSubmit={false}
                  returnKeyType="next"
                  onSubmitEditing={() => descriptionRef.current?.focus()}
                  enablesReturnKeyAutomatically={false}
                  clearButtonMode="while-editing"
                  keyboardDismissMode="none"
                  includeFontPadding={false}
                  textAlignVertical="center"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description *</Text>
              <View style={styles.textAreaContainer}>
                <TextInput
                  ref={descriptionRef}
                  style={styles.textArea}
                  placeholder="Describe what needs to be done..."
                  placeholderTextColor="#666666"
                  value={questData.description}
                  onChangeText={(text) => updateField('description', text)}
                  multiline
                  numberOfLines={3}
                  autoCapitalize="sentences"
                  autoCorrect={true}
                  autoFocus={false}
                  blurOnSubmit={false}
                  returnKeyType="done"
                  enablesReturnKeyAutomatically={false}
                  keyboardDismissMode="none"
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          {/* Domain Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Domain</Text>
            <View style={styles.domainGrid}>
              {domains.map((domain) => {
                const Icon = domain.icon;
                const isSelected = questData.domain === domain.id;
                return (
                  <TouchableOpacity
                    key={domain.id}
                    style={[
                      styles.domainCard,
                      isSelected && styles.domainCardSelected,
                      { borderColor: isSelected ? domain.color : '#333333' }
                    ]}
                    onPress={() => updateField('domain', domain.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.domainIcon, { backgroundColor: domain.color + '20' }]}>
                      <Icon size={20} color={domain.color} strokeWidth={1.5} />
                    </View>
                    <Text style={[styles.domainName, isSelected && styles.domainNameSelected]}>
                      {domain.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Quest Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quest Type</Text>
            <View style={styles.typeList}>
              {questTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = questData.type === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeCard,
                      isSelected && styles.typeCardSelected
                    ]}
                    onPress={() => updateField('type', type.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.typeCardLeft}>
                      <View style={[styles.typeIcon, isSelected && styles.typeIconSelected]}>
                        <Icon size={20} color={isSelected ? '#FFFFFF' : '#A6A6A6'} strokeWidth={1.5} />
                      </View>
                      <View style={styles.typeInfo}>
                        <Text style={[styles.typeName, isSelected && styles.typeNameSelected]}>
                          {type.name}
                        </Text>
                        <Text style={styles.typeDescription}>{type.description}</Text>
                      </View>
                    </View>
                    <View style={[styles.typeRadio, isSelected && styles.typeRadioSelected]} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Timer Duration (for timer quests) */}
          {questData.type === 'timer' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Timer Duration</Text>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Duration: {Math.floor((questData.duration || 0) / 60)} minutes</Text>
                <View style={styles.timeButtons}>
                  {[5, 10, 15, 20, 30, 45, 60].map((minutes) => (
                    <TouchableOpacity
                      key={minutes}
                      style={[
                        styles.timeButton,
                        questData.duration === minutes * 60 && styles.timeButtonSelected
                      ]}
                      onPress={() => updateField('duration', minutes * 60)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.timeButtonText,
                        questData.duration === minutes * 60 && styles.timeButtonTextSelected
                      ]}>
                        {minutes}m
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Subtasks (for checklist quests) */}
          {questData.type === 'checklist' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Subtasks</Text>
              
              {/* Add Subtask */}
              <View style={styles.addSubtaskContainer}>
                <View style={styles.subtaskInputContainer}>
                  <TextInput
                    ref={subtaskRef}
                    style={styles.subtaskInput}
                    placeholder="Add a subtask..."
                    placeholderTextColor="#666666"
                    value={newSubtask}
                    onChangeText={setNewSubtask}
                    autoCapitalize="sentences"
                    autoCorrect={true}
                    autoFocus={false}
                    blurOnSubmit={false}
                    returnKeyType="done"
                    onSubmitEditing={addSubtask}
                    enablesReturnKeyAutomatically={false}
                    clearButtonMode="while-editing"
                    keyboardDismissMode="none"
                    includeFontPadding={false}
                    textAlignVertical="center"
                  />
                </View>
                <TouchableOpacity
                  style={styles.addSubtaskButton}
                  onPress={addSubtask}
                  activeOpacity={0.7}
                >
                  <Plus size={20} color="#FFFFFF" strokeWidth={1.5} />
                </TouchableOpacity>
              </View>

              {/* Subtasks List */}
              {questData.subtasks && questData.subtasks.length > 0 && (
                <View style={styles.subtasksList}>
                  {questData.subtasks.map((subtask, index) => (
                    <View key={index} style={styles.subtaskItem}>
                      <Text style={styles.subtaskText}>{subtask}</Text>
                      <TouchableOpacity
                        style={styles.removeSubtaskButton}
                        onPress={() => removeSubtask(index)}
                        activeOpacity={0.7}
                      >
                        <Minus size={16} color="#FF6B6B" strokeWidth={1.5} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Quest Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quest Settings</Text>
            
            {/* Difficulty */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Difficulty</Text>
              <View style={styles.difficultyButtons}>
                {difficulties.map((difficulty) => (
                  <TouchableOpacity
                    key={difficulty}
                    style={[
                      styles.difficultyButton,
                      questData.difficulty === difficulty && styles.difficultyButtonSelected
                    ]}
                    onPress={() => updateField('difficulty', difficulty)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.difficultyButtonText,
                      questData.difficulty === difficulty && styles.difficultyButtonTextSelected
                    ]}>
                      {difficulty}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Estimated Time */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Estimated Time (minutes)</Text>
              <View style={styles.timeButtons}>
                {[5, 10, 15, 20, 30, 45, 60, 90, 120].map((minutes) => (
                  <TouchableOpacity
                    key={minutes}
                    style={[
                      styles.timeButton,
                      questData.estimatedTime === minutes && styles.timeButtonSelected
                    ]}
                    onPress={() => updateField('estimatedTime', minutes)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.timeButtonText,
                      questData.estimatedTime === minutes && styles.timeButtonTextSelected
                    ]}>
                      {minutes}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* XP Preview */}
            <View style={styles.xpPreview}>
              <Clock size={16} color="#4DABF7" strokeWidth={1.5} />
              <Text style={styles.xpPreviewText}>
                This quest will reward {calculateXP()} XP
              </Text>
            </View>
          </View>

          {/* Create Button */}
          <TouchableOpacity 
            style={styles.createButton} 
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.createButtonText}>Create Quest</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardContainer: {
    flex: 1,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A6A6A6',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 56,
  },
  input: {
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 24,
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  textAreaContainer: {
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 100,
  },
  textArea: {
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 68,
    textAlignVertical: 'top',
    includeFontPadding: false,
  },
  domainGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  domainCard: {
    width: '30%',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333333',
  },
  domainCardSelected: {
    backgroundColor: '#161616',
  },
  domainIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  domainName: {
    fontSize: 12,
    color: '#A6A6A6',
    fontWeight: '500',
    textAlign: 'center',
  },
  domainNameSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  typeList: {
    gap: 12,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  typeCardSelected: {
    borderColor: '#4DABF7',
    backgroundColor: '#4DABF7' + '10',
  },
  typeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  typeIconSelected: {
    backgroundColor: '#4DABF7',
  },
  typeInfo: {
    flex: 1,
  },
  typeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  typeNameSelected: {
    color: '#4DABF7',
  },
  typeDescription: {
    fontSize: 12,
    color: '#A6A6A6',
  },
  typeRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333333',
  },
  typeRadioSelected: {
    borderColor: '#4DABF7',
    backgroundColor: '#4DABF7',
  },
  sliderContainer: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  sliderLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  timeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeButton: {
    backgroundColor: '#161616',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#333333',
    minWidth: 50,
    alignItems: 'center',
  },
  timeButtonSelected: {
    backgroundColor: '#4DABF7',
    borderColor: '#4DABF7',
  },
  timeButtonText: {
    fontSize: 12,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  timeButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  addSubtaskContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  subtaskInputContainer: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 48,
  },
  subtaskInput: {
    fontSize: 14,
    color: '#FFFFFF',
    minHeight: 24,
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  addSubtaskButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#4DABF7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtasksList: {
    gap: 8,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#161616',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  subtaskText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  removeSubtaskButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B6B' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyButton: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  difficultyButtonSelected: {
    backgroundColor: '#4DABF7',
    borderColor: '#4DABF7',
  },
  difficultyButtonText: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  difficultyButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  xpPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4DABF7' + '20',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    gap: 8,
  },
  xpPreviewText: {
    fontSize: 16,
    color: '#4DABF7',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    minHeight: 56,
    justifyContent: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});
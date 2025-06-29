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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Plus, 
  Minus, 
  CheckCircle, 
  XCircle, 
  Circle,
  Target,
  Brain,
  AlertTriangle,
  Save,
  Calendar
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TypeScript interfaces
interface Rule {
  id: string;
  text: string;
  completed: boolean;
  violated: boolean;
  isCustom: boolean;
}

interface Learning {
  id: string;
  text: string;
}

interface ProblemEntry {
  id: string;
  text: string;
}

interface ProblemAnalysis {
  problems: ProblemEntry[];
  triggers: ProblemEntry[];
  solutions: ProblemEntry[];
}

interface PointedJournalData {
  date: string;
  rules: Rule[];
  learnings: Learning[];
  problemAnalysis: ProblemAnalysis;
  lastModified: number;
}

const DEFAULT_RULES = [
  "Wake up before 8 AM",
  "Exercise for 30+ minutes", 
  "No social media before noon",
  "Read for 30 minutes",
  "Meditate for 10 minutes",
  "No junk food",
  "Sleep before 11 PM"
];

export default function PointedJournalingScreen() {
  const router = useRouter();
  const [data, setData] = useState<PointedJournalData>({
    date: new Date().toISOString().split('T')[0],
    rules: [],
    learnings: [],
    problemAnalysis: {
      problems: [],
      triggers: [],
      solutions: []
    },
    lastModified: Date.now()
  });
  
  const [newRuleText, setNewRuleText] = useState('');
  const [newLearningText, setNewLearningText] = useState('');
  const [newProblemText, setNewProblemText] = useState('');
  const [newTriggerText, setNewTriggerText] = useState('');
  const [newSolutionText, setNewSolutionText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadTodaysData();
  }, []);

  const loadTodaysData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const stored = await AsyncStorage.getItem(`pointedJournal_${today}`);
      
      if (stored) {
        const parsedData = JSON.parse(stored);
        setData(parsedData);
      } else {
        // Initialize with default rules
        const defaultRules: Rule[] = DEFAULT_RULES.map((rule, index) => ({
          id: `default_${index}`,
          text: rule,
          completed: false,
          violated: false,
          isCustom: false
        }));
        
        setData(prev => ({
          ...prev,
          rules: defaultRules
        }));
      }
    } catch (error) {
      console.error('Error loading pointed journal data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (newData: PointedJournalData) => {
    try {
      setIsSaving(true);
      const dataToSave = {
        ...newData,
        lastModified: Date.now()
      };
      
      await AsyncStorage.setItem(
        `pointedJournal_${dataToSave.date}`, 
        JSON.stringify(dataToSave)
      );
      
      setData(dataToSave);
    } catch (error) {
      console.error('Error saving pointed journal data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleRuleCompleted = (ruleId: string) => {
    const updatedData = {
      ...data,
      rules: data.rules.map(rule => 
        rule.id === ruleId 
          ? { ...rule, completed: !rule.completed, violated: rule.completed ? rule.violated : false }
          : rule
      )
    };
    saveData(updatedData);
  };

  const toggleRuleViolated = (ruleId: string) => {
    const updatedData = {
      ...data,
      rules: data.rules.map(rule => 
        rule.id === ruleId 
          ? { ...rule, violated: !rule.violated, completed: rule.violated ? rule.completed : false }
          : rule
      )
    };
    saveData(updatedData);
  };

  const addCustomRule = () => {
    if (newRuleText.trim()) {
      const newRule: Rule = {
        id: `custom_${Date.now()}`,
        text: newRuleText.trim(),
        completed: false,
        violated: false,
        isCustom: true
      };
      
      const updatedData = {
        ...data,
        rules: [...data.rules, newRule]
      };
      
      saveData(updatedData);
      setNewRuleText('');
    }
  };

  const removeCustomRule = (ruleId: string) => {
    const updatedData = {
      ...data,
      rules: data.rules.filter(rule => rule.id !== ruleId)
    };
    saveData(updatedData);
  };

  const addLearning = () => {
    if (newLearningText.trim()) {
      const newLearning: Learning = {
        id: `learning_${Date.now()}`,
        text: newLearningText.trim()
      };
      
      const updatedData = {
        ...data,
        learnings: [...data.learnings, newLearning]
      };
      
      saveData(updatedData);
      setNewLearningText('');
    }
  };

  const removeLearning = (learningId: string) => {
    const updatedData = {
      ...data,
      learnings: data.learnings.filter(learning => learning.id !== learningId)
    };
    saveData(updatedData);
  };

  const addProblemEntry = (type: 'problems' | 'triggers' | 'solutions', text: string) => {
    if (text.trim()) {
      const newEntry: ProblemEntry = {
        id: `${type}_${Date.now()}`,
        text: text.trim()
      };
      
      const updatedData = {
        ...data,
        problemAnalysis: {
          ...data.problemAnalysis,
          [type]: [...data.problemAnalysis[type], newEntry]
        }
      };
      
      saveData(updatedData);
      
      // Clear the appropriate input
      if (type === 'problems') setNewProblemText('');
      if (type === 'triggers') setNewTriggerText('');
      if (type === 'solutions') setNewSolutionText('');
    }
  };

  const removeProblemEntry = (type: 'problems' | 'triggers' | 'solutions', entryId: string) => {
    const updatedData = {
      ...data,
      problemAnalysis: {
        ...data.problemAnalysis,
        [type]: data.problemAnalysis[type].filter(entry => entry.id !== entryId)
      }
    };
    saveData(updatedData);
  };

  const calculateSuccessRate = () => {
    if (data.rules.length === 0) return 0;
    const completedRules = data.rules.filter(rule => rule.completed).length;
    return Math.round((completedRules / data.rules.length) * 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading journal...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>Pointed Journaling</Text>
          <Text style={styles.headerDate}>{formatDate(data.date)}</Text>
        </View>
        <View style={styles.saveIndicator}>
          {isSaving ? (
            <Text style={styles.savingText}>Saving...</Text>
          ) : (
            <Save size={20} color="#51CF66" strokeWidth={1.5} />
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Daily Rules Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Target size={24} color="#4DABF7" strokeWidth={1.5} />
              <Text style={styles.sectionTitle}>Daily Rules</Text>
            </View>
            <View style={styles.successRate}>
              <Text style={styles.successRateText}>{calculateSuccessRate()}%</Text>
              <Text style={styles.successRateLabel}>Success</Text>
            </View>
          </View>

          {/* Rules List */}
          <View style={styles.rulesList}>
            {data.rules.map((rule) => (
              <View key={rule.id} style={styles.ruleItem}>
                <View style={styles.ruleContent}>
                  <Text style={[
                    styles.ruleText,
                    rule.completed && styles.ruleTextCompleted,
                    rule.violated && styles.ruleTextViolated
                  ]}>
                    {rule.text}
                  </Text>
                  {rule.isCustom && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeCustomRule(rule.id)}
                      activeOpacity={0.7}
                    >
                      <Minus size={16} color="#FF6B6B" strokeWidth={1.5} />
                    </TouchableOpacity>
                  )}
                </View>
                
                <View style={styles.ruleActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, rule.completed && styles.actionButtonActive]}
                    onPress={() => toggleRuleCompleted(rule.id)}
                    activeOpacity={0.7}
                  >
                    {rule.completed ? (
                      <CheckCircle size={20} color="#51CF66" strokeWidth={1.5} />
                    ) : (
                      <Circle size={20} color="#666666" strokeWidth={1.5} />
                    )}
                    <Text style={[
                      styles.actionButtonText,
                      rule.completed && styles.actionButtonTextActive
                    ]}>
                      Done
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, rule.violated && styles.actionButtonViolated]}
                    onPress={() => toggleRuleViolated(rule.id)}
                    activeOpacity={0.7}
                  >
                    {rule.violated ? (
                      <XCircle size={20} color="#FF6B6B" strokeWidth={1.5} />
                    ) : (
                      <Circle size={20} color="#666666" strokeWidth={1.5} />
                    )}
                    <Text style={[
                      styles.actionButtonText,
                      rule.violated && styles.actionButtonTextViolated
                    ]}>
                      Failed
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Add Custom Rule */}
          <View style={styles.addRuleContainer}>
            <TextInput
              style={styles.addRuleInput}
              placeholder="Add a custom rule..."
              placeholderTextColor="#666666"
              value={newRuleText}
              onChangeText={setNewRuleText}
              multiline
              autoCapitalize="sentences"
              autoCorrect={true}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addCustomRule}
              activeOpacity={0.7}
            >
              <Plus size={20} color="#FFFFFF" strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Learnings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Brain size={24} color="#51CF66" strokeWidth={1.5} />
              <Text style={styles.sectionTitle}>Daily Learnings</Text>
            </View>
          </View>

          {/* Learnings List */}
          {data.learnings.map((learning) => (
            <View key={learning.id} style={styles.learningItem}>
              <Text style={styles.learningText}>{learning.text}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeLearning(learning.id)}
                activeOpacity={0.7}
              >
                <Minus size={16} color="#FF6B6B" strokeWidth={1.5} />
              </TouchableOpacity>
            </View>
          ))}

          {/* Add Learning */}
          <View style={styles.addLearningContainer}>
            <TextInput
              style={styles.learningInput}
              placeholder="What did you learn today? Insights, patterns, observations..."
              placeholderTextColor="#666666"
              value={newLearningText}
              onChangeText={setNewLearningText}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              autoCapitalize="sentences"
              autoCorrect={true}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addLearning}
              activeOpacity={0.7}
            >
              <Plus size={20} color="#FFFFFF" strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Problem Analysis Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <AlertTriangle size={24} color="#FFB366" strokeWidth={1.5} />
              <Text style={styles.sectionTitle}>Problem Analysis</Text>
            </View>
          </View>

          {/* Specific Problems */}
          <View style={styles.problemSubsection}>
            <Text style={styles.problemSubtitle}>Specific Problems</Text>
            {data.problemAnalysis.problems.map((problem) => (
              <View key={problem.id} style={styles.problemItem}>
                <Text style={styles.problemText}>{problem.text}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeProblemEntry('problems', problem.id)}
                  activeOpacity={0.7}
                >
                  <Minus size={16} color="#FF6B6B" strokeWidth={1.5} />
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.addProblemContainer}>
              <TextInput
                style={styles.problemInput}
                placeholder="Describe a specific problem you faced today..."
                placeholderTextColor="#666666"
                value={newProblemText}
                onChangeText={setNewProblemText}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
                autoCapitalize="sentences"
                autoCorrect={true}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addProblemEntry('problems', newProblemText)}
                activeOpacity={0.7}
              >
                <Plus size={20} color="#FFFFFF" strokeWidth={1.5} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Trigger Analysis */}
          <View style={styles.problemSubsection}>
            <Text style={styles.problemSubtitle}>Trigger Analysis</Text>
            {data.problemAnalysis.triggers.map((trigger) => (
              <View key={trigger.id} style={styles.problemItem}>
                <Text style={styles.problemText}>{trigger.text}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeProblemEntry('triggers', trigger.id)}
                  activeOpacity={0.7}
                >
                  <Minus size={16} color="#FF6B6B" strokeWidth={1.5} />
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.addProblemContainer}>
              <TextInput
                style={styles.problemInput}
                placeholder="What triggered this problem? Environment, emotions, people..."
                placeholderTextColor="#666666"
                value={newTriggerText}
                onChangeText={setNewTriggerText}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
                autoCapitalize="sentences"
                autoCorrect={true}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addProblemEntry('triggers', newTriggerText)}
                activeOpacity={0.7}
              >
                <Plus size={20} color="#FFFFFF" strokeWidth={1.5} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Solution Brainstorming */}
          <View style={styles.problemSubsection}>
            <Text style={styles.problemSubtitle}>Solution Brainstorming</Text>
            {data.problemAnalysis.solutions.map((solution) => (
              <View key={solution.id} style={styles.problemItem}>
                <Text style={styles.problemText}>{solution.text}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeProblemEntry('solutions', solution.id)}
                  activeOpacity={0.7}
                >
                  <Minus size={16} color="#FF6B6B" strokeWidth={1.5} />
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.addProblemContainer}>
              <TextInput
                style={styles.problemInput}
                placeholder="Brainstorm potential solutions and strategies..."
                placeholderTextColor="#666666"
                value={newSolutionText}
                onChangeText={setNewSolutionText}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
                autoCapitalize="sentences"
                autoCorrect={true}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addProblemEntry('solutions', newSolutionText)}
                activeOpacity={0.7}
              >
                <Plus size={20} color="#FFFFFF" strokeWidth={1.5} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#A6A6A6',
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
  headerDate: {
    fontSize: 14,
    color: '#A6A6A6',
  },
  saveIndicator: {
    alignItems: 'center',
  },
  savingText: {
    fontSize: 12,
    color: '#A6A6A6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  successRate: {
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  successRateText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#51CF66',
  },
  successRateLabel: {
    fontSize: 12,
    color: '#A6A6A6',
  },
  rulesList: {
    gap: 12,
  },
  ruleItem: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  ruleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ruleText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
    fontWeight: '500',
  },
  ruleTextCompleted: {
    color: '#51CF66',
  },
  ruleTextViolated: {
    color: '#FF6B6B',
    textDecorationLine: 'line-through',
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B6B' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  ruleActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#161616',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#333333',
    gap: 8,
  },
  actionButtonActive: {
    backgroundColor: '#51CF66' + '20',
    borderColor: '#51CF66',
  },
  actionButtonViolated: {
    backgroundColor: '#FF6B6B' + '20',
    borderColor: '#FF6B6B',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '600',
  },
  actionButtonTextActive: {
    color: '#51CF66',
  },
  actionButtonTextViolated: {
    color: '#FF6B6B',
  },
  addRuleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  addRuleInput: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 56,
    textAlignVertical: 'center',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#4DABF7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  learningItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  learningText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  addLearningContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  learningInput: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  problemSubsection: {
    marginBottom: 24,
  },
  problemSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFB366',
    marginBottom: 12,
  },
  problemItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  problemText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  addProblemContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  problemInput: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  bottomPadding: {
    height: 100,
  },
});
import React, { useState } from 'react';
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
  ChevronRight,
  Brain,
  Search,
  AlertTriangle,
  Target,
  Calendar,
  CheckCircle,
  Circle
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProblemSolution {
  id: string;
  problem: string;
  triggers: string[];
  longTermImpact: string;
  solutions: string[];
  actionPlan: string[];
  emotionalImpact: number;
  hasControl: boolean;
  followUpDate: Date;
  status: 'active' | 'solved' | 'monitoring';
  createdAt: Date;
}

export default function ProblemSolvingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [problemData, setProblemData] = useState<Partial<ProblemSolution>>({
    problem: '',
    triggers: [],
    longTermImpact: '',
    solutions: [],
    actionPlan: [],
    emotionalImpact: 50,
    hasControl: true,
    status: 'active',
  });

  const totalSteps = 5;

  const commonTriggers = [
    'Stress', 'Fatigue', 'Social pressure', 'Boredom', 'Anxiety',
    'Overwhelm', 'Perfectionism', 'Fear of failure', 'Procrastination',
    'Lack of clarity', 'External expectations', 'Time pressure'
  ];

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        saveProblemSolution();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!problemData.problem?.trim()) {
          Alert.alert('Error', 'Please describe the problem');
          return false;
        }
        break;
      case 2:
        if (!problemData.triggers || problemData.triggers.length === 0) {
          Alert.alert('Error', 'Please select at least one trigger');
          return false;
        }
        break;
      case 3:
        if (!problemData.longTermImpact?.trim()) {
          Alert.alert('Error', 'Please describe the long-term impact');
          return false;
        }
        break;
      case 4:
        if (!problemData.solutions || problemData.solutions.length === 0) {
          Alert.alert('Error', 'Please add at least one solution');
          return false;
        }
        break;
      case 5:
        if (!problemData.actionPlan || problemData.actionPlan.length === 0) {
          Alert.alert('Error', 'Please create an action plan');
          return false;
        }
        break;
    }
    return true;
  };

  const saveProblemSolution = async () => {
    try {
      const solution: ProblemSolution = {
        ...problemData,
        id: Date.now().toString(),
        createdAt: new Date(),
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      } as ProblemSolution;

      const existingSolutions = await AsyncStorage.getItem('problemSolutions');
      const solutions = existingSolutions ? JSON.parse(existingSolutions) : [];
      solutions.push(solution);
      
      await AsyncStorage.setItem('problemSolutions', JSON.stringify(solutions));
      
      Alert.alert(
        'Problem Solution Created!',
        'Your systematic approach has been saved. You\'ll be reminded to follow up in a week.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving problem solution:', error);
      Alert.alert('Error', 'Failed to save problem solution');
    }
  };

  const toggleTrigger = (trigger: string) => {
    const triggers = problemData.triggers || [];
    const updatedTriggers = triggers.includes(trigger)
      ? triggers.filter(t => t !== trigger)
      : [...triggers, trigger];
    
    setProblemData({ ...problemData, triggers: updatedTriggers });
  };

  const addSolution = (solution: string) => {
    if (solution.trim()) {
      const solutions = problemData.solutions || [];
      setProblemData({ 
        ...problemData, 
        solutions: [...solutions, solution.trim()] 
      });
    }
  };

  const removeSolution = (index: number) => {
    const solutions = problemData.solutions || [];
    setProblemData({ 
      ...problemData, 
      solutions: solutions.filter((_, i) => i !== index) 
    });
  };

  const addActionItem = (item: string) => {
    if (item.trim()) {
      const actionPlan = problemData.actionPlan || [];
      setProblemData({ 
        ...problemData, 
        actionPlan: [...actionPlan, item.trim()] 
      });
    }
  };

  const removeActionItem = (index: number) => {
    const actionPlan = problemData.actionPlan || [];
    setProblemData({ 
      ...problemData, 
      actionPlan: actionPlan.filter((_, i) => i !== index) 
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ProblemIdentification />;
      case 2:
        return <Step2TriggerAnalysis />;
      case 3:
        return <Step3ImpactAssessment />;
      case 4:
        return <Step4SolutionDevelopment />;
      case 5:
        return <Step5ActionPlanning />;
      default:
        return null;
    }
  };

  const Step1ProblemIdentification = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Brain size={32} color="#4DABF7" strokeWidth={1.5} />
        <Text style={styles.stepTitle}>Problem Identification</Text>
        <Text style={styles.stepDescription}>
          Clearly define the problem you're facing. Be specific and objective.
        </Text>
      </View>

      <TextInput
        style={styles.textArea}
        placeholder="Describe the problem in detail..."
        placeholderTextColor="#666666"
        value={problemData.problem}
        onChangeText={(text) => setProblemData({ ...problemData, problem: text })}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>💡 Pro Tip</Text>
        <Text style={styles.tipText}>
          Focus on facts, not emotions. What exactly is happening? When does it occur? 
          How often? Be as specific as possible.
        </Text>
      </View>
    </View>
  );

  const Step2TriggerAnalysis = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Search size={32} color="#51CF66" strokeWidth={1.5} />
        <Text style={styles.stepTitle}>Trigger Analysis</Text>
        <Text style={styles.stepDescription}>
          Identify what triggers this problem. Understanding triggers helps prevent recurrence.
        </Text>
      </View>

      <View style={styles.triggersGrid}>
        {commonTriggers.map((trigger) => (
          <TouchableOpacity
            key={trigger}
            style={[
              styles.triggerChip,
              problemData.triggers?.includes(trigger) && styles.triggerChipSelected
            ]}
            onPress={() => toggleTrigger(trigger)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.triggerChipText,
              problemData.triggers?.includes(trigger) && styles.triggerChipTextSelected
            ]}>
              {trigger}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Add custom trigger..."
        placeholderTextColor="#666666"
        onSubmitEditing={(e) => {
          if (e.nativeEvent.text.trim()) {
            toggleTrigger(e.nativeEvent.text.trim());
            e.target.clear();
          }
        }}
      />
    </View>
  );

  const Step3ImpactAssessment = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <AlertTriangle size={32} color="#FFB366" strokeWidth={1.5} />
        <Text style={styles.stepTitle}>Impact Assessment</Text>
        <Text style={styles.stepDescription}>
          Evaluate the long-term consequences and your level of control.
        </Text>
      </View>

      <View style={styles.assessmentSection}>
        <Text style={styles.assessmentLabel}>Long-term Impact</Text>
        <TextInput
          style={styles.textArea}
          placeholder="How will this problem affect your future if left unsolved?"
          placeholderTextColor="#666666"
          value={problemData.longTermImpact}
          onChangeText={(text) => setProblemData({ ...problemData, longTermImpact: text })}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.assessmentSection}>
        <Text style={styles.assessmentLabel}>
          Emotional Impact: {problemData.emotionalImpact}%
        </Text>
        <View style={styles.sliderContainer}>
          <TouchableOpacity
            style={styles.sliderButton}
            onPress={() => setProblemData({ 
              ...problemData, 
              emotionalImpact: Math.max(0, (problemData.emotionalImpact || 50) - 10) 
            })}
          >
            <Text style={styles.sliderButtonText}>-</Text>
          </TouchableOpacity>
          <View style={styles.sliderTrack}>
            <View 
              style={[
                styles.sliderFill, 
                { width: `${problemData.emotionalImpact}%` }
              ]} 
            />
          </View>
          <TouchableOpacity
            style={styles.sliderButton}
            onPress={() => setProblemData({ 
              ...problemData, 
              emotionalImpact: Math.min(100, (problemData.emotionalImpact || 50) + 10) 
            })}
          >
            <Text style={styles.sliderButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.assessmentSection}>
        <Text style={styles.assessmentLabel}>Do you have control over this problem?</Text>
        <View style={styles.controlButtons}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              problemData.hasControl && styles.controlButtonSelected
            ]}
            onPress={() => setProblemData({ ...problemData, hasControl: true })}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.controlButtonText,
              problemData.hasControl && styles.controlButtonTextSelected
            ]}>
              Yes, I can influence this
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.controlButton,
              !problemData.hasControl && styles.controlButtonSelected
            ]}
            onPress={() => setProblemData({ ...problemData, hasControl: false })}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.controlButtonText,
              !problemData.hasControl && styles.controlButtonTextSelected
            ]}>
              No, it's outside my control
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const Step4SolutionDevelopment = () => {
    const [newSolution, setNewSolution] = useState('');

    return (
      <View style={styles.stepContainer}>
        <View style={styles.stepHeader}>
          <Target size={32} color="#9775FA" strokeWidth={1.5} />
          <Text style={styles.stepTitle}>Solution Development</Text>
          <Text style={styles.stepDescription}>
            Brainstorm multiple solutions. Quantity leads to quality.
          </Text>
        </View>

        <View style={styles.addItemContainer}>
          <TextInput
            style={styles.addItemInput}
            placeholder="Add a potential solution..."
            placeholderTextColor="#666666"
            value={newSolution}
            onChangeText={setNewSolution}
            onSubmitEditing={() => {
              addSolution(newSolution);
              setNewSolution('');
            }}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              addSolution(newSolution);
              setNewSolution('');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.itemsList}>
          {problemData.solutions?.map((solution, index) => (
            <View key={index} style={styles.itemCard}>
              <Text style={styles.itemText}>{solution}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeSolution(index)}
                activeOpacity={0.8}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {problemData.solutions && problemData.solutions.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Start adding potential solutions. Don't worry about quality yet - 
              focus on quantity first.
            </Text>
          </View>
        )}
      </View>
    );
  };

  const Step5ActionPlanning = () => {
    const [newAction, setNewAction] = useState('');

    return (
      <View style={styles.stepContainer}>
        <View style={styles.stepHeader}>
          <Calendar size={32} color="#FFC107" strokeWidth={1.5} />
          <Text style={styles.stepTitle}>Action Planning</Text>
          <Text style={styles.stepDescription}>
            Create specific, actionable steps to implement your best solutions.
          </Text>
        </View>

        <View style={styles.addItemContainer}>
          <TextInput
            style={styles.addItemInput}
            placeholder="Add an action step..."
            placeholderTextColor="#666666"
            value={newAction}
            onChangeText={setNewAction}
            onSubmitEditing={() => {
              addActionItem(newAction);
              setNewAction('');
            }}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              addActionItem(newAction);
              setNewAction('');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.itemsList}>
          {problemData.actionPlan?.map((action, index) => (
            <View key={index} style={styles.itemCard}>
              <Text style={styles.itemNumber}>{index + 1}.</Text>
              <Text style={styles.itemText}>{action}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeActionItem(index)}
                activeOpacity={0.8}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <Text style={styles.summaryText}>
            Problem: {problemData.problem?.substring(0, 100)}...
          </Text>
          <Text style={styles.summaryText}>
            Triggers: {problemData.triggers?.join(', ')}
          </Text>
          <Text style={styles.summaryText}>
            Solutions: {problemData.solutions?.length} identified
          </Text>
          <Text style={styles.summaryText}>
            Action Steps: {problemData.actionPlan?.length} planned
          </Text>
        </View>
      </View>
    );
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
          <Text style={styles.headerTitle}>Problem Solving Wizard</Text>
          <Text style={styles.headerSubtitle}>Step {currentStep} of {totalSteps}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(currentStep / totalSteps) * 100}%` }
            ]} 
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStep()}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={handlePrevious}
            activeOpacity={0.8}
          >
            <ChevronLeft size={20} color="#A6A6A6" strokeWidth={1.5} />
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === totalSteps ? 'Complete' : 'Next'}
          </Text>
          {currentStep < totalSteps && (
            <ChevronRight size={20} color="#FFFFFF" strokeWidth={1.5} />
          )}
          {currentStep === totalSteps && (
            <CheckCircle size={20} color="#FFFFFF" strokeWidth={1.5} />
          )}
        </TouchableOpacity>
      </View>
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
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#A6A6A6',
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4DABF7',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  stepContainer: {
    marginBottom: 24,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#A6A6A6',
    textAlign: 'center',
    lineHeight: 24,
  },
  textArea: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  tipCard: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4DABF7',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#A6A6A6',
    lineHeight: 20,
  },
  triggersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  triggerChip: {
    backgroundColor: '#111111',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  triggerChipSelected: {
    backgroundColor: '#4DABF7',
    borderColor: '#4DABF7',
  },
  triggerChipText: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  triggerChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  assessmentSection: {
    marginBottom: 24,
  },
  assessmentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  sliderButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#333333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#FFB366',
    borderRadius: 3,
  },
  controlButtons: {
    gap: 12,
  },
  controlButton: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  controlButtonSelected: {
    backgroundColor: '#4DABF7',
    borderColor: '#4DABF7',
  },
  controlButtonText: {
    fontSize: 16,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  controlButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  addItemContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  addItemInput: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  addButton: {
    backgroundColor: '#4DABF7',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  itemsList: {
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  itemNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4DABF7',
    marginRight: 12,
    minWidth: 24,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  removeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#A6A6A6',
    textAlign: 'center',
    lineHeight: 24,
  },
  summaryCard: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
    marginTop: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#A6A6A6',
    marginBottom: 8,
    lineHeight: 20,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  navButtonText: {
    fontSize: 16,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4DABF7',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
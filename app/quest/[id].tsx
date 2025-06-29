import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft,
  Camera,
  Timer,
  Check,
  Play,
  Pause,
  Square,
  Target,
  Brain,
  Heart,
  Users,
  Star,
  DollarSign,
} from 'lucide-react-native';
import { userData } from '@/data/mockData';

export default function QuestDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isCompleted, setIsCompleted] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [subtaskStates, setSubtaskStates] = useState<{ [key: number]: boolean }>({});

  const quest = userData.quests.find(q => q.id === parseInt(id as string));

  useEffect(() => {
    if (quest?.type === 'timer' && quest.duration) {
      setTimeRemaining(quest.duration);
    }
  }, [quest]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  if (!quest) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Text style={styles.errorText}>Quest not found</Text>
      </SafeAreaView>
    );
  }

  const getDomainIcon = (domain: string) => {
    const icons = {
      physical: Target,
      mental: Brain,
      emotional: Heart,
      social: Users,
      spiritual: Star,
      financial: DollarSign,
    };
    return icons[domain as keyof typeof icons] || Target;
  };

  const getDomainColor = (domain: string) => {
    const domainData = userData.domains.find(d => d.id === domain);
    return domainData?.color || '#4DABF7';
  };

  const Icon = getDomainIcon(quest.domain);
  const domainColor = getDomainColor(quest.domain);

  const handleComplete = () => {
    setIsCompleted(true);
    Alert.alert(
      'Quest Completed!',
      `You earned ${quest.xp} XP!`,
      [
        {
          text: 'Continue',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleTimerToggle = () => {
    setTimerActive(!timerActive);
  };

  const handleTimerReset = () => {
    setTimerActive(false);
    setTimeRemaining(quest.duration || 0);
  };

  const handleSubtaskToggle = (index: number) => {
    setSubtaskStates(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const allSubtasksCompleted = quest.subtasks
    ? quest.subtasks.every((_, index) => subtaskStates[index])
    : false;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quest Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quest Header */}
        <View style={styles.questHeader}>
          <View style={styles.questIconContainer}>
            <View style={[styles.questIcon, { backgroundColor: domainColor + '20' }]}>
              <Icon size={24} color={domainColor} strokeWidth={1.5} />
            </View>
            <View style={styles.questBadge}>
              <Text style={styles.questBadgeText}>{quest.difficulty}</Text>
            </View>
          </View>
          
          <View style={styles.questInfo}>
            <Text style={styles.questTitle}>{quest.title}</Text>
            <Text style={styles.questDescription}>{quest.description}</Text>
            
            <View style={styles.questMeta}>
              <Text style={styles.questXP}>+{quest.xp} XP</Text>
              <Text style={styles.questTime}>{quest.estimatedTime} min</Text>
            </View>
          </View>
        </View>

        {/* Quest Content Based on Type */}
        {quest.type === 'simple' && (
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[
                styles.completeButton,
                isCompleted && styles.completedButton,
              ]}
              onPress={handleComplete}
              disabled={isCompleted}
            >
              <Check size={20} color={isCompleted ? '#51CF66' : '#FFFFFF'} strokeWidth={2} />
              <Text style={[
                styles.completeButtonText,
                isCompleted && styles.completedButtonText,
              ]}>
                {isCompleted ? 'Completed!' : 'Mark Complete'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {quest.type === 'photo' && (
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.photoButton}>
              <Camera size={24} color="#FFFFFF" strokeWidth={1.5} />
              <Text style={styles.photoButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <Text style={styles.photoHint}>
              Take a photo to document your progress
            </Text>
          </View>
        )}

        {quest.type === 'timer' && (
          <View style={styles.timerSection}>
            <View style={styles.timerDisplay}>
              <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
            </View>
            
            <View style={styles.timerControls}>
              <TouchableOpacity
                style={styles.timerButton}
                onPress={handleTimerToggle}
              >
                {timerActive ? (
                  <Pause size={20} color="#FFFFFF" strokeWidth={1.5} />
                ) : (
                  <Play size={20} color="#FFFFFF" strokeWidth={1.5} />
                )}
                <Text style={styles.timerButtonText}>
                  {timerActive ? 'Pause' : 'Start'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.timerButton}
                onPress={handleTimerReset}
              >
                <Square size={20} color="#FFFFFF" strokeWidth={1.5} />
                <Text style={styles.timerButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {quest.type === 'checklist' && quest.subtasks && (
          <View style={styles.checklistSection}>
            <Text style={styles.checklistTitle}>Subtasks</Text>
            {quest.subtasks.map((subtask, index) => (
              <TouchableOpacity
                key={index}
                style={styles.subtaskItem}
                onPress={() => handleSubtaskToggle(index)}
              >
                <View style={[
                  styles.subtaskCheckbox,
                  subtaskStates[index] && styles.subtaskCheckboxChecked,
                ]}>
                  {subtaskStates[index] && (
                    <Check size={14} color="#FFFFFF" strokeWidth={2} />
                  )}
                </View>
                <Text style={[
                  styles.subtaskText,
                  subtaskStates[index] && styles.subtaskTextCompleted,
                ]}>
                  {subtask}
                </Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={[
                styles.completeButton,
                (!allSubtasksCompleted || isCompleted) && styles.disabledButton,
              ]}
              onPress={handleComplete}
              disabled={!allSubtasksCompleted || isCompleted}
            >
              <Check size={20} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.completeButtonText}>
                {isCompleted ? 'Completed!' : 'Complete Quest'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quest Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Tips for Success</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Set aside dedicated time for this quest</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Focus on quality over speed</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Track your progress and celebrate small wins</Text>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  questHeader: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  questIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  questIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questBadge: {
    backgroundColor: '#333333',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  questBadgeText: {
    fontSize: 12,
    color: '#A6A6A6',
    fontWeight: '600',
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  questDescription: {
    fontSize: 16,
    color: '#A6A6A6',
    lineHeight: 24,
    marginBottom: 16,
  },
  questMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  questXP: {
    fontSize: 16,
    color: '#4DABF7',
    fontWeight: '600',
  },
  questTime: {
    fontSize: 14,
    color: '#666666',
  },
  actionSection: {
    marginBottom: 24,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  completedButton: {
    backgroundColor: '#51CF66',
  },
  disabledButton: {
    backgroundColor: '#333333',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  completedButtonText: {
    color: '#FFFFFF',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4DABF7',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 12,
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  photoHint: {
    fontSize: 14,
    color: '#A6A6A6',
    textAlign: 'center',
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerDisplay: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#4DABF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timerControls: {
    flexDirection: 'row',
    gap: 16,
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  timerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  checklistSection: {
    marginBottom: 24,
  },
  checklistTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  subtaskCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subtaskCheckboxChecked: {
    backgroundColor: '#51CF66',
    borderColor: '#51CF66',
  },
  subtaskText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  subtaskTextCompleted: {
    color: '#A6A6A6',
    textDecorationLine: 'line-through',
  },
  tipsSection: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#A6A6A6',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 100,
  },
});
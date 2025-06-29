import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Target, Brain, Heart, Users, Star, DollarSign } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Question {
  id: number;
  domain: string;
  question: string;
  description: string;
}

interface DomainData {
  id: string;
  name: string;
  icon: any;
  color: string;
  questions: Question[];
}

const assessmentData: DomainData[] = [
  {
    id: 'physical',
    name: 'Physical',
    icon: Target,
    color: '#FF6B6B',
    questions: [
      {
        id: 1,
        domain: 'physical',
        question: 'How would you rate your current fitness level?',
        description: 'Consider your strength, endurance, and overall physical condition.',
      },
      {
        id: 2,
        domain: 'physical',
        question: 'How consistent are you with healthy eating habits?',
        description: 'Think about your nutrition choices and meal planning.',
      },
      {
        id: 3,
        domain: 'physical',
        question: 'How well do you manage your sleep and recovery?',
        description: 'Consider sleep quality, duration, and recovery practices.',
      },
      {
        id: 4,
        domain: 'physical',
        question: 'How effectively do you manage stress physically?',
        description: 'Think about physical stress responses and management techniques.',
      },
      {
        id: 5,
        domain: 'physical',
        question: 'How satisfied are you with your energy levels?',
        description: 'Consider your daily energy and vitality throughout the day.',
      },
    ],
  },
  {
    id: 'mental',
    name: 'Mental',
    icon: Brain,
    color: '#4DABF7',
    questions: [
      {
        id: 6,
        domain: 'mental',
        question: 'How sharp is your focus and concentration?',
        description: 'Consider your ability to concentrate on tasks without distraction.',
      },
      {
        id: 7,
        domain: 'mental',
        question: 'How effectively do you solve complex problems?',
        description: 'Think about your analytical and critical thinking abilities.',
      },
      {
        id: 8,
        domain: 'mental',
        question: 'How quickly do you learn new skills or concepts?',
        description: 'Consider your learning speed and retention abilities.',
      },
      {
        id: 9,
        domain: 'mental',
        question: 'How well do you manage information overload?',
        description: 'Think about processing and organizing large amounts of information.',
      },
      {
        id: 10,
        domain: 'mental',
        question: 'How creative are you in finding solutions?',
        description: 'Consider your ability to think outside the box and innovate.',
      },
    ],
  },
  {
    id: 'emotional',
    name: 'Emotional',
    icon: Heart,
    color: '#51CF66',
    questions: [
      {
        id: 11,
        domain: 'emotional',
        question: 'How well do you understand your emotions?',
        description: 'Consider your self-awareness and emotional intelligence.',
      },
      {
        id: 12,
        domain: 'emotional',
        question: 'How effectively do you manage stress and pressure?',
        description: 'Think about your coping mechanisms and resilience.',
      },
      {
        id: 13,
        domain: 'emotional',
        question: 'How well do you empathize with others?',
        description: 'Consider your ability to understand and share others\' feelings.',
      },
      {
        id: 14,
        domain: 'emotional',
        question: 'How quickly do you recover from setbacks?',
        description: 'Think about your emotional resilience and bounce-back ability.',
      },
      {
        id: 15,
        domain: 'emotional',
        question: 'How well do you regulate your emotional responses?',
        description: 'Consider your ability to control and express emotions appropriately.',
      },
    ],
  },
  {
    id: 'social',
    name: 'Social',
    icon: Users,
    color: '#FFB366',
    questions: [
      {
        id: 16,
        domain: 'social',
        question: 'How effectively do you communicate with others?',
        description: 'Consider your verbal and non-verbal communication skills.',
      },
      {
        id: 17,
        domain: 'social',
        question: 'How strong are your personal relationships?',
        description: 'Think about the quality and depth of your connections.',
      },
      {
        id: 18,
        domain: 'social',
        question: 'How well do you work in team environments?',
        description: 'Consider your collaboration and teamwork abilities.',
      },
      {
        id: 19,
        domain: 'social',
        question: 'How confident are you in social situations?',
        description: 'Think about your comfort level in various social contexts.',
      },
      {
        id: 20,
        domain: 'social',
        question: 'How effectively do you influence and lead others?',
        description: 'Consider your leadership skills and ability to inspire others.',
      },
    ],
  },
  {
    id: 'financial',
    name: 'Financial',
    icon: DollarSign,
    color: '#9775FA',
    questions: [
      {
        id: 21,
        domain: 'financial',
        question: 'How well do you manage your personal budget?',
        description: 'Consider your budgeting skills and expense tracking.',
      },
      {
        id: 22,
        domain: 'financial',
        question: 'How effectively do you save and invest money?',
        description: 'Think about your saving habits and investment knowledge.',
      },
      {
        id: 23,
        domain: 'financial',
        question: 'How satisfied are you with your income level?',
        description: 'Consider your earning potential and income growth.',
      },
      {
        id: 24,
        domain: 'financial',
        question: 'How well do you plan for financial goals?',
        description: 'Think about your long-term financial planning and goal setting.',
      },
      {
        id: 25,
        domain: 'financial',
        question: 'How knowledgeable are you about financial markets?',
        description: 'Consider your understanding of investments and financial instruments.',
      },
    ],
  },
  {
    id: 'spiritual',
    name: 'Spiritual',
    icon: Star,
    color: '#FFC107',
    questions: [
      {
        id: 26,
        domain: 'spiritual',
        question: 'How clear are you about your life purpose?',
        description: 'Consider your sense of meaning and direction in life.',
      },
      {
        id: 27,
        domain: 'spiritual',
        question: 'How aligned are your actions with your values?',
        description: 'Think about the consistency between your beliefs and behaviors.',
      },
      {
        id: 28,
        domain: 'spiritual',
        question: 'How connected do you feel to something greater?',
        description: 'Consider your sense of connection to nature, universe, or higher power.',
      },
      {
        id: 29,
        domain: 'spiritual',
        question: 'How regularly do you practice self-reflection?',
        description: 'Think about your habits of introspection and mindfulness.',
      },
      {
        id: 30,
        domain: 'spiritual',
        question: 'How satisfied are you with your personal growth?',
        description: 'Consider your progress in becoming your best self.',
      },
    ],
  },
];

export default function DomainsAssessmentScreen() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const scrollViewRef = useRef<ScrollView>(null);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Flatten all questions
  const allQuestions = assessmentData.flatMap(domain => domain.questions);
  const currentQuestion = allQuestions[currentQuestionIndex];
  const currentDomain = assessmentData.find(d => d.id === currentQuestion.domain);
  const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;

  const scaleLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  const handleAnswerSelect = (value: number) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      // Animate transition
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // Complete assessment and navigate to results
      router.push({
        pathname: '/assessment/results',
        params: { answers: JSON.stringify(answers) }
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const Icon = currentDomain?.icon || Target;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {currentQuestionIndex > 0 && (
            <TouchableOpacity onPress={handlePrevious} style={styles.backButton}>
              <ChevronLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
            </TouchableOpacity>
          )}
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} of {allQuestions.length}
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Question Content */}
      <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Domain Header */}
          <View style={styles.domainHeader}>
            <View style={[styles.domainIcon, { backgroundColor: currentDomain?.color + '20' }]}>
              <Icon size={32} color={currentDomain?.color} strokeWidth={1.5} />
            </View>
            <Text style={styles.domainLabel}>{currentDomain?.name} Domain</Text>
          </View>

          {/* Question */}
          <View style={styles.questionContent}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            <Text style={styles.questionDescription}>
              {currentQuestion.description}
            </Text>

            {/* Rating Scale */}
            <View style={styles.scaleContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.scaleButton,
                    {
                      backgroundColor:
                        answers[currentQuestion.id] === value
                          ? '#FFFFFF'
                          : 'transparent',
                      borderColor:
                        answers[currentQuestion.id] === value
                          ? '#FFFFFF'
                          : '#333333',
                    },
                  ]}
                  onPress={() => handleAnswerSelect(value)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.scaleButtonText,
                      {
                        color:
                          answers[currentQuestion.id] === value
                            ? '#000000'
                            : '#FFFFFF',
                      },
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.scaleLabels}>
              <Text style={styles.scaleLabel}>{scaleLabels[0]}</Text>
              <Text style={styles.scaleLabel}>{scaleLabels[4]}</Text>
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            {
              backgroundColor: answers[currentQuestion.id] ? '#FFFFFF' : '#333333',
            },
          ]}
          onPress={handleNext}
          disabled={!answers[currentQuestion.id]}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.nextButtonText,
              {
                color: answers[currentQuestion.id] ? '#000000' : '#666666',
              },
            ]}
          >
            {currentQuestionIndex === allQuestions.length - 1 ? 'Complete Assessment' : 'Next Question'}
          </Text>
          <ChevronRight
            size={20}
            color={answers[currentQuestion.id] ? '#000000' : '#666666'}
            strokeWidth={1.5}
          />
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
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  progressContainer: {
    width: '100%',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  questionContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  domainHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  domainIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  domainLabel: {
    fontSize: 18,
    color: '#4DABF7',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  questionContent: {
    alignItems: 'center',
  },
  questionText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
    paddingHorizontal: 20,
  },
  questionDescription: {
    fontSize: 16,
    color: '#A6A6A6',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  scaleButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scaleButtonText: {
    fontSize: 20,
    fontWeight: '700',
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
  },
  scaleLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 50,
    paddingTop: 20,
  },
  nextButton: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
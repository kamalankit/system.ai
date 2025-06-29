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
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AssessmentScreen() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const scrollViewRef = useRef<ScrollView>(null);
  const [fadeAnim] = useState(new Animated.Value(1));

  const questions = [
    {
      id: 0,
      domain: 'Physical',
      question: 'How would you rate your current physical fitness level?',
      description: 'Consider your strength, endurance, and overall health.',
    },
    {
      id: 1,
      domain: 'Mental',
      question: 'How sharp and focused is your mental clarity?',
      description: 'Think about your concentration, memory, and problem-solving abilities.',
    },
    {
      id: 2,
      domain: 'Emotional',
      question: 'How well do you manage your emotions and stress?',
      description: 'Consider your emotional stability and resilience.',
    },
    {
      id: 3,
      domain: 'Social',
      question: 'How satisfied are you with your social connections?',
      description: 'Think about your relationships and social interactions.',
    },
    {
      id: 4,
      domain: 'Financial',
      question: 'How confident are you in your financial management?',
      description: 'Consider your budgeting, saving, and investment skills.',
    },
    {
      id: 5,
      domain: 'Spiritual',
      question: 'How connected do you feel to your purpose and values?',
      description: 'Consider your sense of meaning and inner peace.',
    },
  ];

  const scaleLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  const handleAnswerSelect = (value: number) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      scrollViewRef.current?.scrollTo({
        x: nextQuestion * width,
        animated: true,
      });
    } else {
      // Complete assessment and navigate to main app
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        router.replace('/(tabs)');
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);
      scrollViewRef.current?.scrollTo({
        x: prevQuestion * width,
        animated: true,
      });
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            {currentQuestion > 0 && (
              <TouchableOpacity onPress={handlePrevious} style={styles.backButton}>
                <ChevronLeft size={24} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            <Text style={styles.progressText}>
              {currentQuestion + 1} of {questions.length}
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

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
        >
          {questions.map((question, index) => (
            <View key={question.id} style={styles.questionSlide}>
              <View style={styles.questionContent}>
                <Text style={styles.domainLabel}>{question.domain}</Text>
                <Text style={styles.questionText}>{question.question}</Text>
                <Text style={styles.questionDescription}>
                  {question.description}
                </Text>

                <View style={styles.scaleContainer}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <TouchableOpacity
                      key={value}
                      style={[
                        styles.scaleButton,
                        {
                          backgroundColor:
                            answers[currentQuestion] === value
                              ? '#FFFFFF'
                              : 'transparent',
                          borderColor:
                            answers[currentQuestion] === value
                              ? '#FFFFFF'
                              : '#333333',
                        },
                      ]}
                      onPress={() => handleAnswerSelect(value)}
                    >
                      <Text
                        style={[
                          styles.scaleButtonText,
                          {
                            color:
                              answers[currentQuestion] === value
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
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              {
                backgroundColor: answers[currentQuestion] ? '#FFFFFF' : '#333333',
              },
            ]}
            onPress={handleNext}
            disabled={!answers[currentQuestion]}
          >
            <Text
              style={[
                styles.nextButtonText,
                {
                  color: answers[currentQuestion] ? '#000000' : '#666666',
                },
              ]}
            >
              {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
            </Text>
            <ChevronRight
              size={20}
              color={answers[currentQuestion] ? '#000000' : '#666666'}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingHorizontal: 24,
    paddingBottom: 32,
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
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  questionSlide: {
    width,
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  questionContent: {
    alignItems: 'center',
  },
  domainLabel: {
    fontSize: 14,
    color: '#4DABF7',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  questionDescription: {
    fontSize: 16,
    color: '#A6A6A6',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  scaleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  scaleButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 24,
  },
  scaleLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 50,
    paddingTop: 20,
  },
  nextButton: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
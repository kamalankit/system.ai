import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Target, Brain, Heart, Users, Star, DollarSign, Trophy, ChevronRight, Zap, CircleAlert as AlertCircle, RefreshCw } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface DomainResult {
  id: string;
  name: string;
  icon: any;
  color: string;
  score: number;
  rank: string;
  level: string;
  description: string;
}

interface AssessmentResults {
  overallRank: string;
  overallLevel: string;
  totalScore: number;
  domains: DomainResult[];
  strengths: string[];
  improvements: string[];
}

export default function AssessmentResultsScreen() {
  const router = useRouter();
  const { answers } = useLocalSearchParams();
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [fadeAnim] = useState(new Animated.Value(1)); // Start visible
  const [scaleAnim] = useState(new Animated.Value(1)); // Start at normal scale
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Analyzing your responses...');
  const [hasAnswers, setHasAnswers] = useState(false);

  useEffect(() => {
    console.log('AssessmentResults mounted, starting calculation...');
    
    // Immediate calculation without delay to prevent black screen
    calculateResultsImmediate();
  }, []);

  const calculateResultsImmediate = async () => {
    try {
      console.log('Starting immediate assessment calculation...');
      console.log('Received answers parameter:', answers);
      
      setIsLoading(true);
      setError(null);
      
      // Check if we have valid answers
      let parsedAnswers = {};
      let answersValid = false;
      
      if (answers) {
        try {
          if (typeof answers === 'string') {
            parsedAnswers = JSON.parse(answers);
          } else if (typeof answers === 'object') {
            parsedAnswers = answers;
          }
          
          answersValid = Object.keys(parsedAnswers).length > 0;
          setHasAnswers(answersValid);
          console.log('Parsed answers successfully:', Object.keys(parsedAnswers).length, 'answers found');
        } catch (parseError) {
          console.warn('Error parsing answers:', parseError);
          setHasAnswers(false);
        }
      } else {
        console.warn('No answers parameter provided');
        setHasAnswers(false);
      }

      // Fast progress simulation for better UX
      const progressSteps = [
        { progress: 20, message: 'Processing responses...', delay: 100 },
        { progress: 40, message: 'Calculating scores...', delay: 150 },
        { progress: 60, message: 'Determining rank...', delay: 150 },
        { progress: 80, message: 'Finalizing results...', delay: 100 },
        { progress: 100, message: 'Complete!', delay: 50 }
      ];

      for (const step of progressSteps) {
        setLoadingMessage(step.message);
        setLoadingProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, step.delay));
      }

      // Calculate results
      let calculatedResults: AssessmentResults;
      
      if (answersValid) {
        console.log('Processing valid answers...');
        calculatedResults = processAssessmentAnswers(parsedAnswers);
      } else {
        console.log('Using default results due to invalid/missing answers');
        calculatedResults = getDefaultResults();
        setError('Assessment data was incomplete. Showing sample results.');
      }
      
      console.log('Setting results:', calculatedResults);
      setResults(calculatedResults);
      setIsLoading(false);

    } catch (error) {
      console.error('Error in calculateResults:', error);
      setError('Failed to calculate results. Showing default assessment.');
      setResults(getDefaultResults());
      setIsLoading(false);
    }
  };

  const getDefaultResults = (): AssessmentResults => {
    return {
      overallRank: 'C-Class',
      overallLevel: 'C',
      totalScore: 65,
      domains: [
        { id: 'physical', name: 'Physical', icon: Target, color: '#FF6B6B', score: 70, rank: 'B-Class', level: 'B', description: 'Advanced level - strong performance' },
        { id: 'mental', name: 'Mental', icon: Brain, color: '#4DABF7', score: 75, rank: 'B-Class', level: 'B', description: 'Advanced level - strong performance' },
        { id: 'emotional', name: 'Emotional', icon: Heart, color: '#51CF66', score: 60, rank: 'C-Class', level: 'C', description: 'Intermediate level - good foundation' },
        { id: 'social', name: 'Social', icon: Users, color: '#FFB366', score: 65, rank: 'C-Class', level: 'C', description: 'Intermediate level - good foundation' },
        { id: 'financial', name: 'Financial', icon: DollarSign, color: '#9775FA', score: 55, rank: 'D-Class', level: 'D', description: 'Developing level - room for growth' },
        { id: 'spiritual', name: 'Spiritual', icon: Star, color: '#FFC107', score: 68, rank: 'C-Class', level: 'C', description: 'Intermediate level - good foundation' },
      ],
      strengths: ['Mental', 'Physical'],
      improvements: ['Financial', 'Emotional'],
    };
  };

  const processAssessmentAnswers = (answers: { [key: number]: number }): AssessmentResults => {
    const domains = [
      { id: 'physical', name: 'Physical', icon: Target, color: '#FF6B6B', questions: [1, 2, 3, 4, 5] },
      { id: 'mental', name: 'Mental', icon: Brain, color: '#4DABF7', questions: [6, 7, 8, 9, 10] },
      { id: 'emotional', name: 'Emotional', icon: Heart, color: '#51CF66', questions: [11, 12, 13, 14, 15] },
      { id: 'social', name: 'Social', icon: Users, color: '#FFB366', questions: [16, 17, 18, 19, 20] },
      { id: 'financial', name: 'Financial', icon: DollarSign, color: '#9775FA', questions: [21, 22, 23, 24, 25] },
      { id: 'spiritual', name: 'Spiritual', icon: Star, color: '#FFC107', questions: [26, 27, 28, 29, 30] },
    ];

    const domainResults: DomainResult[] = domains.map(domain => {
      const domainAnswers = domain.questions.map(q => answers[q] || 3);
      const totalScore = domainAnswers.reduce((sum, score) => sum + score, 0);
      const averageScore = totalScore / domain.questions.length;
      const percentage = Math.round((averageScore / 5) * 100);
      
      const { rank, level, description } = getRankInfo(percentage);
      
      return {
        id: domain.id,
        name: domain.name,
        icon: domain.icon,
        color: domain.color,
        score: percentage,
        rank,
        level,
        description,
      };
    });

    const totalScore = domainResults.reduce((sum, domain) => sum + domain.score, 0);
    const overallScore = Math.round(totalScore / domains.length);
    const { rank: overallRank, level: overallLevel } = getRankInfo(overallScore);

    const sortedDomains = [...domainResults].sort((a, b) => b.score - a.score);
    const strengths = sortedDomains.slice(0, 2).map(d => d.name);
    const improvements = sortedDomains.slice(-2).map(d => d.name);

    return {
      overallRank,
      overallLevel,
      totalScore: overallScore,
      domains: domainResults,
      strengths,
      improvements,
    };
  };

  const getRankInfo = (percentage: number) => {
    if (percentage >= 90) return { rank: 'S-Class', level: 'S', description: 'Master level - exceptional performance' };
    if (percentage >= 80) return { rank: 'A-Class', level: 'A', description: 'Expert level - excellent performance' };
    if (percentage >= 70) return { rank: 'B-Class', level: 'B', description: 'Advanced level - strong performance' };
    if (percentage >= 60) return { rank: 'C-Class', level: 'C', description: 'Intermediate level - good foundation' };
    if (percentage >= 50) return { rank: 'D-Class', level: 'D', description: 'Developing level - room for growth' };
    return { rank: 'E-Class', level: 'E', description: 'Beginner level - starting your journey' };
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'S-Class': return '#FFD700';
      case 'A-Class': return '#4DABF7';
      case 'B-Class': return '#51CF66';
      case 'C-Class': return '#FFB366';
      case 'D-Class': return '#9775FA';
      default: return '#FF6B6B';
    }
  };

  const handleContinue = () => {
    try {
      console.log('Navigating to main app...');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation Error', 'Unable to continue. Please restart the app.');
    }
  };

  const handleRetry = () => {
    try {
      console.log('Retrying assessment...');
      router.replace('/assessment');
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation Error', 'Unable to retry. Please restart the app.');
    }
  };

  const handleSkipToApp = () => {
    console.log('Skipping to main app...');
    router.replace('/(tabs)');
  };

  // Enhanced loading state with better visibility
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContent}>
          <Animated.View style={[styles.loadingIcon, { transform: [{ scale: scaleAnim }] }]}>
            <Zap size={48} color="#4DABF7" strokeWidth={2} />
          </Animated.View>
          <Text style={styles.loadingTitle}>Calculating your Hunter rank...</Text>
          <Text style={styles.loadingSubtext}>{loadingMessage}</Text>
          
          {/* Enhanced Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${loadingProgress}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{loadingProgress}%</Text>
          </View>

          {/* Emergency Skip Button */}
          {loadingProgress > 50 && (
            <TouchableOpacity 
              style={styles.emergencySkipButton}
              onPress={handleSkipToApp}
              activeOpacity={0.8}
            >
              <Text style={styles.emergencySkipText}>Skip to Dashboard</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Main results display with enhanced visibility
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <AlertCircle size={18} color="#FFB366" strokeWidth={2} />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.celebrationIcon}>
              <Trophy size={48} color="#FFD700" strokeWidth={2} />
            </View>
            <Text style={styles.congratsText}>Assessment Complete!</Text>
            <Text style={styles.rankAnnouncement}>
              You are a <Text style={[styles.rankText, { color: getRankColor(results?.overallRank || 'C-Class') }]}>
                {results?.overallRank || 'C-Class'}
              </Text> Hunter
            </Text>
            <Text style={styles.scoreText}>Overall Score: {results?.totalScore || 65}%</Text>
          </View>

          {/* Overall Rank Card */}
          <View style={styles.overallCard}>
            <View style={styles.overallHeader}>
              <Text style={styles.overallTitle}>Your Hunter Rank</Text>
              <View style={[styles.rankBadge, { backgroundColor: getRankColor(results?.overallRank || 'C-Class') + '30' }]}>
                <Text style={[styles.rankBadgeText, { color: getRankColor(results?.overallRank || 'C-Class') }]}>
                  {results?.overallLevel || 'C'}
                </Text>
              </View>
            </View>
            <Text style={styles.rankDescription}>
              {getRankInfo(results?.totalScore || 65).description}
            </Text>
          </View>

          {/* Domain Results */}
          {results && (
            <View style={styles.domainsSection}>
              <Text style={styles.sectionTitle}>Domain Breakdown</Text>
              <View style={styles.domainsGrid}>
                {results.domains.map((domain) => {
                  const Icon = domain.icon;
                  return (
                    <View key={domain.id} style={styles.domainCard}>
                      <View style={[styles.domainIcon, { backgroundColor: domain.color + '25' }]}>
                        <Icon size={28} color={domain.color} strokeWidth={2} />
                      </View>
                      <Text style={styles.domainName}>{domain.name}</Text>
                      <View style={styles.domainScore}>
                        <Text style={styles.domainScoreText}>{domain.score}%</Text>
                        <Text style={styles.domainRank}>{domain.level}-Class</Text>
                      </View>
                      <View style={styles.progressBarSmall}>
                        <View 
                          style={[
                            styles.progressFillSmall, 
                            { width: `${domain.score}%`, backgroundColor: domain.color }
                          ]} 
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Insights Section */}
          {results && (
            <View style={styles.insightsSection}>
              <Text style={styles.sectionTitle}>Your Evolution Path</Text>
              
              <View style={styles.insightCard}>
                <Text style={styles.insightTitle}>🎯 Your Strengths</Text>
                <Text style={styles.insightText}>
                  You excel in <Text style={styles.highlightText}>{results.strengths.join(' and ')}</Text>. 
                  These are your power domains - leverage them to accelerate growth in other areas.
                </Text>
              </View>

              <View style={styles.insightCard}>
                <Text style={styles.insightTitle}>🚀 Growth Opportunities</Text>
                <Text style={styles.insightText}>
                  Focus on developing your <Text style={styles.highlightText}>{results.improvements.join(' and ')}</Text> domains. 
                  Small improvements here will have the biggest impact on your overall evolution.
                </Text>
              </View>

              <View style={styles.insightCard}>
                <Text style={styles.insightTitle}>⚡ Next Steps</Text>
                <Text style={styles.insightText}>
                  Your personalized quest system is ready! Complete daily challenges to earn XP, 
                  level up your domains, and climb the Hunter ranks.
                </Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {!hasAnswers && (
              <TouchableOpacity 
                style={styles.retryButton} 
                onPress={handleRetry}
                activeOpacity={0.8}
              >
                <RefreshCw size={18} color="#4DABF7" strokeWidth={2} />
                <Text style={styles.retryButtonText}>Take Real Assessment</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.continueButton} 
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Begin Your Evolution</Text>
              <ChevronRight size={22} color="#000000" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Loading Screen Styles - Enhanced Visibility
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000', // Solid black background
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#000000',
  },
  loadingIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1a1a1a', // Darker background for contrast
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#4DABF7',
  },
  loadingTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 12,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#B0B0B0', // Lighter gray for better visibility
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 40,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#2a2a2a', // Darker background
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#404040',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4DABF7',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    color: '#4DABF7',
    fontWeight: '700',
  },
  emergencySkipButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: '#4DABF7',
  },
  emergencySkipText: {
    fontSize: 16,
    color: '#4DABF7',
    fontWeight: '600',
  },

  // Main Screen Styles - Enhanced Visibility
  container: {
    flex: 1,
    backgroundColor: '#000000', // Solid black background
  },
  content: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    paddingBottom: 60,
    backgroundColor: '#000000',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFB366' + '25',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFB366',
  },
  errorBannerText: {
    fontSize: 15,
    color: '#FFB366',
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 24 : 16,
    paddingBottom: 40,
    backgroundColor: '#000000',
  },
  celebrationIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD700' + '25',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  congratsText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  rankAnnouncement: {
    fontSize: 22,
    color: '#CCCCCC', // Lighter gray for better visibility
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
  },
  rankText: {
    fontWeight: '800',
    fontSize: 24,
  },
  scoreText: {
    fontSize: 18,
    color: '#999999', // Lighter gray
    fontWeight: '600',
  },
  overallCard: {
    backgroundColor: '#1a1a1a', // Darker background for contrast
    borderRadius: 20,
    padding: 28,
    marginHorizontal: 24,
    marginBottom: 36,
    borderWidth: 1,
    borderColor: '#404040', // Visible border
  },
  overallHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overallTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rankBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  rankBadgeText: {
    fontSize: 18,
    fontWeight: '800',
  },
  rankDescription: {
    fontSize: 17,
    color: '#CCCCCC', // Lighter for better visibility
    lineHeight: 26,
    fontWeight: '500',
  },
  domainsSection: {
    marginBottom: 36,
    paddingHorizontal: 24,
    backgroundColor: '#000000',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  domainsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  domainCard: {
    width: (width - 80) / 2,
    backgroundColor: '#1a1a1a', // Darker background
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#404040', // Visible border
    alignItems: 'center',
  },
  domainIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  domainName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  domainScore: {
    alignItems: 'center',
    marginBottom: 16,
  },
  domainScoreText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  domainRank: {
    fontSize: 13,
    color: '#AAAAAA', // Lighter gray
    fontWeight: '600',
  },
  progressBarSmall: {
    width: '100%',
    height: 6,
    backgroundColor: '#2a2a2a',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#404040',
  },
  progressFillSmall: {
    height: '100%',
    borderRadius: 3,
  },
  insightsSection: {
    marginBottom: 36,
    paddingHorizontal: 24,
    backgroundColor: '#000000',
  },
  insightCard: {
    backgroundColor: '#1a1a1a', // Darker background
    borderRadius: 18,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#404040', // Visible border
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  insightText: {
    fontSize: 16,
    color: '#CCCCCC', // Lighter for better visibility
    lineHeight: 24,
    fontWeight: '500',
  },
  highlightText: {
    color: '#4DABF7',
    fontWeight: '700',
  },
  actionButtons: {
    paddingHorizontal: 24,
    gap: 20,
    paddingBottom: 40,
    backgroundColor: '#000000',
  },
  retryButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#4DABF7',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  retryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4DABF7',
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  continueButtonText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#000000',
  },
});
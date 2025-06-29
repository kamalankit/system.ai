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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Target, Brain, Heart, Users, Star, DollarSign, Trophy, ChevronRight, Zap, CircleAlert as AlertCircle } from 'lucide-react-native';

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
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Analyzing your responses...');

  useEffect(() => {
    calculateResults();
  }, [answers]);

  const calculateResults = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setLoadingProgress(0);
      
      // Simulate progress updates with messages
      const progressSteps = [
        { progress: 20, message: 'Analyzing your responses...' },
        { progress: 40, message: 'Calculating domain scores...' },
        { progress: 60, message: 'Determining your rank...' },
        { progress: 80, message: 'Generating insights...' },
        { progress: 100, message: 'Finalizing results...' }
      ];

      for (const step of progressSteps) {
        setLoadingMessage(step.message);
        setLoadingProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      // Calculate actual results
      let calculatedResults: AssessmentResults;
      
      if (answers && typeof answers === 'string' && answers.trim() !== '') {
        try {
          const parsedAnswers = JSON.parse(answers);
          if (Object.keys(parsedAnswers).length > 0) {
            calculatedResults = processAssessmentAnswers(parsedAnswers);
          } else {
            throw new Error('No answers found in parsed data');
          }
        } catch (parseError) {
          console.warn('Error parsing answers, using default results:', parseError);
          calculatedResults = getDefaultResults();
        }
      } else {
        console.warn('No valid answers provided, using default results');
        calculatedResults = getDefaultResults();
      }
      
      setResults(calculatedResults);
      setIsLoading(false);
      
      // Animate in results
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error('Error calculating results:', error);
      setError('Failed to calculate results. Using default assessment.');
      setResults(getDefaultResults());
      setIsLoading(false);
      
      // Still animate in even with error
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
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
    router.replace('/(tabs)');
  };

  const handleRetry = () => {
    router.replace('/assessment');
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.loadingIcon, { transform: [{ scale: scaleAnim }] }]}>
            <Zap size={40} color="#FFFFFF" strokeWidth={1.5} />
          </Animated.View>
          <Text style={styles.loadingText}>Calculating your Hunter rank...</Text>
          <Text style={styles.loadingSubtext}>{loadingMessage}</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  { width: `${loadingProgress}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{loadingProgress}%</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Error state (but still show results)
  if (error && results) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          {/* Error Banner */}
          <View style={styles.errorBanner}>
            <AlertCircle size={16} color="#FFB366" strokeWidth={1.5} />
            <Text style={styles.errorBannerText}>Using default assessment results</Text>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.celebrationIcon}>
                <Trophy size={40} color="#FFD700" strokeWidth={1.5} />
              </View>
              <Text style={styles.congratsText}>Assessment Complete!</Text>
              <Text style={styles.rankAnnouncement}>
                You are a <Text style={[styles.rankText, { color: getRankColor(results.overallRank) }]}>
                  {results.overallRank}
                </Text> Hunter
              </Text>
              <Text style={styles.scoreText}>Overall Score: {results.totalScore}%</Text>
            </View>

            {/* Overall Rank Card */}
            <View style={styles.overallCard}>
              <View style={styles.overallHeader}>
                <Text style={styles.overallTitle}>Your Hunter Rank</Text>
                <View style={[styles.rankBadge, { backgroundColor: getRankColor(results.overallRank) + '20' }]}>
                  <Text style={[styles.rankBadgeText, { color: getRankColor(results.overallRank) }]}>
                    {results.overallLevel}
                  </Text>
                </View>
              </View>
              <Text style={styles.rankDescription}>
                {getRankInfo(results.totalScore).description}
              </Text>
            </View>

            {/* Domain Results */}
            <View style={styles.domainsSection}>
              <Text style={styles.sectionTitle}>Domain Breakdown</Text>
              <View style={styles.domainsGrid}>
                {results.domains.map((domain) => {
                  const Icon = domain.icon;
                  return (
                    <View key={domain.id} style={styles.domainCard}>
                      <View style={[styles.domainIcon, { backgroundColor: domain.color + '20' }]}>
                        <Icon size={24} color={domain.color} strokeWidth={1.5} />
                      </View>
                      <Text style={styles.domainName}>{domain.name}</Text>
                      <View style={styles.domainScore}>
                        <Text style={styles.domainScoreText}>{domain.score}%</Text>
                        <Text style={styles.domainRank}>{domain.level}-Class</Text>
                      </View>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { width: `${domain.score}%`, backgroundColor: domain.color }
                          ]} 
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Insights */}
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

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.retryButton} 
                onPress={handleRetry}
                activeOpacity={0.8}
              >
                <Text style={styles.retryButtonText}>Retake Assessment</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.continueButton} 
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <Text style={styles.continueButtonText}>Begin Your Evolution</Text>
                <ChevronRight size={20} color="#000000" strokeWidth={1.5} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // Normal results state
  if (!results) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <AlertCircle size={40} color="#FF6B6B" strokeWidth={1.5} />
          </View>
          <Text style={styles.errorTitle}>Unable to Load Results</Text>
          <Text style={styles.errorMessage}>
            We couldn't process your assessment results. Please try again.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry Assessment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={handleContinue}>
            <Text style={styles.skipButtonText}>Skip to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.celebrationIcon}>
              <Trophy size={40} color="#FFD700" strokeWidth={1.5} />
            </View>
            <Text style={styles.congratsText}>Assessment Complete!</Text>
            <Text style={styles.rankAnnouncement}>
              You are a <Text style={[styles.rankText, { color: getRankColor(results.overallRank) }]}>
                {results.overallRank}
              </Text> Hunter
            </Text>
            <Text style={styles.scoreText}>Overall Score: {results.totalScore}%</Text>
          </View>

          {/* Overall Rank Card */}
          <View style={styles.overallCard}>
            <View style={styles.overallHeader}>
              <Text style={styles.overallTitle}>Your Hunter Rank</Text>
              <View style={[styles.rankBadge, { backgroundColor: getRankColor(results.overallRank) + '20' }]}>
                <Text style={[styles.rankBadgeText, { color: getRankColor(results.overallRank) }]}>
                  {results.overallLevel}
                </Text>
              </View>
            </View>
            <Text style={styles.rankDescription}>
              {getRankInfo(results.totalScore).description}
            </Text>
          </View>

          {/* Domain Results */}
          <View style={styles.domainsSection}>
            <Text style={styles.sectionTitle}>Domain Breakdown</Text>
            <View style={styles.domainsGrid}>
              {results.domains.map((domain) => {
                const Icon = domain.icon;
                return (
                  <View key={domain.id} style={styles.domainCard}>
                    <View style={[styles.domainIcon, { backgroundColor: domain.color + '20' }]}>
                      <Icon size={24} color={domain.color} strokeWidth={1.5} />
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

          {/* Insights */}
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

          {/* Continue Button */}
          <TouchableOpacity 
            style={styles.continueButton} 
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Begin Your Evolution</Text>
            <ChevronRight size={20} color="#000000" strokeWidth={1.5} />
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B6B' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 16,
    color: '#A6A6A6',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFB366' + '20',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFB366' + '40',
  },
  errorBannerText: {
    fontSize: 14,
    color: '#FFB366',
    fontWeight: '500',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#A6A6A6',
    textAlign: 'center',
    fontWeight: '400',
    marginBottom: 32,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#333333',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4DABF7',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#4DABF7',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 32,
  },
  celebrationIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFD700' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  rankAnnouncement: {
    fontSize: 20,
    color: '#A6A6A6',
    textAlign: 'center',
    marginBottom: 8,
  },
  rankText: {
    fontWeight: '700',
    fontSize: 22,
  },
  scoreText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  overallCard: {
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#333333',
  },
  overallHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  overallTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rankBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  rankBadgeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  rankDescription: {
    fontSize: 16,
    color: '#A6A6A6',
    lineHeight: 24,
  },
  domainsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  domainsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  domainCard: {
    width: (width - 64) / 2,
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  domainIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  domainName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  domainScore: {
    alignItems: 'center',
    marginBottom: 12,
  },
  domainScoreText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  domainRank: {
    fontSize: 12,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  progressBarSmall: {
    width: '100%',
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFillSmall: {
    height: '100%',
    borderRadius: 2,
  },
  insightsSection: {
    marginBottom: 32,
  },
  insightCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#A6A6A6',
    lineHeight: 22,
  },
  highlightText: {
    color: '#4DABF7',
    fontWeight: '600',
  },
  actionButtons: {
    gap: 16,
  },
  retryButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A6A6A6',
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A6A6A6',
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
});
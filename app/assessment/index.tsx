import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight, Target, Brain, Heart, Users, Star, DollarSign, Zap } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AssessmentIntroScreen() {
  const router = useRouter();

  const domains = [
    {
      id: 'physical',
      name: 'Physical',
      icon: Target,
      color: '#FF6B6B',
      description: 'Strength, endurance, health, and vitality',
      examples: ['Fitness level', 'Energy levels', 'Sleep quality', 'Nutrition habits']
    },
    {
      id: 'mental',
      name: 'Mental',
      icon: Brain,
      color: '#4DABF7',
      description: 'Cognitive abilities, focus, and learning',
      examples: ['Concentration', 'Memory', 'Problem-solving', 'Learning speed']
    },
    {
      id: 'emotional',
      name: 'Emotional',
      icon: Heart,
      color: '#51CF66',
      description: 'Emotional intelligence and regulation',
      examples: ['Self-awareness', 'Stress management', 'Empathy', 'Resilience']
    },
    {
      id: 'social',
      name: 'Social',
      icon: Users,
      color: '#FFB366',
      description: 'Relationships and communication skills',
      examples: ['Communication', 'Leadership', 'Networking', 'Teamwork']
    },
    {
      id: 'financial',
      name: 'Financial',
      icon: DollarSign,
      color: '#9775FA',
      description: 'Money management and wealth building',
      examples: ['Budgeting', 'Investing', 'Income growth', 'Financial planning']
    },
    {
      id: 'spiritual',
      name: 'Spiritual',
      icon: Star,
      color: '#FFC107',
      description: 'Purpose, meaning, and inner growth',
      examples: ['Life purpose', 'Values alignment', 'Inner peace', 'Personal growth']
    },
  ];

  const handleStartAssessment = () => {
    router.push('/assessment/domains');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Zap size={40} color="#FFFFFF" strokeWidth={1.5} />
          </View>
          <Text style={styles.title}>Hunter Assessment</Text>
          <Text style={styles.subtitle}>
            Discover your current rank across the six domains of human evolution
          </Text>
        </View>

        {/* Assessment Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>What You'll Discover</Text>
          <Text style={styles.infoDescription}>
            This comprehensive assessment will evaluate your current level across six critical life domains. 
            Your results will determine your starting rank and create a personalized evolution path.
          </Text>
          
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Target size={16} color="#4DABF7" strokeWidth={1.5} />
              </View>
              <Text style={styles.benefitText}>Identify your strongest and weakest domains</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Brain size={16} color="#4DABF7" strokeWidth={1.5} />
              </View>
              <Text style={styles.benefitText}>Get your Hunter rank (E-Class to S-Class)</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Heart size={16} color="#4DABF7" strokeWidth={1.5} />
              </View>
              <Text style={styles.benefitText}>Receive personalized quest recommendations</Text>
            </View>
          </View>
        </View>

        {/* Domains Preview */}
        <View style={styles.domainsSection}>
          <Text style={styles.domainsTitle}>Six Domains of Evolution</Text>
          <View style={styles.domainsGrid}>
            {domains.map((domain) => {
              const Icon = domain.icon;
              return (
                <View key={domain.id} style={styles.domainCard}>
                  <View style={[styles.domainIconContainer, { backgroundColor: domain.color + '20' }]}>
                    <Icon size={24} color={domain.color} strokeWidth={1.5} />
                  </View>
                  <Text style={styles.domainName}>{domain.name}</Text>
                  <Text style={styles.domainDescription}>{domain.description}</Text>
                  <View style={styles.examplesList}>
                    {domain.examples.slice(0, 2).map((example, index) => (
                      <Text key={index} style={styles.exampleText}>• {example}</Text>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Assessment Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>Assessment Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailNumber}>6</Text>
              <Text style={styles.detailLabel}>Domains</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailNumber}>30</Text>
              <Text style={styles.detailLabel}>Questions</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailNumber}>5</Text>
              <Text style={styles.detailLabel}>Minutes</Text>
            </View>
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity 
          style={styles.startButton} 
          onPress={handleStartAssessment}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Begin Assessment</Text>
          <ChevronRight size={20} color="#000000" strokeWidth={1.5} />
        </TouchableOpacity>

        {/* Footer Note */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Your responses are private and used only to personalize your Hunter experience
          </Text>
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
    paddingBottom: 40,
  },
  iconContainer: {
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#A6A6A6',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  infoSection: {
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#333333',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  infoDescription: {
    fontSize: 16,
    color: '#A6A6A6',
    lineHeight: 24,
    marginBottom: 24,
  },
  benefitsList: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4DABF7' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
    fontWeight: '500',
  },
  domainsSection: {
    marginBottom: 32,
  },
  domainsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
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
  },
  domainIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  domainName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  domainDescription: {
    fontSize: 12,
    color: '#A6A6A6',
    lineHeight: 16,
    marginBottom: 12,
  },
  examplesList: {
    gap: 4,
  },
  exampleText: {
    fontSize: 11,
    color: '#666666',
    lineHeight: 14,
  },
  detailsSection: {
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#333333',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4DABF7',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
});
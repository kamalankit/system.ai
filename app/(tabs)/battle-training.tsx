import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Target, 
  Eye, 
  Settings, 
  Brain, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  Zap,
  Shield,
  Crosshair
} from 'lucide-react-native';

export default function BattleTrainingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const trainingModules = [
    {
      id: 'visualization',
      title: 'Visualization Goals',
      description: 'Create visual representations of your future self and goals',
      icon: Eye,
      color: '#4DABF7',
      route: '/battle-training/visualization',
      progress: 65,
      stats: '3 active goals',
    },
    {
      id: 'system',
      title: 'System Over Motivation',
      description: 'Build bulletproof systems that work regardless of motivation',
      icon: Settings,
      color: '#51CF66',
      route: '/battle-training/system',
      progress: 40,
      stats: '12 day streak',
    },
    {
      id: 'clarity',
      title: 'Clarity & Direction',
      description: 'Define your path and track progress with precision',
      icon: Crosshair,
      color: '#FFB366',
      route: '/battle-training/clarity',
      progress: 80,
      stats: '5 domains tracked',
    },
    {
      id: 'problem-solving',
      title: 'Problem Solving',
      description: 'Systematic approach to identifying and solving challenges',
      icon: Brain,
      color: '#9775FA',
      route: '/problem-solving/wizard',
      progress: 30,
      stats: '2 active problems',
    },
    {
      id: 'recovery',
      title: 'Recovery Protocol',
      description: 'Bounce back stronger when things go wrong',
      icon: Shield,
      color: '#FF6B6B',
      route: '/problem-solving/recovery',
      progress: 55,
      stats: '3 recoveries',
    },
    {
      id: 'analytics',
      title: 'Progress Analytics',
      description: 'Deep insights into your patterns and progress',
      icon: TrendingUp,
      color: '#FFC107',
      route: '/progress/analytics',
      progress: 75,
      stats: '85% success rate',
    },
  ];

  const quickStats = [
    {
      label: 'Success Rate',
      value: '85%',
      change: '+12%',
      color: '#51CF66',
      icon: TrendingUp,
    },
    {
      label: 'Active Goals',
      value: '8',
      change: '+2',
      color: '#4DABF7',
      icon: Target,
    },
    {
      label: 'System Streak',
      value: '12',
      change: '+1',
      color: '#FFB366',
      icon: Zap,
    },
    {
      label: 'Problems Solved',
      value: '15',
      change: '+3',
      color: '#9775FA',
      icon: Brain,
    },
  ];

  const handleModulePress = (module: any) => {
    router.push(module.route);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Battle Training</Text>
        <Text style={styles.headerSubtitle}>Systematic Personal Evolution</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? 88 + insets.bottom + 20 : 68 + insets.bottom + 20
        }}
      >
        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Training Overview</Text>
          <View style={styles.statsGrid}>
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                    <Icon size={20} color={stat.color} strokeWidth={1.5} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <Text style={[styles.statChange, { color: stat.color }]}>
                    {stat.change}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Training Modules */}
        <View style={styles.modulesSection}>
          <Text style={styles.sectionTitle}>Training Modules</Text>
          <View style={styles.modulesList}>
            {trainingModules.map((module) => {
              const Icon = module.icon;
              return (
                <TouchableOpacity
                  key={module.id}
                  style={styles.moduleCard}
                  onPress={() => handleModulePress(module)}
                  activeOpacity={0.8}
                >
                  <View style={styles.moduleHeader}>
                    <View style={[styles.moduleIcon, { backgroundColor: module.color + '20' }]}>
                      <Icon size={24} color={module.color} strokeWidth={1.5} />
                    </View>
                    <View style={styles.moduleInfo}>
                      <Text style={styles.moduleTitle}>{module.title}</Text>
                      <Text style={styles.moduleDescription}>{module.description}</Text>
                    </View>
                    <ChevronRight size={20} color="#666666" strokeWidth={1.5} />
                  </View>

                  <View style={styles.moduleProgress}>
                    <View style={styles.progressInfo}>
                      <Text style={styles.progressText}>{module.progress}% Complete</Text>
                      <Text style={styles.moduleStats}>{module.stats}</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${module.progress}%`,
                            backgroundColor: module.color 
                          }
                        ]} 
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Daily Focus */}
        <View style={styles.focusSection}>
          <Text style={styles.sectionTitle}>Today's Focus</Text>
          <View style={styles.focusCard}>
            <View style={styles.focusHeader}>
              <Calendar size={20} color="#4DABF7" strokeWidth={1.5} />
              <Text style={styles.focusTitle}>Daily System Check</Text>
            </View>
            <Text style={styles.focusDescription}>
              Review your core systems and ensure you're on track for today's goals.
            </Text>
            <TouchableOpacity 
              style={styles.focusButton}
              onPress={() => router.push('/battle-training/system')}
              activeOpacity={0.8}
            >
              <Text style={styles.focusButtonText}>Start Daily Check</Text>
              <ChevronRight size={16} color="#FFFFFF" strokeWidth={1.5} />
            </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#A6A6A6',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  modulesSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  modulesList: {
    gap: 16,
  },
  moduleCard: {
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 14,
    color: '#A6A6A6',
    lineHeight: 20,
  },
  moduleProgress: {
    marginTop: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  moduleStats: {
    fontSize: 12,
    color: '#A6A6A6',
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
  focusSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  focusCard: {
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  focusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  focusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  focusDescription: {
    fontSize: 14,
    color: '#A6A6A6',
    lineHeight: 20,
    marginBottom: 16,
  },
  focusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4DABF7',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  focusButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
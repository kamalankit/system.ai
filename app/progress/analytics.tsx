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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, TrendingUp, TrendingDown, Minus, Calendar, Target, Brain, Heart, Users, Star, DollarSign, Flame, Trophy, ChartBar as BarChart3, ChartPie as PieChart, Activity } from 'lucide-react-native';
import { enhancedUserData, getSuccessRateForPeriod, getDomainSuccessRate, getStreakData, getTrendDirection } from '@/data/enhancedMockData';
import { userData } from '@/data/mockData';

const { width } = Dimensions.get('window');

export default function ProgressAnalyticsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const domains = [
    { ...userData.domains[0], icon: Target },
    { ...userData.domains[1], icon: Brain },
    { ...userData.domains[2], icon: Heart },
    { ...userData.domains[3], icon: Users },
    { ...userData.domains[4], icon: DollarSign },
    { ...userData.domains[5], icon: Star },
  ];

  const periods = [
    { id: '7d', label: '7 Days', days: 7 },
    { id: '30d', label: '30 Days', days: 30 },
    { id: '90d', label: '90 Days', days: 90 },
  ];

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return '#51CF66';
    if (rate >= 50) return '#FFB366';
    return '#FF6B6B';
  };

  const getTrendIcon = () => {
    const trend = getTrendDirection();
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = () => {
    const trend = getTrendDirection();
    switch (trend) {
      case 'up': return '#51CF66';
      case 'down': return '#FF6B6B';
      default: return '#A6A6A6';
    }
  };

  const { currentStreak, bestStreak } = getStreakData();
  const currentPeriod = periods.find(p => p.id === selectedPeriod)!;
  const periodSuccessRate = getSuccessRateForPeriod(currentPeriod.days);

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
        <Text style={styles.headerTitle}>Progress Analytics</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? 88 + insets.bottom + 20 : 68 + insets.bottom + 20
        }}
      >
        {/* Period Selector */}
        <View style={styles.periodSection}>
          <Text style={styles.sectionTitle}>Time Period</Text>
          <View style={styles.periodSelector}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.id}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.id && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod(period.id as any)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    selectedPeriod === period.id && styles.periodButtonTextActive,
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Overall Success Rate */}
        <View style={styles.overallSection}>
          <Text style={styles.sectionTitle}>Overall Performance</Text>
          <View style={styles.overallCard}>
            <View style={styles.overallHeader}>
              <View style={styles.overallIconContainer}>
                <Activity size={32} color="#4DABF7" strokeWidth={1.5} />
              </View>
              <View style={styles.overallInfo}>
                <Text style={styles.overallLabel}>Success Rate</Text>
                <Text style={styles.overallSubtitle}>{currentPeriod.label}</Text>
              </View>
            </View>

            <View style={styles.overallStats}>
              <View style={styles.mainStat}>
                <Text style={[
                  styles.mainStatValue,
                  { color: getSuccessRateColor(periodSuccessRate) }
                ]}>
                  {periodSuccessRate}%
                </Text>
                <View style={styles.trendContainer}>
                  {React.createElement(getTrendIcon(), {
                    size: 16,
                    color: getTrendColor(),
                    strokeWidth: 1.5
                  })}
                  <Text style={[styles.trendText, { color: getTrendColor() }]}>
                    {getTrendDirection() === 'stable' ? 'Stable' : 
                     getTrendDirection() === 'up' ? 'Improving' : 'Declining'}
                  </Text>
                </View>
              </View>

              <View style={styles.streakStats}>
                <View style={styles.streakStat}>
                  <Flame size={20} color="#FF6B6B" strokeWidth={1.5} />
                  <Text style={styles.streakValue}>{currentStreak}</Text>
                  <Text style={styles.streakLabel}>Current Streak</Text>
                </View>
                <View style={styles.streakStat}>
                  <Trophy size={20} color="#FFB366" strokeWidth={1.5} />
                  <Text style={styles.streakValue}>{bestStreak}</Text>
                  <Text style={styles.streakLabel}>Best Streak</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Domain Performance */}
        <View style={styles.domainSection}>
          <Text style={styles.sectionTitle}>Domain Performance</Text>
          <View style={styles.domainGrid}>
            {domains.map((domain) => {
              const Icon = domain.icon;
              const successRate = getDomainSuccessRate(domain.id, currentPeriod.days);
              
              return (
                <View key={domain.id} style={styles.domainCard}>
                  <View style={styles.domainHeader}>
                    <View style={[styles.domainIcon, { backgroundColor: domain.color + '20' }]}>
                      <Icon size={20} color={domain.color} strokeWidth={1.5} />
                    </View>
                    <Text style={styles.domainName}>{domain.name}</Text>
                  </View>
                  
                  <View style={styles.domainStats}>
                    <Text style={[
                      styles.domainSuccessRate,
                      { color: getSuccessRateColor(successRate) }
                    ]}>
                      {successRate}%
                    </Text>
                    <Text style={styles.domainLabel}>Success Rate</Text>
                  </View>

                  <View style={styles.domainProgress}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${successRate}%`,
                            backgroundColor: domain.color 
                          }
                        ]} 
                      />
                    </View>
                  </View>

                  <View style={styles.domainMeta}>
                    <Text style={styles.domainXP}>{domain.xp.toLocaleString()} XP</Text>
                    <Text style={styles.domainRank}>{domain.rank}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Weekly Breakdown */}
        <View style={styles.weeklySection}>
          <Text style={styles.sectionTitle}>Weekly Breakdown</Text>
          <View style={styles.weeklyChart}>
            <View style={styles.chartHeader}>
              <BarChart3 size={20} color="#4DABF7" strokeWidth={1.5} />
              <Text style={styles.chartTitle}>Success Rate Trend</Text>
            </View>
            
            <View style={styles.chartContainer}>
              {enhancedUserData.successRates.weeklyTrend.map((rate, index) => (
                <View key={index} style={styles.chartBar}>
                  <View 
                    style={[
                      styles.barFill,
                      { 
                        height: `${rate}%`,
                        backgroundColor: getSuccessRateColor(rate)
                      }
                    ]}
                  />
                  <Text style={styles.barLabel}>W{index + 1}</Text>
                  <Text style={styles.barValue}>{rate}%</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Key Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <TrendingUp size={20} color="#51CF66" strokeWidth={1.5} />
              <Text style={styles.insightTitle}>Strongest Domain</Text>
            </View>
            <Text style={styles.insightText}>
              Your {domains.reduce((best, domain) => 
                getDomainSuccessRate(domain.id) > getDomainSuccessRate(best.id) ? domain : best
              ).name} domain is performing exceptionally well with consistent progress.
            </Text>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Target size={20} color="#FFB366" strokeWidth={1.5} />
              <Text style={styles.insightTitle}>Growth Opportunity</Text>
            </View>
            <Text style={styles.insightText}>
              Focus on your {domains.reduce((weakest, domain) => 
                getDomainSuccessRate(domain.id) < getDomainSuccessRate(weakest.id) ? domain : weakest
              ).name} domain to achieve better overall balance and unlock new achievements.
            </Text>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Calendar size={20} color="#9775FA" strokeWidth={1.5} />
              <Text style={styles.insightTitle}>Consistency Pattern</Text>
            </View>
            <Text style={styles.insightText}>
              Your {currentStreak}-day streak shows strong commitment. Maintain this momentum to reach your next milestone.
            </Text>
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
  periodSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#333333',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#4DABF7',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  overallSection: {
    marginBottom: 32,
  },
  overallCard: {
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  overallHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  overallIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4DABF7' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  overallInfo: {
    flex: 1,
  },
  overallLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  overallSubtitle: {
    fontSize: 14,
    color: '#A6A6A6',
  },
  overallStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainStat: {
    alignItems: 'center',
  },
  mainStatValue: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  streakStats: {
    gap: 16,
  },
  streakStat: {
    alignItems: 'center',
    gap: 4,
  },
  streakValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  streakLabel: {
    fontSize: 12,
    color: '#A6A6A6',
  },
  domainSection: {
    marginBottom: 32,
  },
  domainGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  domainCard: {
    width: (width - 72) / 2,
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  domainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  domainIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  domainName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  domainStats: {
    alignItems: 'center',
    marginBottom: 12,
  },
  domainSuccessRate: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  domainLabel: {
    fontSize: 12,
    color: '#A6A6A6',
  },
  domainProgress: {
    marginBottom: 12,
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
  domainMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  domainXP: {
    fontSize: 12,
    color: '#4DABF7',
    fontWeight: '600',
  },
  domainRank: {
    fontSize: 12,
    color: '#A6A6A6',
  },
  weeklySection: {
    marginBottom: 32,
  },
  weeklyChart: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  barFill: {
    width: '80%',
    borderRadius: 2,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 10,
    color: '#A6A6A6',
    marginBottom: 2,
  },
  barValue: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
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
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#A6A6A6',
    lineHeight: 20,
  },
});
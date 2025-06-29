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
import { TrendingUp, Calendar, Award, Target, Brain, Heart, Users, Star, Zap, ChartBar as BarChart3, ChartPie as PieChart } from 'lucide-react-native';
import ProgressRing from '@/components/ProgressRing';
import { userData } from '@/data/mockData';

const { width } = Dimensions.get('window');

export default function EvolutionScreen() {
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const getDomainIcon = (domain: string) => {
    const icons = {
      physical: Target,
      mental: Brain,
      emotional: Heart,
      social: Users,
      spiritual: Star,
      skill: Zap,
    };
    return icons[domain as keyof typeof icons] || Target;
  };

  const OverviewChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Domain Progress</Text>
      <View style={styles.domainsChart}>
        {userData.domains.map((domain) => {
          const Icon = getDomainIcon(domain.id);
          return (
            <TouchableOpacity
              key={domain.id}
              style={styles.domainChartItem}
              onPress={() => setSelectedDomain(domain.id)}
            >
              <ProgressRing
                progress={domain.progress}
                size={60}
                strokeWidth={3}
                color={domain.color}
                showText={false}
              />
              <View style={styles.domainChartInfo}>
                <Icon size={16} color={domain.color} strokeWidth={1.5} />
                <Text style={styles.domainChartName}>{domain.name}</Text>
                <Text style={styles.domainChartProgress}>{domain.progress}%</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const StatsCards = () => (
    <View style={styles.statsGrid}>
      <View style={styles.statCard}>
        <View style={styles.statCardHeader}>
          <TrendingUp size={16} color="#51CF66" strokeWidth={1.5} />
          <Text style={styles.statCardTitle}>Total XP</Text>
        </View>
        <Text style={styles.statCardValue}>
          {userData.profile.totalXP.toLocaleString()}
        </Text>
        <Text style={styles.statCardChange}>+240 this week</Text>
      </View>

      <View style={styles.statCard}>
        <View style={styles.statCardHeader}>
          <Calendar size={16} color="#4DABF7" strokeWidth={1.5} />
          <Text style={styles.statCardTitle}>Streak</Text>
        </View>
        <Text style={styles.statCardValue}>{userData.stats.streak} days</Text>
        <Text style={styles.statCardChange}>Personal best!</Text>
      </View>

      <View style={styles.statCard}>
        <View style={styles.statCardHeader}>
          <Award size={16} color="#FFB366" strokeWidth={1.5} />
          <Text style={styles.statCardTitle}>Rank</Text>
        </View>
        <Text style={styles.statCardValue}>{userData.profile.rank}</Text>
        <Text style={styles.statCardChange}>Level {userData.profile.level}</Text>
      </View>

      <View style={styles.statCard}>
        <View style={styles.statCardHeader}>
          <Target size={16} color="#FF6B6B" strokeWidth={1.5} />
          <Text style={styles.statCardTitle}>Quests</Text>
        </View>
        <Text style={styles.statCardValue}>
          {userData.domains.reduce((acc, domain) => acc + domain.quests, 0)}
        </Text>
        <Text style={styles.statCardChange}>Completed total</Text>
      </View>
    </View>
  );

  const AchievementsList = () => (
    <View style={styles.achievementsContainer}>
      <Text style={styles.sectionTitle}>Recent Achievements</Text>
      {userData.achievements.filter(a => a.earned).map((achievement) => (
        <View key={achievement.id} style={styles.achievementCard}>
          <View style={styles.achievementIcon}>
            <Award size={20} color="#FFB366" strokeWidth={1.5} />
          </View>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            <Text style={styles.achievementDescription}>
              {achievement.description}
            </Text>
            <Text style={styles.achievementDate}>
              Earned {new Date(achievement.earnedDate!).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.achievementXP}>
            <Text style={styles.achievementXPText}>+{achievement.xp}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const DomainDetail = ({ domainId }: { domainId: string }) => {
    const domain = userData.domains.find(d => d.id === domainId);
    if (!domain) return null;

    const Icon = getDomainIcon(domainId);

    return (
      <View style={styles.domainDetail}>
        <View style={styles.domainDetailHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedDomain(null)}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.domainDetailContent}
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? 88 + insets.bottom + 20 : 68 + insets.bottom + 20
          }}
        >
          <View style={styles.domainDetailInfo}>
            <View style={[styles.domainDetailIcon, { backgroundColor: domain.color + '20' }]}>
              <Icon size={32} color={domain.color} strokeWidth={1.5} />
            </View>
            <Text style={styles.domainDetailName}>{domain.name}</Text>
            <Text style={styles.domainDetailRank}>{domain.rank}</Text>
          </View>

          <View style={styles.domainDetailStats}>
            <ProgressRing
              progress={domain.progress}
              size={120}
              strokeWidth={6}
              color={domain.color}
            />
            <View style={styles.domainDetailStatsGrid}>
              <View style={styles.domainDetailStat}>
                <Text style={styles.domainDetailStatValue}>{domain.xp.toLocaleString()}</Text>
                <Text style={styles.domainDetailStatLabel}>XP Earned</Text>
              </View>
              <View style={styles.domainDetailStat}>
                <Text style={styles.domainDetailStatValue}>{domain.quests}</Text>
                <Text style={styles.domainDetailStatLabel}>Quests Done</Text>
              </View>
              <View style={styles.domainDetailStat}>
                <Text style={styles.domainDetailStatValue}>{domain.achievements}</Text>
                <Text style={styles.domainDetailStatLabel}>Achievements</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  if (selectedDomain) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <DomainDetail domainId={selectedDomain} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Evolution</Text>
        <View style={styles.headerTabs}>
          <TouchableOpacity
            style={[
              styles.headerTab,
              selectedView === 'overview' && styles.headerTabActive,
            ]}
            onPress={() => setSelectedView('overview')}
          >
            <BarChart3 size={16} color={selectedView === 'overview' ? '#000000' : '#A6A6A6'} strokeWidth={1.5} />
            <Text
              style={[
                styles.headerTabText,
                selectedView === 'overview' && styles.headerTabTextActive,
              ]}
            >
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.headerTab,
              selectedView === 'achievements' && styles.headerTabActive,
            ]}
            onPress={() => setSelectedView('achievements')}
          >
            <Award size={16} color={selectedView === 'achievements' ? '#000000' : '#A6A6A6'} strokeWidth={1.5} />
            <Text
              style={[
                styles.headerTabText,
                selectedView === 'achievements' && styles.headerTabTextActive,
              ]}
            >
              Awards
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? 88 + insets.bottom + 20 : 68 + insets.bottom + 20
        }}
      >
        {selectedView === 'overview' && (
          <>
            <StatsCards />
            <OverviewChart />
          </>
        )}
        
        {selectedView === 'achievements' && <AchievementsList />}
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
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  headerTabs: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 4,
  },
  headerTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  headerTabActive: {
    backgroundColor: '#FFFFFF',
  },
  headerTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A6A6A6',
    marginLeft: 6,
  },
  headerTabTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    margin: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statCardTitle: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '500',
    marginLeft: 8,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statCardChange: {
    fontSize: 12,
    color: '#51CF66',
    fontWeight: '500',
  },
  chartContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  domainsChart: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  domainChartItem: {
    width: (width - 72) / 3,
    alignItems: 'center',
    marginBottom: 24,
  },
  domainChartInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  domainChartName: {
    fontSize: 12,
    color: '#A6A6A6',
    fontWeight: '500',
    marginTop: 4,
  },
  domainChartProgress: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 2,
  },
  achievementsContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFB366' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#A6A6A6',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: '#666666',
  },
  achievementXP: {
    alignItems: 'center',
  },
  achievementXPText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4DABF7',
  },
  domainDetail: {
    flex: 1,
    paddingHorizontal: 24,
  },
  domainDetailHeader: {
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: '#4DABF7',
    fontWeight: '500',
  },
  domainDetailContent: {
    flex: 1,
  },
  domainDetailInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  domainDetailIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  domainDetailName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  domainDetailRank: {
    fontSize: 16,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  domainDetailStats: {
    alignItems: 'center',
  },
  domainDetailStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 32,
  },
  domainDetailStat: {
    alignItems: 'center',
  },
  domainDetailStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  domainDetailStatLabel: {
    fontSize: 12,
    color: '#A6A6A6',
    textAlign: 'center',
  },
});
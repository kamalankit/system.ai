import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft,
  Target,
  Brain,
  Heart,
  Users,
  Star,
  DollarSign,
  Trophy,
  Calendar,
  TrendingUp,
} from 'lucide-react-native';
import ProgressRing from '@/components/ProgressRing';
import { userData } from '@/data/mockData';

export default function DomainDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const domain = userData.domains.find(d => d.id === id);
  
  if (!domain) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Text style={styles.errorText}>Domain not found</Text>
      </SafeAreaView>
    );
  }

  const getDomainIcon = (domainId: string) => {
    const icons = {
      physical: Target,
      mental: Brain,
      emotional: Heart,
      social: Users,
      spiritual: Star,
      financial: DollarSign,
    };
    return icons[domainId as keyof typeof icons] || Target;
  };

  const Icon = getDomainIcon(domain.id);

  const domainQuests = userData.quests.filter(quest => quest.domain === domain.id);
  const recentAchievements = userData.achievements.filter(a => a.earned).slice(0, 3);

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
        <Text style={styles.headerTitle}>{domain.name} Domain</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Domain Overview */}
        <View style={styles.overviewCard}>
          <View style={styles.domainHeader}>
            <View style={[styles.domainIcon, { backgroundColor: domain.color + '20' }]}>
              <Icon size={32} color={domain.color} strokeWidth={1.5} />
            </View>
            <View style={styles.domainInfo}>
              <Text style={styles.domainName}>{domain.name}</Text>
              <Text style={styles.domainRank}>{domain.rank}</Text>
            </View>
            <ProgressRing
              progress={domain.progress}
              size={80}
              strokeWidth={4}
              color={domain.color}
            />
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{domain.xp.toLocaleString()}</Text>
              <Text style={styles.statLabel}>XP Earned</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{domain.quests}</Text>
              <Text style={styles.statLabel}>Quests Done</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{domain.achievements}</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
          </View>
        </View>

        {/* Recent Quests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Quests</Text>
          {domainQuests.slice(0, 3).map((quest) => (
            <TouchableOpacity
              key={quest.id}
              style={styles.questCard}
              onPress={() => router.push(`/quest/${quest.id}`)}
            >
              <View style={styles.questInfo}>
                <Text style={styles.questTitle}>{quest.title}</Text>
                <Text style={styles.questDescription}>{quest.description}</Text>
                <Text style={styles.questXP}>+{quest.xp} XP</Text>
              </View>
              <View style={styles.questType}>
                <Text style={styles.questTypeText}>{quest.type}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Progress Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress This Week</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <TrendingUp size={20} color={domain.color} strokeWidth={1.5} />
              <Text style={styles.chartTitle}>Weekly Progress</Text>
            </View>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartText}>+{Math.floor(Math.random() * 500)} XP this week</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          {recentAchievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Trophy size={20} color="#FFB366" strokeWidth={1.5} />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
              </View>
              <Text style={styles.achievementXP}>+{achievement.xp}</Text>
            </View>
          ))}
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
  overviewCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  domainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  domainIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  domainInfo: {
    flex: 1,
  },
  domainName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  domainRank: {
    fontSize: 16,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#A6A6A6',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  questCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  questDescription: {
    fontSize: 14,
    color: '#A6A6A6',
    marginBottom: 4,
  },
  questXP: {
    fontSize: 12,
    color: '#4DABF7',
    fontWeight: '600',
  },
  questType: {
    backgroundColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  questTypeText: {
    fontSize: 12,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  chartPlaceholder: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161616',
    borderRadius: 8,
  },
  chartText: {
    fontSize: 16,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
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
  },
  achievementXP: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4DABF7',
  },
  errorText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 100,
  },
});
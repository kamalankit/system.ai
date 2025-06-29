import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Flame,
  Filter,
  Camera,
  Timer,
  Check,
  Clock,
  Star,
  Target,
  Brain,
  Heart,
  Users,
  Zap,
  DollarSign,
  Plus,
  RefreshCw,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { userData, generateDailyQuests, completeQuest } from '@/data/mockData';

export default function QuestsScreen() {
  const router = useRouter();
  const [completedQuests, setCompletedQuests] = useState(new Set());
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [quests, setQuests] = useState(userData.quests);
  const [dailyQuestsGenerated, setDailyQuestsGenerated] = useState(false);
  const insets = useSafeAreaInsets();

  // Generate daily quests on component mount
  useEffect(() => {
    if (!dailyQuestsGenerated) {
      const dailyQuests = generateDailyQuests();
      setQuests([...userData.quests]);
      setDailyQuestsGenerated(true);
    }
  }, [dailyQuestsGenerated]);

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

  const handleQuestComplete = (questId: number) => {
    if (!completedQuests.has(questId)) {
      setCompletedQuests(prev => new Set([...prev, questId]));
      
      // Update the quest in data
      const completedQuest = completeQuest(questId);
      if (completedQuest) {
        setQuests([...userData.quests]);
        
        // Show completion alert
        Alert.alert(
          'Quest Completed! 🎉',
          `You earned ${completedQuest.xp} XP!`,
          [{ text: 'Awesome!', style: 'default' }]
        );
      }
    }
  };

  const startTimer = (questId: number, duration: number) => {
    setActiveTimer(questId);
    setTimerSeconds(duration);
    
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setActiveTimer(null);
          handleQuestComplete(questId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreateQuest = () => {
    router.push('/quest/create');
  };

  const handleRefreshDailyQuests = () => {
    Alert.alert(
      'Refresh Daily Quests',
      'This will generate new daily quests for today. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Refresh',
          onPress: () => {
            const newDailyQuests = generateDailyQuests();
            setQuests([...userData.quests]);
            Alert.alert('Success', 'Daily quests refreshed!');
          },
        },
      ]
    );
  };

  const QuestCard = ({ quest }: { quest: any }) => {
    const isCompleted = completedQuests.has(quest.id) || quest.completed;
    const DomainIcon = getDomainIcon(quest.domain);
    const domainColor = getDomainColor(quest.domain);
    const isTimerActive = activeTimer === quest.id;

    return (
      <TouchableOpacity
        style={[styles.questCard, isCompleted && styles.questCardCompleted]}
        onPress={() => router.push(`/quest/${quest.id}`)}
      >
        <View style={styles.questHeader}>
          <View style={styles.questLeft}>
            <TouchableOpacity
              style={[
                styles.questCheckbox,
                {
                  backgroundColor: isCompleted ? '#51CF66' : 'transparent',
                  borderColor: isCompleted ? '#51CF66' : '#333333',
                },
              ]}
              onPress={() => handleQuestComplete(quest.id)}
            >
              {isCompleted && <Check size={14} color="#FFFFFF" strokeWidth={2} />}
            </TouchableOpacity>
            
            <View style={styles.questInfo}>
              <View style={styles.questTitleRow}>
                <Text style={[styles.questTitle, isCompleted && styles.questTitleCompleted]}>
                  {quest.title}
                </Text>
                <View style={styles.questBadges}>
                  {quest.isDaily && (
                    <View style={styles.dailyBadge}>
                      <Text style={styles.dailyBadgeText}>Daily</Text>
                    </View>
                  )}
                  <View style={[styles.domainBadge, { backgroundColor: domainColor + '20' }]}>
                    <DomainIcon size={12} color={domainColor} strokeWidth={1.5} />
                  </View>
                </View>
              </View>
              <Text style={styles.questDescription}>{quest.description}</Text>
              <View style={styles.questMeta}>
                <Text style={styles.questXP}>+{quest.xp} XP</Text>
                <Text style={styles.questDifficulty}>{quest.difficulty}</Text>
                <View style={styles.questTime}>
                  <Clock size={12} color="#666666" strokeWidth={1.5} />
                  <Text style={styles.questTimeText}>{quest.estimatedTime}m</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.questActions}>
            {quest.type === 'photo' && (
              <TouchableOpacity style={styles.actionButton}>
                <Camera size={18} color="#A6A6A6" strokeWidth={1.5} />
              </TouchableOpacity>
            )}
            
            {quest.type === 'timer' && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  isTimerActive && styles.actionButtonActive,
                ]}
                onPress={() => startTimer(quest.id, quest.duration)}
              >
                {isTimerActive ? (
                  <Text style={styles.timerText}>{formatTime(timerSeconds)}</Text>
                ) : (
                  <Timer size={18} color="#A6A6A6" strokeWidth={1.5} />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {quest.type === 'checklist' && quest.subtasks && (
          <View style={styles.subtasksContainer}>
            {quest.subtasks.map((subtask: string, index: number) => (
              <View key={index} style={styles.subtaskItem}>
                <View style={styles.subtaskCheckbox} />
                <Text style={styles.subtaskText}>{subtask}</Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const filters = [
    { id: 'all', label: 'All', count: quests.length, icon: null },
    { id: 'daily', label: 'Daily', count: quests.filter(q => q.isDaily).length, icon: Flame },
    { id: 'physical', label: 'Physical', count: quests.filter(q => q.domain === 'physical').length, icon: Target },
    { id: 'mental', label: 'Mental', count: quests.filter(q => q.domain === 'mental').length, icon: Brain },
    { id: 'financial', label: 'Financial', count: quests.filter(q => q.domain === 'financial').length, icon: DollarSign },
    { id: 'social', label: 'Social', count: quests.filter(q => q.domain === 'social').length, icon: Users },
  ];

  const filteredQuests = quests.filter(quest => {
    // Filter by selected category
    let matchesFilter = true;
    if (selectedFilter === 'daily') {
      matchesFilter = quest.isDaily;
    } else if (selectedFilter !== 'all') {
      matchesFilter = quest.domain === selectedFilter;
    }
    
    // Filter by search query
    const matchesSearch = quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quest.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const completedCount = filteredQuests.filter(q => completedQuests.has(q.id) || q.completed).length;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daily Quests</Text>
        <View style={styles.headerRight}>
          <View style={styles.streakContainer}>
            <Flame size={18} color="#FF6B6B" strokeWidth={1.5} />
            <Text style={styles.streakText}>{userData.stats.streak}</Text>
          </View>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleRefreshDailyQuests}
            activeOpacity={0.7}
          >
            <RefreshCw size={18} color="#A6A6A6" strokeWidth={1.5} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.createButton} 
            onPress={handleCreateQuest}
            activeOpacity={0.7}
          >
            <Plus size={18} color="#FFFFFF" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search quests..."
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={false}
            blurOnSubmit={false}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {completedCount} of {filteredQuests.length} completed
          </Text>
          <Text style={styles.progressPercentage}>
            {filteredQuests.length > 0 ? Math.round((completedCount / filteredQuests.length) * 100) : 0}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: filteredQuests.length > 0 ? `${(completedCount / filteredQuests.length) * 100}%` : '0%' },
            ]}
          />
        </View>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
        keyboardShouldPersistTaps="handled"
      >
        {filters.map(filter => {
          const Icon = filter.icon;
          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter.id)}
              activeOpacity={0.7}
            >
              <View style={styles.filterChipContent}>
                {Icon && (
                  <Icon 
                    size={14} 
                    color={selectedFilter === filter.id ? '#000000' : '#A6A6A6'} 
                    strokeWidth={1.5} 
                  />
                )}
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilter === filter.id && styles.filterChipTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
                <View style={[
                  styles.filterChipBadge,
                  selectedFilter === filter.id && styles.filterChipBadgeActive,
                ]}>
                  <Text style={[
                    styles.filterChipBadgeText,
                    selectedFilter === filter.id && styles.filterChipBadgeTextActive,
                  ]}>
                    {filter.count}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Quests List */}
      <ScrollView 
        style={styles.questsList} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? 88 + insets.bottom + 20 : 68 + insets.bottom + 20
        }}
      >
        {filteredQuests.length === 0 ? (
          <View style={styles.emptyState}>
            <Zap size={48} color="#333333" strokeWidth={1} />
            <Text style={styles.emptyTitle}>No quests found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Create your first quest to get started!'
              }
            </Text>
            {!searchQuery && (
              <TouchableOpacity 
                style={styles.emptyButton} 
                onPress={handleCreateQuest}
                activeOpacity={0.8}
              >
                <Text style={styles.emptyButtonText}>Create Quest</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredQuests.map(quest => (
            <QuestCard key={quest.id} quest={quest} />
          ))
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 32,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  createButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#4DABF7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 48,
  },
  searchInput: {
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 24,
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4DABF7',
    borderRadius: 3,
  },
  filtersContainer: {
    marginBottom: 16,
    maxHeight: 44,
  },
  filtersContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  filterChip: {
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 36,
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  filterChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterChipText: {
    fontSize: 13,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  filterChipBadge: {
    backgroundColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  filterChipBadgeActive: {
    backgroundColor: '#000000',
  },
  filterChipBadgeText: {
    fontSize: 11,
    color: '#A6A6A6',
    fontWeight: '600',
  },
  filterChipBadgeTextActive: {
    color: '#FFFFFF',
  },
  questsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  questCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  questCardCompleted: {
    borderColor: '#51CF66',
    backgroundColor: '#51CF66' + '10',
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  questLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  questCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  questInfo: {
    flex: 1,
  },
  questTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  questTitleCompleted: {
    color: '#51CF66',
  },
  questBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 8,
  },
  dailyBadge: {
    backgroundColor: '#FF6B6B' + '20',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dailyBadgeText: {
    fontSize: 10,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  domainBadge: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  questDescription: {
    fontSize: 14,
    color: '#A6A6A6',
    marginBottom: 8,
    lineHeight: 20,
  },
  questMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questXP: {
    fontSize: 12,
    color: '#4DABF7',
    fontWeight: '600',
    marginRight: 12,
  },
  questDifficulty: {
    fontSize: 12,
    color: '#FFB366',
    fontWeight: '500',
    marginRight: 12,
  },
  questTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questTimeText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  questActions: {
    marginLeft: 12,
  },
  actionButtonActive: {
    backgroundColor: '#4DABF7' + '20',
    borderColor: '#4DABF7',
  },
  timerText: {
    fontSize: 10,
    color: '#4DABF7',
    fontWeight: '600',
  },
  subtasksContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtaskCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
    marginRight: 8,
  },
  subtaskText: {
    fontSize: 14,
    color: '#A6A6A6',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#A6A6A6',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#4DABF7',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
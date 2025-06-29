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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Shield, 
  Heart, 
  Search, 
  Eye, 
  Plus, 
  Minus, 
  Save,
  RefreshCw,
  Lightbulb,
  ArrowRight,
  Calendar
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RecoverySession {
  id: string;
  date: Date;
  compassionMessage: string;
  analysis: {
    what: string;
    when: string;
    where: string;
    why: string;
    how: string;
  };
  patterns: string[];
  contingencies: Array<{
    trigger: string;
    action: string;
  }>;
  notes: string;
}

const compassionMessages = [
  "You are human, and humans make mistakes. This setback doesn't define you—it's simply data for your growth.",
  "Every master was once a disaster. Your willingness to analyze this setback shows your commitment to evolution.",
  "Failure is not the opposite of success; it's a stepping stone to success. You're exactly where you need to be.",
  "The strongest hunters aren't those who never fall, but those who get back up with wisdom gained.",
  "Your worth isn't measured by your mistakes, but by your courage to learn from them and try again.",
  "This moment of struggle is temporary, but the strength you build from it will last forever.",
  "You've overcome challenges before, and you'll overcome this one too. Trust in your resilience.",
  "Progress isn't linear. Sometimes we need to step back to leap forward with greater understanding.",
  "Your past successes prove you have what it takes. This setback is just a detour, not a dead end.",
  "Be as kind to yourself as you would be to a good friend facing the same challenge."
];

export default function RecoveryProtocolScreen() {
  const router = useRouter();
  const [currentSession, setCurrentSession] = useState<RecoverySession>({
    id: Date.now().toString(),
    date: new Date(),
    compassionMessage: '',
    analysis: {
      what: '',
      when: '',
      where: '',
      why: '',
      how: '',
    },
    patterns: [],
    contingencies: [],
    notes: '',
  });
  
  const [newPattern, setNewPattern] = useState('');
  const [newTrigger, setNewTrigger] = useState('');
  const [newAction, setNewAction] = useState('');
  const [pastSessions, setPastSessions] = useState<RecoverySession[]>([]);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  useEffect(() => {
    loadPastSessions();
    generateCompassionMessage();
  }, []);

  const loadPastSessions = async () => {
    try {
      const stored = await AsyncStorage.getItem('recoverySessions');
      if (stored) {
        const sessions = JSON.parse(stored).map((session: any) => ({
          ...session,
          date: new Date(session.date),
        }));
        setPastSessions(sessions);
      }
    } catch (error) {
      console.error('Error loading recovery sessions:', error);
    }
  };

  const saveSession = async () => {
    try {
      const updatedSessions = [currentSession, ...pastSessions];
      await AsyncStorage.setItem('recoverySessions', JSON.stringify(updatedSessions));
      setPastSessions(updatedSessions);
      
      Alert.alert(
        'Recovery Session Saved! 💪',
        'Your analysis has been saved. Remember: every setback is a setup for a comeback.',
        [
          {
            text: 'Continue Growing',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving recovery session:', error);
      Alert.alert('Error', 'Failed to save recovery session');
    }
  };

  const generateCompassionMessage = () => {
    const randomMessage = compassionMessages[Math.floor(Math.random() * compassionMessages.length)];
    setCurrentSession(prev => ({ ...prev, compassionMessage: randomMessage }));
  };

  const updateAnalysis = (field: keyof typeof currentSession.analysis, value: string) => {
    setCurrentSession(prev => ({
      ...prev,
      analysis: { ...prev.analysis, [field]: value },
    }));
  };

  const addPattern = () => {
    if (newPattern.trim()) {
      setCurrentSession(prev => ({
        ...prev,
        patterns: [...prev.patterns, newPattern.trim()],
      }));
      setNewPattern('');
    }
  };

  const removePattern = (index: number) => {
    setCurrentSession(prev => ({
      ...prev,
      patterns: prev.patterns.filter((_, i) => i !== index),
    }));
  };

  const addContingency = () => {
    if (newTrigger.trim() && newAction.trim()) {
      setCurrentSession(prev => ({
        ...prev,
        contingencies: [...prev.contingencies, {
          trigger: newTrigger.trim(),
          action: newAction.trim(),
        }],
      }));
      setNewTrigger('');
      setNewAction('');
    }
  };

  const removeContingency = (index: number) => {
    setCurrentSession(prev => ({
      ...prev,
      contingencies: prev.contingencies.filter((_, i) => i !== index),
    }));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderCurrentSession = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Self-Compassion Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Heart size={24} color="#51CF66" strokeWidth={1.5} />
          <Text style={styles.sectionTitle}>Self-Compassion Reminder</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={generateCompassionMessage}
            activeOpacity={0.7}
          >
            <RefreshCw size={16} color="#A6A6A6" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.compassionCard}>
          <Text style={styles.compassionMessage}>
            "{currentSession.compassionMessage}"
          </Text>
        </View>
      </View>

      {/* Sherlock Holmes Analysis */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Search size={24} color="#4DABF7" strokeWidth={1.5} />
          <Text style={styles.sectionTitle}>Sherlock Holmes Mode</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Systematic analysis of what happened
        </Text>

        <View style={styles.analysisContainer}>
          <View style={styles.analysisField}>
            <Text style={styles.analysisLabel}>What happened?</Text>
            <TextInput
              style={styles.analysisInput}
              placeholder="Describe the specific event or setback..."
              placeholderTextColor="#666666"
              value={currentSession.analysis.what}
              onChangeText={(text) => updateAnalysis('what', text)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.analysisField}>
            <Text style={styles.analysisLabel}>When did it happen?</Text>
            <TextInput
              style={styles.analysisInput}
              placeholder="Time, date, duration..."
              placeholderTextColor="#666666"
              value={currentSession.analysis.when}
              onChangeText={(text) => updateAnalysis('when', text)}
            />
          </View>

          <View style={styles.analysisField}>
            <Text style={styles.analysisLabel}>Where did it happen?</Text>
            <TextInput
              style={styles.analysisInput}
              placeholder="Location, environment, context..."
              placeholderTextColor="#666666"
              value={currentSession.analysis.where}
              onChangeText={(text) => updateAnalysis('where', text)}
            />
          </View>

          <View style={styles.analysisField}>
            <Text style={styles.analysisLabel}>Why did it happen?</Text>
            <TextInput
              style={styles.analysisInput}
              placeholder="Root causes, contributing factors..."
              placeholderTextColor="#666666"
              value={currentSession.analysis.why}
              onChangeText={(text) => updateAnalysis('why', text)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.analysisField}>
            <Text style={styles.analysisLabel}>How did it unfold?</Text>
            <TextInput
              style={styles.analysisInput}
              placeholder="Step-by-step sequence of events..."
              placeholderTextColor="#666666"
              value={currentSession.analysis.how}
              onChangeText={(text) => updateAnalysis('how', text)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>
      </View>

      {/* Pattern Recognition */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Eye size={24} color="#FFB366" strokeWidth={1.5} />
          <Text style={styles.sectionTitle}>Pattern Recognition</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Identify recurring failure patterns
        </Text>

        <View style={styles.addItemContainer}>
          <TextInput
            style={styles.addItemInput}
            placeholder="Describe a pattern you notice..."
            placeholderTextColor="#666666"
            value={newPattern}
            onChangeText={setNewPattern}
            onSubmitEditing={addPattern}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={addPattern}
            activeOpacity={0.7}
          >
            <Plus size={20} color="#FFFFFF" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>

        <View style={styles.itemsList}>
          {currentSession.patterns.map((pattern, index) => (
            <View key={index} style={styles.patternItem}>
              <Text style={styles.patternText}>{pattern}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removePattern(index)}
                activeOpacity={0.7}
              >
                <Minus size={16} color="#FF6B6B" strokeWidth={1.5} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {currentSession.patterns.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No patterns identified yet. Look for recurring themes in your setbacks.
            </Text>
          </View>
        )}
      </View>

      {/* Contingency Planning */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Lightbulb size={24} color="#9775FA" strokeWidth={1.5} />
          <Text style={styles.sectionTitle}>Contingency Planning</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Create "If-Then" scenarios for future challenges
        </Text>

        <View style={styles.contingencyForm}>
          <View style={styles.contingencyInputGroup}>
            <Text style={styles.contingencyLabel}>If this happens...</Text>
            <TextInput
              style={styles.contingencyInput}
              placeholder="Describe the trigger situation..."
              placeholderTextColor="#666666"
              value={newTrigger}
              onChangeText={setNewTrigger}
            />
          </View>

          <View style={styles.contingencyInputGroup}>
            <Text style={styles.contingencyLabel}>Then I will...</Text>
            <TextInput
              style={styles.contingencyInput}
              placeholder="Describe your specific action..."
              placeholderTextColor="#666666"
              value={newAction}
              onChangeText={setNewAction}
            />
          </View>

          <TouchableOpacity
            style={styles.addContingencyButton}
            onPress={addContingency}
            activeOpacity={0.7}
          >
            <Plus size={16} color="#FFFFFF" strokeWidth={1.5} />
            <Text style={styles.addContingencyText}>Add If-Then Plan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contingenciesList}>
          {currentSession.contingencies.map((contingency, index) => (
            <View key={index} style={styles.contingencyItem}>
              <View style={styles.contingencyContent}>
                <View style={styles.contingencyRow}>
                  <Text style={styles.contingencyTrigger}>
                    If: {contingency.trigger}
                  </Text>
                </View>
                <View style={styles.contingencyRow}>
                  <ArrowRight size={16} color="#9775FA" strokeWidth={1.5} />
                  <Text style={styles.contingencyAction}>
                    Then: {contingency.action}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeContingency(index)}
                activeOpacity={0.7}
              >
                <Minus size={16} color="#FF6B6B" strokeWidth={1.5} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {currentSession.contingencies.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No contingency plans yet. Create specific if-then scenarios for common challenges.
            </Text>
          </View>
        )}
      </View>

      {/* Additional Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Notes</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Any additional insights, commitments, or reflections..."
          placeholderTextColor="#666666"
          value={currentSession.notes}
          onChangeText={(text) => setCurrentSession(prev => ({ ...prev, notes: text }))}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveSession}
        activeOpacity={0.8}
      >
        <Save size={20} color="#FFFFFF" strokeWidth={1.5} />
        <Text style={styles.saveButtonText}>Save Recovery Session</Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );

  const renderHistory = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.historyTitle}>Recovery History</Text>
      <Text style={styles.historySubtitle}>
        Review your past recovery sessions to identify growth patterns
      </Text>

      {pastSessions.length === 0 ? (
        <View style={styles.emptyHistoryState}>
          <Shield size={48} color="#333333" strokeWidth={1} />
          <Text style={styles.emptyHistoryTitle}>No Recovery Sessions Yet</Text>
          <Text style={styles.emptyHistoryDescription}>
            Your recovery sessions will appear here as you complete them.
          </Text>
        </View>
      ) : (
        <View style={styles.historyList}>
          {pastSessions.map((session) => (
            <View key={session.id} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <Calendar size={16} color="#A6A6A6" strokeWidth={1.5} />
                <Text style={styles.historyDate}>{formatDate(session.date)}</Text>
              </View>
              
              <Text style={styles.historyCompassion} numberOfLines={2}>
                "{session.compassionMessage}"
              </Text>
              
              <View style={styles.historyStats}>
                <Text style={styles.historyStat}>
                  {session.patterns.length} patterns identified
                </Text>
                <Text style={styles.historyStat}>
                  {session.contingencies.length} if-then plans created
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );

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
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Recovery Protocol</Text>
          <Text style={styles.headerSubtitle}>Structured setback recovery</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'current' && styles.tabActive]}
          onPress={() => setActiveTab('current')}
          activeOpacity={0.7}
        >
          <Shield size={16} color={activeTab === 'current' ? '#FFFFFF' : '#A6A6A6'} strokeWidth={1.5} />
          <Text style={[styles.tabText, activeTab === 'current' && styles.tabTextActive]}>
            Current Session
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
          activeOpacity={0.7}
        >
          <Calendar size={16} color={activeTab === 'history' ? '#FFFFFF' : '#A6A6A6'} strokeWidth={1.5} />
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'current' ? renderCurrentSession() : renderHistory()}
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#A6A6A6',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#FF6B6B',
  },
  tabText: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
    flex: 1,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#A6A6A6',
    marginBottom: 16,
    lineHeight: 20,
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassionCard: {
    backgroundColor: '#51CF66' + '15',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#51CF66' + '30',
  },
  compassionMessage: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  analysisContainer: {
    gap: 16,
  },
  analysisField: {
    marginBottom: 4,
  },
  analysisLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  analysisInput: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 56,
    textAlignVertical: 'top',
  },
  addItemContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  addItemInput: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 56,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#4DABF7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemsList: {
    gap: 12,
  },
  patternItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  patternText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B6B' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#A6A6A6',
    textAlign: 'center',
    lineHeight: 20,
  },
  contingencyForm: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  contingencyInputGroup: {
    marginBottom: 16,
  },
  contingencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9775FA',
    marginBottom: 8,
  },
  contingencyInput: {
    backgroundColor: '#161616',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 56,
  },
  addContingencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9775FA',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  addContingencyText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  contingenciesList: {
    gap: 12,
  },
  contingencyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  contingencyContent: {
    flex: 1,
    gap: 8,
  },
  contingencyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  contingencyTrigger: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    flex: 1,
  },
  contingencyAction: {
    fontSize: 14,
    color: '#9775FA',
    lineHeight: 20,
    flex: 1,
    fontWeight: '500',
  },
  notesInput: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#51CF66',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bottomPadding: {
    height: 100,
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  historySubtitle: {
    fontSize: 16,
    color: '#A6A6A6',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyHistoryState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyHistoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyHistoryDescription: {
    fontSize: 14,
    color: '#A6A6A6',
    textAlign: 'center',
    lineHeight: 20,
  },
  historyList: {
    gap: 16,
  },
  historyItem: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  historyDate: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  historyCompassion: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyStat: {
    fontSize: 12,
    color: '#666666',
  },
});
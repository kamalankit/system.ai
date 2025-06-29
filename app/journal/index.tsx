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
import { useRouter } from 'expo-router';
import { ChevronLeft, BookOpen, Target, ChevronRight, Calendar } from 'lucide-react-native';

export default function JournalIndexScreen() {
  const router = useRouter();

  const journalTypes = [
    {
      id: 'pointed',
      title: 'Pointed Journaling',
      description: 'Daily rules tracking, learnings, and problem analysis',
      icon: Target,
      color: '#4DABF7',
      route: '/journal/pointed',
    },
    {
      id: 'shadow',
      title: 'Shadow Work Journal',
      description: 'Personal reflection and inner growth exploration',
      icon: BookOpen,
      color: '#9775FA',
      route: '/journal/shadow',
    },
  ];

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
        <Text style={styles.headerTitle}>Journal</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Choose Your Journal Type</Text>
          <Text style={styles.introDescription}>
            Different journaling methods for different aspects of your growth journey.
          </Text>
        </View>

        {/* Journal Types */}
        <View style={styles.journalTypes}>
          {journalTypes.map((type) => {
            const Icon = type.icon;
            return (
              <TouchableOpacity
                key={type.id}
                style={styles.journalCard}
                onPress={() => router.push(type.route as any)}
                activeOpacity={0.8}
              >
                <View style={styles.journalCardContent}>
                  <View style={[styles.journalIcon, { backgroundColor: type.color + '20' }]}>
                    <Icon size={32} color={type.color} strokeWidth={1.5} />
                  </View>
                  
                  <View style={styles.journalInfo}>
                    <Text style={styles.journalTitle}>{type.title}</Text>
                    <Text style={styles.journalDescription}>{type.description}</Text>
                  </View>
                  
                  <ChevronRight size={20} color="#666666" strokeWidth={1.5} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Journaling Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• Be honest and authentic in your reflections</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• Write regularly, even if just for a few minutes</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• Focus on patterns and insights, not just events</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• Use your journal to track growth over time</Text>
            </View>
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
  introSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  introDescription: {
    fontSize: 16,
    color: '#A6A6A6',
    textAlign: 'center',
    lineHeight: 24,
  },
  journalTypes: {
    gap: 16,
    marginBottom: 32,
  },
  journalCard: {
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  journalCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  journalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  journalInfo: {
    flex: 1,
  },
  journalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  journalDescription: {
    fontSize: 14,
    color: '#A6A6A6',
    lineHeight: 20,
  },
  tipsSection: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#333333',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#A6A6A6',
    lineHeight: 20,
  },
});
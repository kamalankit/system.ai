import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Plus, Calendar, Search, BookOpen, CreditCard as Edit3, Trash2, Save } from 'lucide-react-native';
import { userData, addJournalEntry, updateJournalEntry, deleteJournalEntry } from '@/data/mockData';

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  date: string;
  mood: 'positive' | 'neutral' | 'negative';
}

export default function JournalScreen() {
  const router = useRouter();
  const [isWriting, setIsWriting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [journalEntries, setJournalEntries] = useState(userData.journalEntries);

  const filteredEntries = journalEntries.filter(entry =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewEntry = () => {
    setIsWriting(true);
    setCurrentEntry(null);
    setEntryTitle('');
    setEntryContent('');
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setIsWriting(true);
    setCurrentEntry(entry);
    setEntryTitle(entry.title);
    setEntryContent(entry.content);
  };

  const handleSaveEntry = () => {
    if (!entryTitle.trim() || !entryContent.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    if (currentEntry) {
      // Update existing entry
      const updated = updateJournalEntry(currentEntry.id, {
        title: entryTitle,
        content: entryContent,
      });
      if (updated) {
        setJournalEntries([...userData.journalEntries]);
      }
    } else {
      // Create new entry
      const newEntry = addJournalEntry({
        title: entryTitle,
        content: entryContent,
        date: new Date().toISOString().split('T')[0],
        mood: 'neutral',
      });
      setJournalEntries([...userData.journalEntries]);
    }

    Alert.alert(
      'Entry Saved',
      'Your journal entry has been saved successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            setIsWriting(false);
            setCurrentEntry(null);
            setEntryTitle('');
            setEntryContent('');
          },
        },
      ]
    );
  };

  const handleDeleteEntry = (entryId: number) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (deleteJournalEntry(entryId)) {
              setJournalEntries([...userData.journalEntries]);
            }
          },
        },
      ]
    );
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive':
        return '#51CF66';
      case 'negative':
        return '#FF6B6B';
      default:
        return '#A6A6A6';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isWriting) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView 
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          {/* Writing Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setIsWriting(false)}
            >
              <ChevronLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {currentEntry ? 'Edit Entry' : 'New Entry'}
            </Text>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveEntry}>
              <Save size={20} color="#4DABF7" strokeWidth={1.5} />
            </TouchableOpacity>
          </View>

          {/* Writing Interface */}
          <ScrollView 
            style={styles.writingContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.writingContent}
          >
            <TextInput
              style={styles.titleInput}
              placeholder="Entry title..."
              placeholderTextColor="#666666"
              value={entryTitle}
              onChangeText={setEntryTitle}
              autoFocus={false}
              blurOnSubmit={false}
              returnKeyType="next"
              autoCapitalize="sentences"
              autoCorrect={true}
              textContentType="none"
            />

            <TextInput
              style={styles.contentInput}
              placeholder="What's on your mind? Explore your thoughts, feelings, and insights..."
              placeholderTextColor="#666666"
              value={entryContent}
              onChangeText={setEntryContent}
              multiline
              textAlignVertical="top"
              autoFocus={false}
              blurOnSubmit={false}
              autoCapitalize="sentences"
              autoCorrect={true}
              textContentType="none"
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Shadow Work Journal</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleNewEntry}>
          <Plus size={20} color="#FFFFFF" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={16} color="#666666" strokeWidth={1.5} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search entries..."
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={false}
            blurOnSubmit={false}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="none"
          />
        </View>
      </View>

      {/* Journal Entries */}
      <ScrollView 
        style={styles.entriesList} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {filteredEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <BookOpen size={48} color="#333333" strokeWidth={1} />
            <Text style={styles.emptyTitle}>No entries found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Start your shadow work journey by writing your first entry'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity style={styles.emptyButton} onPress={handleNewEntry}>
                <Text style={styles.emptyButtonText}>Write First Entry</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredEntries.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              style={styles.entryCard}
              onPress={() => handleEditEntry(entry)}
            >
              <View style={styles.entryHeader}>
                <View style={styles.entryInfo}>
                  <Text style={styles.entryTitle}>{entry.title}</Text>
                  <View style={styles.entryMeta}>
                    <Calendar size={12} color="#666666" strokeWidth={1.5} />
                    <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                    <View
                      style={[
                        styles.moodIndicator,
                        { backgroundColor: getMoodColor(entry.mood) },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.entryActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEditEntry(entry)}
                  >
                    <Edit3 size={16} color="#A6A6A6" strokeWidth={1.5} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteEntry(entry.id)}
                  >
                    <Trash2 size={16} color="#FF6B6B" strokeWidth={1.5} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <Text style={styles.entryPreview} numberOfLines={3}>
                {entry.content}
              </Text>
            </TouchableOpacity>
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
  keyboardContainer: {
    flex: 1,
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4DABF7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
    minHeight: 24,
    paddingVertical: 0,
  },
  entriesList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  entryCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  entryInfo: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  entryDate: {
    fontSize: 12,
    color: '#666666',
  },
  moodIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  entryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryPreview: {
    fontSize: 14,
    color: '#A6A6A6',
    lineHeight: 20,
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
  writingContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  writingContent: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 56,
    textAlignVertical: 'center',
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
    lineHeight: 24,
    minHeight: 300,
    textAlignVertical: 'top',
  },
});
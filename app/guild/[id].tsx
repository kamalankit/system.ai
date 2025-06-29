import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Users, Crown, MessageCircle, Send, MoveVertical as MoreVertical, UserPlus, Settings } from 'lucide-react-native';
import { userData } from '@/data/mockData';

export default function GuildDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState(userData.guildChat);

  const guild = userData.guilds.find(g => g.id === parseInt(id as string));

  if (!guild) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Text style={styles.errorText}>Guild not found</Text>
      </SafeAreaView>
    );
  }

  const sendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: Date.now(),
        userId: 'current',
        username: 'Hunter',
        message: messageText,
        timestamp: Date.now(),
        avatar: null,
      };
      setChatMessages([...chatMessages, newMessage]);
      setMessageText('');
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'now';
  };

  const handleJoinGuild = () => {
    // Simulate joining guild
    router.back();
  };

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
        <Text style={styles.headerTitle}>{guild.name}</Text>
        <TouchableOpacity style={styles.moreButton}>
          <MoreVertical size={20} color="#A6A6A6" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      {/* Guild Info */}
      <View style={styles.guildInfo}>
        <View style={styles.guildHeader}>
          <View style={styles.guildIcon}>
            <Crown size={24} color="#FFB366" strokeWidth={1.5} />
          </View>
          <View style={styles.guildDetails}>
            <Text style={styles.guildName}>{guild.name}</Text>
            <Text style={styles.guildMembers}>
              {guild.members.toLocaleString()} members • {guild.level}
            </Text>
          </View>
          {!guild.isJoined && (
            <TouchableOpacity style={styles.joinButton} onPress={handleJoinGuild}>
              <UserPlus size={16} color="#FFFFFF" strokeWidth={1.5} />
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.guildDescription}>
          {guild.description}
        </Text>
        
        <View style={styles.guildStats}>
          <View style={styles.guildStat}>
            <Text style={styles.guildStatValue}>156</Text>
            <Text style={styles.guildStatLabel}>Quests Today</Text>
          </View>
          <View style={styles.guildStat}>
            <Text style={styles.guildStatValue}>2.3k</Text>
            <Text style={styles.guildStatLabel}>This Week</Text>
          </View>
          <View style={styles.guildStat}>
            <Text style={styles.guildStatValue}>#12</Text>
            <Text style={styles.guildStatLabel}>Leaderboard</Text>
          </View>
        </View>

        <View style={styles.focusAreas}>
          <Text style={styles.focusTitle}>Focus Areas</Text>
          <View style={styles.focusTags}>
            {guild.focus.map((area) => (
              <View key={area} style={styles.focusTag}>
                <Text style={styles.focusTagText}>{area}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {guild.isJoined ? (
        <KeyboardAvoidingView 
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          {/* Chat Header */}
          <View style={styles.chatHeader}>
            <MessageCircle size={16} color="#A6A6A6" strokeWidth={1.5} />
            <Text style={styles.chatHeaderText}>general</Text>
          </View>

          {/* Chat Messages */}
          <ScrollView 
            style={styles.chatMessages} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {chatMessages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.userId === 'current' && styles.myMessageContainer,
                ]}
              >
                {message.userId !== 'current' && (
                  <View style={styles.messageAvatar}>
                    <Text style={styles.messageAvatarText}>
                      {message.username.charAt(0)}
                    </Text>
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    message.userId === 'current' && styles.myMessageBubble,
                  ]}
                >
                  {message.userId !== 'current' && (
                    <Text style={styles.messageUsername}>{message.username}</Text>
                  )}
                  <Text
                    style={[
                      styles.messageText,
                      message.userId === 'current' && styles.myMessageText,
                    ]}
                  >
                    {message.message}
                  </Text>
                  <Text
                    style={[
                      styles.messageTime,
                      message.userId === 'current' && styles.myMessageTime,
                    ]}
                  >
                    {formatTime(message.timestamp)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
          
          {/* Chat Input */}
          <View style={styles.chatInput}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              placeholderTextColor="#666666"
              value={messageText}
              onChangeText={setMessageText}
              multiline
              autoFocus={false}
              blurOnSubmit={false}
              returnKeyType="send"
              autoCapitalize="sentences"
              autoCorrect={true}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: messageText.trim() ? '#4DABF7' : '#333333' },
              ]}
              onPress={sendMessage}
              disabled={!messageText.trim()}
            >
              <Send
                size={16}
                color={messageText.trim() ? '#FFFFFF' : '#666666'}
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.joinPrompt}>
          <Text style={styles.joinPromptText}>
            Join this guild to access chat and participate in group challenges!
          </Text>
        </View>
      )}
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
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guildInfo: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  guildHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  guildIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFB366' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  guildDetails: {
    flex: 1,
  },
  guildName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  guildMembers: {
    fontSize: 14,
    color: '#A6A6A6',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4DABF7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  joinButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  guildDescription: {
    fontSize: 14,
    color: '#A6A6A6',
    lineHeight: 20,
    marginBottom: 16,
  },
  guildStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  guildStat: {
    alignItems: 'center',
  },
  guildStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  guildStatLabel: {
    fontSize: 12,
    color: '#A6A6A6',
  },
  focusAreas: {
    marginTop: 8,
  },
  focusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  focusTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  focusTag: {
    backgroundColor: '#333333',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  focusTagText: {
    fontSize: 11,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  chatHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A6A6A6',
    marginLeft: 8,
  },
  chatMessages: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4DABF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageAvatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  messageBubble: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 12,
    maxWidth: '70%',
    borderWidth: 1,
    borderColor: '#333333',
  },
  myMessageBubble: {
    backgroundColor: '#4DABF7',
    borderColor: '#4DABF7',
  },
  messageUsername: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A6A6A6',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 11,
    color: '#666666',
    marginTop: 4,
  },
  myMessageTime: {
    color: '#FFFFFF' + '80',
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
    maxHeight: 100,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 44,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  joinPromptText: {
    fontSize: 16,
    color: '#A6A6A6',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 100,
  },
});
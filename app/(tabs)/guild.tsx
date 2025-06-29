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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Users, Crown, MessageCircle, Send, MoveVertical as MoreVertical, Hash, UserPlus } from 'lucide-react-native';
import { userData } from '@/data/mockData';

export default function GuildScreen() {
  const [activeTab, setActiveTab] = useState('guild');
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState(userData.guildChat);
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

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

  const GuildInfo = () => {
    const currentGuild = userData.guilds.find(g => g.isJoined);
    
    return (
      <View style={styles.guildInfo}>
        <View style={styles.guildHeader}>
          <View style={styles.guildIcon}>
            <Crown size={24} color="#FFB366" strokeWidth={1.5} />
          </View>
          <View style={styles.guildDetails}>
            <Text style={styles.guildName}>{currentGuild?.name}</Text>
            <Text style={styles.guildMembers}>
              {currentGuild?.members.toLocaleString()} members • {currentGuild?.level}
            </Text>
          </View>
          <TouchableOpacity style={styles.guildOptionsButton}>
            <MoreVertical size={20} color="#A6A6A6" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.guildDescription}>
          {currentGuild?.description}
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
      </View>
    );
  };

  const ChatView = () => (
    <KeyboardAvoidingView 
      style={styles.chatContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        style={styles.chatMessages} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? 20 : 20
        }}
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
      
      <View style={[
        styles.chatInput,
        { paddingBottom: Platform.OS === 'ios' ? insets.bottom + 16 : 16 }
      ]}>
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
          textContentType="none"
          onSubmitEditing={sendMessage}
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
  );

  const DiscoveryView = () => (
    <View style={styles.discoveryContainer}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={16} color="#666666" strokeWidth={1.5} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search guilds..."
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
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? 88 + insets.bottom + 20 : 68 + insets.bottom + 20
        }}
      >
        {userData.guilds.filter(g => !g.isJoined && 
          (g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           g.description.toLowerCase().includes(searchQuery.toLowerCase()))
        ).map((guild) => (
          <View key={guild.id} style={styles.guildCard}>
            <View style={styles.guildCardHeader}>
              <View style={styles.guildCardIcon}>
                <Users size={20} color="#4DABF7" strokeWidth={1.5} />
              </View>
              <View style={styles.guildCardInfo}>
                <Text style={styles.guildCardName}>{guild.name}</Text>
                <Text style={styles.guildCardMeta}>
                  {guild.members.toLocaleString()} members • {guild.level}
                </Text>
              </View>
              <TouchableOpacity style={styles.joinButton}>
                <UserPlus size={16} color="#FFFFFF" strokeWidth={1.5} />
                <Text style={styles.joinButtonText}>Join</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.guildCardDescription}>
              {guild.description}
            </Text>
            
            <View style={styles.guildCardTags}>
              {guild.focus.map((tag) => (
                <View key={tag} style={styles.guildTag}>
                  <Text style={styles.guildTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Guild</Text>
        <View style={styles.headerTabs}>
          <TouchableOpacity
            style={[
              styles.headerTab,
              activeTab === 'guild' && styles.headerTabActive,
            ]}
            onPress={() => setActiveTab('guild')}
          >
            <Text
              style={[
                styles.headerTabText,
                activeTab === 'guild' && styles.headerTabTextActive,
              ]}
            >
              My Guild
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.headerTab,
              activeTab === 'discovery' && styles.headerTabActive,
            ]}
            onPress={() => setActiveTab('discovery')}
          >
            <Text
              style={[
                styles.headerTabText,
                activeTab === 'discovery' && styles.headerTabTextActive,
              ]}
            >
              Discover
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {activeTab === 'guild' && (
        <View style={styles.content}>
          <GuildInfo />
          <View style={styles.chatHeader}>
            <Hash size={16} color="#A6A6A6" strokeWidth={1.5} />
            <Text style={styles.chatHeaderText}>general</Text>
          </View>
          <ChatView />
        </View>
      )}
      
      {activeTab === 'discovery' && <DiscoveryView />}
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  headerTabActive: {
    backgroundColor: '#FFFFFF',
  },
  headerTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A6A6A6',
  },
  headerTabTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  content: {
    flex: 1,
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
  guildOptionsButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
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
  chatContainer: {
    flex: 1,
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
    paddingTop: 16,
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
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discoveryContainer: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
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
  guildCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  guildCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  guildCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4DABF7' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  guildCardInfo: {
    flex: 1,
  },
  guildCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  guildCardMeta: {
    fontSize: 12,
    color: '#A6A6A6',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4DABF7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  joinButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  guildCardDescription: {
    fontSize: 14,
    color: '#A6A6A6',
    lineHeight: 20,
    marginBottom: 12,
  },
  guildCardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  guildTag: {
    backgroundColor: '#333333',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  guildTagText: {
    fontSize: 11,
    color: '#A6A6A6',
    fontWeight: '500',
  },
});
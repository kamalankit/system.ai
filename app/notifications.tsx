import React, { useState, useEffect } from 'react';
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
import { ChevronLeft, ChevronRight, Bell, Trophy, Target, Users, Flame, Star, CircleCheck as CheckCircle, Clock, Gift, Zap, Calendar, Settings, Trash2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCustomAlert } from '@/hooks/useCustomAlert';
import CustomAlert from '@/components/CustomAlert';

interface Notification {
  id: string;
  type: 'achievement' | 'quest' | 'guild' | 'streak' | 'reminder' | 'system';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionable?: boolean;
  actionText?: string;
  actionRoute?: string;
  icon?: string;
  color?: string;
}

// Icon mapping for string-based icon references
const iconMap = {
  trophy: Trophy,
  target: Target,
  users: Users,
  flame: Flame,
  star: Star,
  clock: Clock,
  gift: Gift,
  bell: Bell,
  zap: Zap,
  calendar: Calendar,
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'achievement',
    title: 'New Achievement Unlocked! 🏆',
    message: 'Congratulations! You\'ve earned the "Streak Master" achievement for maintaining a 7-day streak.',
    timestamp: Date.now() - 300000, // 5 minutes ago
    read: false,
    actionable: true,
    actionText: 'View Achievement',
    actionRoute: '/(tabs)/evolution',
    icon: 'trophy',
    color: '#FFB366',
  },
  {
    id: '2',
    type: 'quest',
    title: 'Daily Quest Reminder ⚡',
    message: 'You have 3 incomplete daily quests. Complete them before midnight to maintain your streak!',
    timestamp: Date.now() - 1800000, // 30 minutes ago
    read: false,
    actionable: true,
    actionText: 'View Quests',
    actionRoute: '/(tabs)/quests',
    icon: 'target',
    color: '#4DABF7',
  },
  {
    id: '3',
    type: 'guild',
    title: 'Guild Activity 👥',
    message: 'ShadowHunter shared a new achievement in Elite Hunters guild. Check it out!',
    timestamp: Date.now() - 3600000, // 1 hour ago
    read: true,
    actionable: true,
    actionText: 'Open Guild',
    actionRoute: '/(tabs)/guild',
    icon: 'users',
    color: '#51CF66',
  },
  {
    id: '4',
    type: 'streak',
    title: 'Streak Alert! 🔥',
    message: 'Amazing! You\'re on a 7-day streak. Keep the momentum going, Hunter!',
    timestamp: Date.now() - 7200000, // 2 hours ago
    read: true,
    actionable: false,
    icon: 'flame',
    color: '#FF6B6B',
  },
  {
    id: '5',
    type: 'reminder',
    title: 'Focus Time Reminder 🧠',
    message: 'It\'s been a while since your last deep work session. Ready to focus?',
    timestamp: Date.now() - 10800000, // 3 hours ago
    read: true,
    actionable: true,
    actionText: 'Start Timer',
    actionRoute: '/(tabs)/index',
    icon: 'clock',
    color: '#9775FA',
  },
  {
    id: '6',
    type: 'system',
    title: 'Weekly Progress Report 📊',
    message: 'Your weekly evolution report is ready! You\'ve completed 28/35 weekly goals.',
    timestamp: Date.now() - 86400000, // 1 day ago
    read: true,
    actionable: true,
    actionText: 'View Report',
    actionRoute: '/(tabs)/evolution',
    icon: 'star',
    color: '#FFC107',
  },
  {
    id: '7',
    type: 'achievement',
    title: 'Domain Milestone 🎯',
    message: 'You\'ve reached B-Class in the Physical domain! Your dedication is paying off.',
    timestamp: Date.now() - 172800000, // 2 days ago
    read: true,
    actionable: true,
    actionText: 'View Progress',
    actionRoute: '/domain/physical',
    icon: 'trophy',
    color: '#FFB366',
  },
  {
    id: '8',
    type: 'reminder',
    title: 'Journal Reminder 📝',
    message: 'Take a moment for self-reflection. Your shadow work journal is waiting.',
    timestamp: Date.now() - 259200000, // 3 days ago
    read: true,
    actionable: true,
    actionText: 'Open Journal',
    actionRoute: '/journal',
    icon: 'gift',
    color: '#9775FA',
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { alertConfig, showAlert, hideAlert } = useCustomAlert();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'achievements' | 'quests'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem('notifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      } else {
        // Use mock data for first time
        setNotifications(mockNotifications);
        await AsyncStorage.setItem('notifications', JSON.stringify(mockNotifications));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications(mockNotifications);
    }
  };

  const saveNotifications = async (updatedNotifications: Notification[]) => {
    try {
      await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    await saveNotifications(updatedNotifications);
  };

  const markAllAsRead = async () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true,
    }));
    await saveNotifications(updatedNotifications);
  };

  const deleteNotification = async (notificationId: string) => {
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    await saveNotifications(updatedNotifications);
  };

  const clearAllNotifications = () => {
    showAlert({
      title: 'Clear All Notifications',
      message: 'Are you sure you want to delete all notifications? This action cannot be undone.',
      type: 'warning',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await saveNotifications([]);
            showAlert({
              title: 'Notifications Cleared',
              message: 'All notifications have been deleted.',
              type: 'success',
            });
          },
        },
      ],
    });
  };

  const handleNotificationPress = async (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate if actionable
    if (notification.actionable && notification.actionRoute) {
      router.push(notification.actionRoute as any);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'now';
  };

  const getFilteredNotifications = () => {
    switch (selectedFilter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'achievements':
        return notifications.filter(n => n.type === 'achievement');
      case 'quests':
        return notifications.filter(n => n.type === 'quest' || n.type === 'reminder');
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const filters = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'achievements', label: 'Achievements', count: notifications.filter(n => n.type === 'achievement').length },
    { id: 'quests', label: 'Quests', count: notifications.filter(n => n.type === 'quest' || n.type === 'reminder').length },
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => showAlert({
            title: 'Notification Settings',
            message: 'Notification preferences will be available in the next update.',
            type: 'info',
          })}
          activeOpacity={0.7}
        >
          <Settings size={20} color="#A6A6A6" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      {unreadCount > 0 && (
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.markAllReadButton}
            onPress={markAllAsRead}
            activeOpacity={0.8}
          >
            <CheckCircle size={16} color="#51CF66" strokeWidth={1.5} />
            <Text style={styles.markAllReadText}>Mark All Read</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={clearAllNotifications}
            activeOpacity={0.8}
          >
            <Trash2 size={16} color="#FF6B6B" strokeWidth={1.5} />
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              selectedFilter === filter.id && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter.id as any)}
            activeOpacity={0.7}
          >
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
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Notifications List */}
      <ScrollView 
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? 88 + insets.bottom + 20 : 68 + insets.bottom + 20
        }}
      >
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={48} color="#333333" strokeWidth={1} />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyDescription}>
              {selectedFilter === 'unread' 
                ? 'All caught up! No unread notifications.'
                : 'You\'ll see your notifications here when they arrive.'
              }
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => {
            const IconComponent = notification.icon ? iconMap[notification.icon as keyof typeof iconMap] || Bell : Bell;
            
            return (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.read && styles.notificationCardUnread,
                ]}
                onPress={() => handleNotificationPress(notification)}
                activeOpacity={0.8}
              >
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <View style={[
                      styles.notificationIcon,
                      { backgroundColor: (notification.color || '#4DABF7') + '20' }
                    ]}>
                      <IconComponent 
                        size={20} 
                        color={notification.color || '#4DABF7'} 
                        strokeWidth={1.5} 
                      />
                    </View>
                    
                    <View style={styles.notificationInfo}>
                      <Text style={[
                        styles.notificationTitle,
                        !notification.read && styles.notificationTitleUnread,
                      ]}>
                        {notification.title}
                      </Text>
                      <Text style={styles.notificationTime}>
                        {formatTimestamp(notification.timestamp)}
                      </Text>
                    </View>

                    {!notification.read && (
                      <View style={styles.unreadIndicator} />
                    )}
                  </View>

                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>

                  {notification.actionable && (
                    <View style={styles.notificationActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleNotificationPress(notification)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.actionButtonText}>
                          {notification.actionText || 'View'}
                        </Text>
                        <ChevronRight size={14} color="#4DABF7" strokeWidth={1.5} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteNotification(notification.id)}
                  activeOpacity={0.7}
                >
                  <Trash2 size={16} color="#666666" strokeWidth={1.5} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        buttons={alertConfig.buttons}
        onClose={hideAlert}
      />
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  markAllReadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#51CF66' + '20',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  markAllReadText: {
    fontSize: 14,
    color: '#51CF66',
    fontWeight: '600',
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B' + '20',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  clearAllText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333333',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
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
  notificationsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  notificationCardUnread: {
    borderColor: '#4DABF7',
    backgroundColor: '#4DABF7' + '05',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  notificationTitleUnread: {
    color: '#4DABF7',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4DABF7',
    marginLeft: 8,
    marginTop: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#A6A6A6',
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4DABF7' + '20',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#4DABF7',
    fontWeight: '600',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    alignSelf: 'flex-start',
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
    paddingHorizontal: 32,
  },
});
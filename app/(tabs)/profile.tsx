import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  User, 
  CreditCard as Edit3, 
  Settings, 
  Bell, 
  Shield, 
  CircleHelp as HelpCircle, 
  LogOut, 
  Crown, 
  Calendar, 
  Trophy, 
  ChevronRight, 
  Moon, 
  Volume2, 
  Smartphone,
  Sun,
  Monitor
} from 'lucide-react-native';
import { userData } from '@/data/mockData';
import { useTheme } from '@/contexts/ThemeContext';
import { useCustomAlert } from '@/hooks/useCustomAlert';
import CustomAlert from '@/components/CustomAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();
  const { themeMode, setThemeMode, isDark } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const insets = useSafeAreaInsets();
  const { alertConfig, showAlert, hideAlert } = useCustomAlert();

  const profileStats = [
    {
      label: 'Current Rank',
      value: userData.profile.rank,
      icon: Crown,
      color: '#FFB366',
    },
    {
      label: 'Days Active',
      value: Math.floor((Date.now() - new Date(userData.profile.joinDate).getTime()) / (1000 * 60 * 60 * 24)),
      icon: Calendar,
      color: '#4DABF7',
    },
    {
      label: 'Achievements',
      value: userData.achievements.filter(a => a.earned).length,
      icon: Trophy,
      color: '#51CF66',
    },
  ];

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handlePersonalReflection = () => {
    router.push('/journal');
  };

  const handleSignOut = async () => {
    showAlert({
      title: 'Sign Out',
      message: 'Are you sure you want to sign out?',
      type: 'warning',
      buttons: [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all stored data
              await AsyncStorage.multiRemove([
                'userToken',
                'userData',
                'preferences',
                'questProgress',
                'achievements',
                'guildData',
                'journalEntries',
                'assessmentResults',
                'userSettings',
              ]);
              
              // Show success message
              showAlert({
                title: 'Signed Out Successfully',
                message: 'You have been signed out of your account.',
                type: 'success',
                buttons: [
                  {
                    text: 'OK',
                    onPress: () => router.replace('/auth'),
                  },
                ],
              });
            } catch (error) {
              console.error('Error signing out:', error);
              showAlert({
                title: 'Error',
                message: 'Failed to sign out. Please try again.',
                type: 'error',
              });
            }
          },
        },
      ],
    });
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      default:
        return Monitor;
    }
  };

  const getThemeLabel = () => {
    switch (themeMode) {
      case 'light':
        return 'Light Mode';
      case 'dark':
        return 'Dark Mode';
      default:
        return 'System';
    }
  };

  const handleThemePress = () => {
    // Cycle through theme modes
    const modes: Array<'system' | 'light' | 'dark'> = ['system', 'light', 'dark'];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        {
          icon: Edit3,
          label: 'Edit Profile',
          action: handleEditProfile,
          hasChevron: true,
        },
        {
          icon: Shield,
          label: 'Privacy Settings',
          action: () => showAlert({
            title: 'Privacy Settings',
            message: 'Privacy settings will be available in the next update.',
            type: 'info',
          }),
          hasChevron: true,
        },
        {
          icon: Bell,
          label: 'Notifications',
          hasSwitch: true,
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
      ],
    },
    {
      title: 'App Settings',
      items: [
        {
          icon: getThemeIcon(),
          label: getThemeLabel(),
          action: handleThemePress,
          hasChevron: true,
          subtitle: themeMode === 'system' ? 'Follows system setting' : undefined,
        },
        {
          icon: Volume2,
          label: 'Sound Effects',
          hasSwitch: true,
          value: soundEnabled,
          onToggle: setSoundEnabled,
        },
        {
          icon: Smartphone,
          label: 'App Preferences',
          action: () => showAlert({
            title: 'App Preferences',
            message: 'Additional preferences will be available soon.',
            type: 'info',
          }),
          hasChevron: true,
        },
      ],
    },
    {
      title: 'Personal Growth',
      items: [
        {
          icon: Edit3,
          label: 'Personal Reflection',
          action: handlePersonalReflection,
          hasChevron: true,
          subtitle: 'Shadow work journal',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & FAQ',
          action: () => showAlert({
            title: 'Help & FAQ',
            message: 'Visit our help center for detailed guides and frequently asked questions.',
            type: 'info',
          }),
          hasChevron: true,
        },
        {
          icon: Settings,
          label: 'About',
          action: () => showAlert({
            title: 'About Hunter Evolution',
            message: 'Version 1.0.0\n\nTransform your life through systematic evolution across six domains of human potential.',
            type: 'info',
          }),
          hasChevron: true,
        },
      ],
    },
  ];

  const MenuItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={item.action}
      disabled={item.hasSwitch}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>
          <item.icon size={18} color="#A6A6A6" strokeWidth={1.5} />
        </View>
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemLabel}>{item.label}</Text>
          {item.subtitle && (
            <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.menuItemRight}>
        {item.hasSwitch ? (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: '#333333', true: '#4DABF7' }}
            thumbColor={item.value ? '#FFFFFF' : '#666666'}
          />
        ) : item.hasChevron ? (
          <ChevronRight size={18} color="#666666" strokeWidth={1.5} />
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? 88 + insets.bottom + 20 : 68 + insets.bottom + 20
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User size={32} color="#FFFFFF" strokeWidth={1.5} />
              </View>
              <TouchableOpacity 
                style={styles.editAvatarButton}
                onPress={handleEditProfile}
                activeOpacity={0.7}
              >
                <Edit3 size={12} color="#FFFFFF" strokeWidth={1.5} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userData.profile.name}</Text>
              <Text style={styles.userLevel}>
                Level {userData.profile.level} • {userData.profile.totalXP.toLocaleString()} XP
              </Text>
              <Text style={styles.joinDate}>
                Hunter since {new Date(userData.profile.joinDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {profileStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                  <Icon size={20} color={stat.color} strokeWidth={1.5} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Shadow Work Journal */}
        <View style={styles.journalSection}>
          <Text style={styles.sectionTitle}>Shadow Work Journal</Text>
          <TouchableOpacity 
            style={styles.journalCard}
            onPress={handlePersonalReflection}
            activeOpacity={0.8}
          >
            <View style={styles.journalHeader}>
              <Text style={styles.journalTitle}>Personal Reflection</Text>
              <Text style={styles.journalDate}>Today</Text>
            </View>
            <Text style={styles.journalPreview}>
              Today I focused on understanding my resistance to...
            </Text>
            <View style={styles.journalFooter}>
              <Text style={styles.journalAction}>Continue writing</Text>
              <ChevronRight size={16} color="#4DABF7" strokeWidth={1.5} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            <View style={styles.menuSectionContent}>
              {section.items.map((item, itemIndex) => (
                <MenuItem key={itemIndex} item={item} />
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <TouchableOpacity 
            style={styles.signOutButton} 
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <LogOut size={18} color="#FF6B6B" strokeWidth={1.5} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Hunter Evolution v1.0.0</Text>
        </View>
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 32,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4DABF7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userLevel: {
    fontSize: 16,
    color: '#A6A6A6',
    fontWeight: '500',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#A6A6A6',
    textAlign: 'center',
  },
  journalSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  journalCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  journalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  journalDate: {
    fontSize: 12,
    color: '#A6A6A6',
  },
  journalPreview: {
    fontSize: 14,
    color: '#A6A6A6',
    lineHeight: 20,
    marginBottom: 12,
  },
  journalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  journalAction: {
    fontSize: 14,
    color: '#4DABF7',
    fontWeight: '500',
  },
  menuSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  menuSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  menuSectionContent: {
    backgroundColor: '#111111',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333333',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    minHeight: 56,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#A6A6A6',
    marginTop: 2,
  },
  menuItemRight: {
    alignItems: 'center',
  },
  signOutSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B' + '20',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FF6B6B' + '40',
    gap: 8,
    minHeight: 56,
  },
  signOutText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  versionSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#666666',
  },
});
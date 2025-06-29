import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  User, 
  Bell, 
  Shield, 
  CircleHelp as HelpCircle, 
  LogOut, 
  Moon, 
  Volume2, 
  Smartphone, 
  Download, 
  Trash2, 
  ChevronRight 
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
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
              
              // Reset navigation to auth screen
              router.replace('/auth');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all data and navigate to auth
              await AsyncStorage.clear();
              router.replace('/auth');
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleClearCache = async () => {
    try {
      // Clear only cache data, not user data
      await AsyncStorage.removeItem('imageCache');
      await AsyncStorage.removeItem('tempData');
      Alert.alert('Success', 'Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
      Alert.alert('Error', 'Failed to clear cache');
    }
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Edit Profile',
          action: () => router.push('/profile/edit'),
          hasChevron: true,
        },
        {
          icon: Shield,
          label: 'Privacy Settings',
          action: () => console.log('Privacy Settings'),
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
          icon: Moon,
          label: 'Dark Mode',
          hasSwitch: true,
          value: darkModeEnabled,
          onToggle: setDarkModeEnabled,
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
          action: () => console.log('App Preferences'),
          hasChevron: true,
        },
      ],
    },
    {
      title: 'Data',
      items: [
        {
          icon: Download,
          label: 'Export Data',
          action: () => console.log('Export Data'),
          hasChevron: true,
        },
        {
          icon: Trash2,
          label: 'Clear Cache',
          action: handleClearCache,
          hasChevron: true,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & FAQ',
          action: () => console.log('Help & FAQ'),
          hasChevron: true,
        },
        {
          icon: Smartphone,
          label: 'About',
          action: () => console.log('About'),
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
        <Text style={styles.menuItemLabel}>{item.label}</Text>
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? 88 + insets.bottom + 20 : 68 + insets.bottom + 20
        }}
      >
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

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.dangerSectionTitle}>Danger Zone</Text>
          
          <TouchableOpacity 
            style={styles.signOutButton} 
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <LogOut size={18} color="#FF6B6B" strokeWidth={1.5} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={handleDeleteAccount}
            activeOpacity={0.8}
          >
            <Trash2 size={18} color="#FF6B6B" strokeWidth={1.5} />
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Hunter Evolution v1.0.0</Text>
          <Text style={styles.versionSubtext}>Built with ❤️ for hunters</Text>
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
  menuSection: {
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
  menuItemLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  menuItemRight: {
    alignItems: 'center',
  },
  dangerSection: {
    marginBottom: 32,
  },
  dangerSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    marginBottom: 16,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B' + '20',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    gap: 8,
    minHeight: 56,
  },
  deleteText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  versionSection: {
    paddingBottom: 32,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 10,
    color: '#333333',
  },
});
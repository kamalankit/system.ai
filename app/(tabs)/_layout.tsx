import { Tabs } from 'expo-router';
import { Chrome as Home, Sword, Users, TrendingUp, Target, Calendar } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#333333',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 + insets.bottom : 68 + insets.bottom,
          paddingBottom: Platform.OS === 'ios' ? 32 + insets.bottom : 12 + insets.bottom,
          paddingTop: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#666666',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: 'Quests',
          tabBarIcon: ({ size, color }) => (
            <Sword size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="battle-training"
        options={{
          title: 'Training',
          tabBarIcon: ({ size, color }) => (
            <Target size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="guild"
        options={{
          title: 'Guild',
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="evolution"
        options={{
          title: 'Evolution',
          tabBarIcon: ({ size, color }) => (
            <TrendingUp size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
    </Tabs>
  );
}
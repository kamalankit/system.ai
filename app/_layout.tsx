import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="assessment" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="domain/[id]" />
        <Stack.Screen name="quest/[id]" />
        <Stack.Screen name="quest/create" />
        <Stack.Screen name="guild/[id]" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="journal" />
        <Stack.Screen name="profile/edit" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar 
        style="light" 
        backgroundColor="#000000" 
        translucent={false}
      />
    </SafeAreaProvider>
  );
}
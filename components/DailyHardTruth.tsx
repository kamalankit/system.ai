import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Scroll, RefreshCw } from 'lucide-react-native';
import { getDailyHardTruth, getRandomHardTruth } from '@/data/hardTruths';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DailyHardTruthProps {
  style?: any;
}

export default function DailyHardTruth({ style }: DailyHardTruthProps) {
  const [currentQuote, setCurrentQuote] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));

  useEffect(() => {
    loadDailyQuote();
  }, []);

  useEffect(() => {
    if (currentQuote) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentQuote]);

  const loadDailyQuote = async () => {
    try {
      const today = new Date().toDateString();
      const storedData = await AsyncStorage.getItem('dailyHardTruth');
      
      if (storedData) {
        const { date, quote } = JSON.parse(storedData);
        if (date === today) {
          setCurrentQuote(quote);
          return;
        }
      }
      
      // Get new daily quote
      const newQuote = getDailyHardTruth();
      setCurrentQuote(newQuote);
      
      // Store for today
      await AsyncStorage.setItem('dailyHardTruth', JSON.stringify({
        date: today,
        quote: newQuote,
      }));
    } catch (error) {
      console.error('Error loading daily quote:', error);
      setCurrentQuote(getDailyHardTruth());
    }
  };

  const refreshQuote = async () => {
    // Animate out
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Get random quote
      const newQuote = getRandomHardTruth();
      setCurrentQuote(newQuote);
    });
  };

  if (!currentQuote) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        style,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Scroll size={20} color="#FFB366" strokeWidth={1.5} />
          </View>
          <Text style={styles.title}>Hunter's Wisdom</Text>
        </View>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={refreshQuote}
          activeOpacity={0.7}
        >
          <RefreshCw size={16} color="#A6A6A6" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.quote}>"{currentQuote}"</Text>
      
      <View style={styles.footer}>
        <View style={styles.divider} />
        <Text style={styles.footerText}>Daily Truth • Tap refresh for more wisdom</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFB366' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quote: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
  },
  footer: {
    alignItems: 'center',
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: '#333333',
    borderRadius: 1,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
});
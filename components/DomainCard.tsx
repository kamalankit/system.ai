import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import ProgressRing from './ProgressRing';

interface Domain {
  id: string;
  name: string;
  icon: LucideIcon;
  level: string;
  progress: number;
  xp: number;
  color: string;
}

interface DomainCardProps {
  domain: Domain;
  onPress?: (domain: Domain) => void;
}

export default function DomainCard({ domain, onPress }: DomainCardProps) {
  const Icon = domain.icon;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(domain)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon size={16} color="#A6A6A6" strokeWidth={1.5} />
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{domain.level}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.domainName}>{domain.name}</Text>
          <Text style={styles.xpText}>{domain.xp.toLocaleString()} XP</Text>
        </View>
        <ProgressRing
          progress={domain.progress}
          size={40}
          strokeWidth={2}
          color={domain.color}
          showText={false}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelBadge: {
    backgroundColor: '#161616',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  domainName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  xpText: {
    fontSize: 12,
    color: '#A6A6A6',
    fontWeight: '500',
  },
});
export const userData = {
  profile: {
    name: 'Hunter',
    level: 42,
    totalXP: 18670,
    rank: 'B-Class',
    joinDate: '2024-01-15',
    avatar: null,
    email: 'hunter@evolution.com',
    age: '28',
    location: 'San Francisco, CA',
    phone: '+1 (555) 123-4567',
    bio: 'Dedicated hunter on a journey of self-improvement and evolution across all life domains.',
    goals: 'Reach S-Class rank, master all domains, and help others on their evolution journey.',
  },
  stats: {
    streak: 7,
    todayCompleted: 3,
    todayTotal: 8,
    weeklyGoal: 35,
    weeklyCompleted: 28,
  },
  domains: [
    {
      id: 'physical',
      name: 'Physical',
      level: 'B',
      progress: 75,
      xp: 2840,
      color: '#FF6B6B',
      rank: 'B-Class',
      quests: 156,
      achievements: 23,
    },
    {
      id: 'mental',
      name: 'Mental',
      level: 'A',
      progress: 85,
      xp: 3200,
      color: '#4DABF7',
      rank: 'A-Class',
      quests: 189,
      achievements: 31,
    },
    {
      id: 'emotional',
      name: 'Emotional',
      level: 'C',
      progress: 60,
      xp: 1920,
      color: '#51CF66',
      rank: 'C-Class',
      quests: 98,
      achievements: 15,
    },
    {
      id: 'social',
      name: 'Social',
      level: 'B',
      progress: 70,
      xp: 2560,
      color: '#FFB366',
      rank: 'B-Class',
      quests: 134,
      achievements: 19,
    },
    {
      id: 'financial',
      name: 'Financial',
      level: 'C',
      progress: 55,
      xp: 1650,
      color: '#9775FA',
      rank: 'C-Class',
      quests: 87,
      achievements: 12,
    },
    {
      id: 'spiritual',
      name: 'Spiritual',
      level: 'A',
      progress: 90,
      xp: 3600,
      color: '#FFC107',
      rank: 'A-Class',
      quests: 201,
      achievements: 38,
    },
  ],
  quests: [
    {
      id: 1,
      type: 'simple',
      domain: 'physical',
      title: '30 minutes workout',
      description: 'Complete a full body workout session',
      xp: 50,
      completed: false,
      difficulty: 'Medium',
      estimatedTime: 30,
    },
    {
      id: 2,
      type: 'photo',
      domain: 'physical',
      title: 'Healthy meal photo',
      description: 'Take a photo of your nutritious meal',
      xp: 30,
      completed: false,
      difficulty: 'Easy',
      estimatedTime: 5,
    },
    {
      id: 3,
      type: 'timer',
      domain: 'mental',
      title: 'Meditation session',
      description: 'Practice mindfulness meditation',
      xp: 40,
      duration: 900, // 15 minutes in seconds
      completed: false,
      difficulty: 'Easy',
      estimatedTime: 15,
    },
    {
      id: 4,
      type: 'simple',
      domain: 'social',
      title: 'Call a friend',
      description: 'Reach out to someone you care about',
      xp: 35,
      completed: false,
      difficulty: 'Easy',
      estimatedTime: 20,
    },
    {
      id: 5,
      type: 'checklist',
      domain: 'financial',
      title: 'Budget review',
      description: 'Review and update your monthly budget',
      xp: 60,
      completed: false,
      difficulty: 'Hard',
      estimatedTime: 60,
      subtasks: ['Review expenses', 'Update categories', 'Set new goals'],
    },
    {
      id: 6,
      type: 'simple',
      domain: 'emotional',
      title: 'Journal reflection',
      description: 'Write about your thoughts and feelings',
      xp: 25,
      completed: false,
      difficulty: 'Easy',
      estimatedTime: 15,
    },
    {
      id: 7,
      type: 'timer',
      domain: 'spiritual',
      title: 'Gratitude practice',
      description: 'Spend time reflecting on what you\'re grateful for',
      xp: 30,
      duration: 600, // 10 minutes
      completed: false,
      difficulty: 'Easy',
      estimatedTime: 10,
    },
    {
      id: 8,
      type: 'photo',
      domain: 'financial',
      title: 'Receipt tracking',
      description: 'Document your daily expenses with photos',
      xp: 40,
      completed: false,
      difficulty: 'Medium',
      estimatedTime: 10,
    },
  ],
  guilds: [
    {
      id: 1,
      name: 'Elite Hunters',
      description: 'For serious hunters pursuing excellence across all domains',
      members: 1247,
      level: 'S-Class',
      isJoined: true,
      activity: 'Very High',
      focus: ['Physical', 'Mental', 'Financial'],
    },
    {
      id: 2,
      name: 'Mindful Warriors',
      description: 'Balancing strength with inner peace and emotional intelligence',
      members: 892,
      level: 'A-Class',
      isJoined: false,
      activity: 'High',
      focus: ['Emotional', 'Spiritual', 'Mental'],
    },
    {
      id: 3,
      name: 'Social Builders',
      description: 'Building connections and community while growing together',
      members: 634,
      level: 'B-Class',
      isJoined: false,
      activity: 'Medium',
      focus: ['Social', 'Emotional'],
    },
    {
      id: 4,
      name: 'Financial Freedom',
      description: 'Mastering money management and building wealth systematically',
      members: 445,
      level: 'A-Class',
      isJoined: false,
      activity: 'High',
      focus: ['Financial', 'Mental'],
    },
  ],
  achievements: [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first quest',
      icon: 'target',
      earned: true,
      earnedDate: '2024-01-15',
      xp: 10,
      rarity: 'Common',
    },
    {
      id: 2,
      title: 'Streak Master',
      description: 'Maintain a 7-day streak',
      icon: 'flame',
      earned: true,
      earnedDate: '2024-01-22',
      xp: 100,
      rarity: 'Rare',
    },
    {
      id: 3,
      title: 'Domain Expert',
      description: 'Reach A-Class in any domain',
      icon: 'star',
      earned: true,
      earnedDate: '2024-02-10',
      xp: 250,
      rarity: 'Epic',
    },
    {
      id: 4,
      title: 'Social Butterfly',
      description: 'Join your first guild',
      icon: 'users',
      earned: true,
      earnedDate: '2024-01-20',
      xp: 50,
      rarity: 'Uncommon',
    },
    {
      id: 5,
      title: 'Perfect Balance',
      description: 'Reach B-Class in all domains',
      icon: 'balance',
      earned: false,
      xp: 500,
      rarity: 'Legendary',
    },
    {
      id: 6,
      title: 'Financial Guru',
      description: 'Complete 50 financial quests',
      icon: 'dollar-sign',
      earned: false,
      xp: 200,
      rarity: 'Rare',
    },
    {
      id: 7,
      title: 'Quest Creator',
      description: 'Create your first custom quest',
      icon: 'plus',
      earned: false,
      xp: 75,
      rarity: 'Uncommon',
    },
  ],
  guildChat: [
    {
      id: 1,
      userId: 'user1',
      username: 'ShadowHunter',
      message: 'Just completed my morning workout! 💪',
      timestamp: Date.now() - 300000, // 5 minutes ago
      avatar: null,
    },
    {
      id: 2,
      userId: 'user2',
      username: 'MindfulWarrior',
      message: 'Great job! I\'m about to start my meditation session',
      timestamp: Date.now() - 240000, // 4 minutes ago
      avatar: null,
    },
    {
      id: 3,
      userId: 'current',
      username: 'Hunter',
      message: 'Thanks for the motivation, team!',
      timestamp: Date.now() - 180000, // 3 minutes ago
      avatar: null,
    },
    {
      id: 4,
      userId: 'user3',
      username: 'WealthBuilder',
      message: 'Anyone want to join me for the budget challenge this week?',
      timestamp: Date.now() - 120000, // 2 minutes ago
      avatar: null,
    },
  ],
  journalEntries: [
    {
      id: 1,
      title: 'Understanding My Resistance',
      content: 'Today I noticed I have been avoiding my physical fitness goals. I think it stems from fear of failure and past experiences where I gave up. I want to explore this pattern and understand why I sabotage my own progress...',
      date: '2024-01-15',
      mood: 'neutral' as const,
    },
    {
      id: 2,
      title: 'Breakthrough in Social Connections',
      content: 'Had an amazing conversation with a colleague today. I realized I have been holding back in relationships because I fear being judged. This awareness feels liberating and I want to practice being more authentic...',
      date: '2024-01-14',
      mood: 'positive' as const,
    },
    {
      id: 3,
      title: 'Dealing with Perfectionism',
      content: 'My perfectionist tendencies are showing up again. I spent 3 hours on a task that should have taken 30 minutes. I need to practice accepting "good enough" and focus on progress over perfection...',
      date: '2024-01-13',
      mood: 'negative' as const,
    },
  ],
  dailyQuestTemplates: [
    {
      id: 'morning-routine',
      title: 'Morning Routine',
      description: 'Complete your energizing morning routine',
      domain: 'physical',
      type: 'checklist',
      difficulty: 'Easy',
      estimatedTime: 30,
      xp: 45,
      subtasks: ['Drink water', 'Stretch for 5 minutes', 'Make bed', 'Healthy breakfast'],
      isTemplate: true,
    },
    {
      id: 'mindful-moment',
      title: 'Mindful Moment',
      description: 'Take a moment to center yourself',
      domain: 'mental',
      type: 'timer',
      difficulty: 'Easy',
      estimatedTime: 5,
      xp: 25,
      duration: 300, // 5 minutes
      isTemplate: true,
    },
    {
      id: 'gratitude-photo',
      title: 'Gratitude Photo',
      description: 'Capture something you\'re grateful for today',
      domain: 'spiritual',
      type: 'photo',
      difficulty: 'Easy',
      estimatedTime: 5,
      xp: 30,
      isTemplate: true,
    },
  ],
};

// Helper functions for data persistence
export const updateUserProfile = (updates: Partial<typeof userData.profile>) => {
  Object.assign(userData.profile, updates);
};

export const addJournalEntry = (entry: Omit<typeof userData.journalEntries[0], 'id'>) => {
  const newEntry = {
    ...entry,
    id: userData.journalEntries.length + 1,
  };
  userData.journalEntries.unshift(newEntry);
  return newEntry;
};

export const updateJournalEntry = (id: number, updates: Partial<typeof userData.journalEntries[0]>) => {
  const index = userData.journalEntries.findIndex(entry => entry.id === id);
  if (index !== -1) {
    Object.assign(userData.journalEntries[index], updates);
    return userData.journalEntries[index];
  }
  return null;
};

export const deleteJournalEntry = (id: number) => {
  const index = userData.journalEntries.findIndex(entry => entry.id === id);
  if (index !== -1) {
    userData.journalEntries.splice(index, 1);
    return true;
  }
  return false;
};

export const addGuildMessage = (message: Omit<typeof userData.guildChat[0], 'id'>) => {
  const newMessage = {
    ...message,
    id: Date.now(),
  };
  userData.guildChat.push(newMessage);
  return newMessage;
};

export const completeQuest = (questId: number) => {
  const quest = userData.quests.find(q => q.id === questId);
  if (quest) {
    quest.completed = true;
    // Add XP to profile
    userData.profile.totalXP += quest.xp;
    
    // Update domain XP
    const domain = userData.domains.find(d => d.id === quest.domain);
    if (domain) {
      domain.xp += quest.xp;
      domain.quests += 1;
      
      // Recalculate progress (simple formula)
      const maxXPForLevel = 5000; // Example max XP for current level
      domain.progress = Math.min(100, Math.round((domain.xp / maxXPForLevel) * 100));
    }
    
    // Update stats
    userData.stats.todayCompleted += 1;
    userData.stats.weeklyCompleted += 1;
    
    return quest;
  }
  return null;
};

export const addQuest = (quest: any) => {
  const newQuest = {
    ...quest,
    id: userData.quests.length + 1,
  };
  userData.quests.push(newQuest);
  
  // Check for Quest Creator achievement
  const questCreatorAchievement = userData.achievements.find(a => a.id === 7);
  if (questCreatorAchievement && !questCreatorAchievement.earned) {
    questCreatorAchievement.earned = true;
    questCreatorAchievement.earnedDate = new Date().toISOString().split('T')[0];
    userData.profile.totalXP += questCreatorAchievement.xp;
  }
  
  return newQuest;
};

export const generateDailyQuests = () => {
  const today = new Date().toISOString().split('T')[0];
  const existingDailyQuests = userData.quests.filter(q => 
    q.createdDate === today && q.isDaily
  );
  
  // If we already have daily quests for today, return them
  if (existingDailyQuests.length > 0) {
    return existingDailyQuests;
  }
  
  // Generate new daily quests from templates
  const dailyQuests = userData.dailyQuestTemplates.map((template, index) => ({
    ...template,
    id: Date.now() + index,
    isTemplate: false,
    isDaily: true,
    createdDate: today,
    completed: false,
  }));
  
  // Add to quests array
  userData.quests.push(...dailyQuests);
  
  return dailyQuests;
};

export const getDailyQuests = () => {
  const today = new Date().toISOString().split('T')[0];
  return userData.quests.filter(q => 
    q.createdDate === today && q.isDaily
  );
};

export const getQuestsByDomain = (domain: string) => {
  return userData.quests.filter(q => q.domain === domain);
};

export const getCompletedQuests = () => {
  return userData.quests.filter(q => q.completed);
};

export const getPendingQuests = () => {
  return userData.quests.filter(q => !q.completed);
};
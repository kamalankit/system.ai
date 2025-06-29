export interface DailyMetrics {
  date: Date;
  totalTasks: number;
  completedTasks: number;
  successRate: number;
  domainBreakdown: Record<string, {
    total: number;
    completed: number;
    rate: number;
  }>;
}

export interface VisualizationGoal {
  id: string;
  category: 'house_family' | 'car' | 'house_personal' | 'money' | 'physical';
  timeframe: '6months' | '1year' | '2years' | '5years' | '10years';
  description: string;
  imageUrl?: string;
  targetAmount?: number;
  createdAt: Date;
  updatedAt: Date;
  progress: number;
}

export interface ProblemSolution {
  id: string;
  problem: string;
  triggers: string[];
  longTermImpact: string;
  solutions: string[];
  actionPlan: string[];
  emotionalImpact: number;
  hasControl: boolean;
  followUpDate: Date;
  status: 'active' | 'solved' | 'monitoring';
  createdAt: Date;
}

export interface SystemData {
  motivationMode: boolean;
  dailyChecks: { [date: string]: boolean[] };
  systemStreak: number;
  lastCheckDate: string;
}

export interface HabitPattern {
  id: string;
  habitId: string;
  date: Date;
  completed: boolean;
  trigger?: string;
  environment?: string;
  mood: number; // 1-10 scale
  notes?: string;
}

export interface SuccessRateData {
  daily: DailyMetrics[];
  weekly: {
    week: string;
    successRate: number;
    totalTasks: number;
    completedTasks: number;
  }[];
  monthly: {
    month: string;
    successRate: number;
    improvement: number;
  }[];
}

// Enhanced user data with new tracking capabilities
export const enhancedUserData = {
  // Success rate tracking
  successRates: {
    current: 85,
    target: 80,
    streak: 12,
    bestStreak: 28,
    weeklyTrend: [72, 78, 81, 85, 87, 85, 89],
    monthlyAverage: 82,
  },

  // Battle training progress
  battleTraining: {
    visualizationGoals: [] as VisualizationGoal[],
    systemData: {
      motivationMode: false,
      dailyChecks: {},
      systemStreak: 12,
      lastCheckDate: '',
    } as SystemData,
    problemSolutions: [] as ProblemSolution[],
    clarityScore: 75,
  },

  // Enhanced habit tracking
  habitPatterns: [] as HabitPattern[],
  
  // Daily metrics for the last 30 days
  dailyMetrics: generateDailyMetrics(),

  // Journal templates
  journalTemplates: [
    {
      id: 'daily_rules',
      name: 'Daily Rules Review',
      sections: [
        'Core Rules Check',
        'Rule Violations',
        'System Improvements',
        'Tomorrow\'s Focus'
      ],
    },
    {
      id: 'problem_solving',
      name: 'Problem Solving',
      sections: [
        'Problem Definition',
        'Trigger Analysis',
        'Solution Brainstorm',
        'Action Plan'
      ],
    },
    {
      id: 'behavior_analysis',
      name: 'Behavior Analysis',
      sections: [
        'Behavior Pattern',
        'Environmental Factors',
        'Emotional State',
        'Improvement Strategy'
      ],
    },
    {
      id: 'weekly_review',
      name: 'Weekly Review',
      sections: [
        'Week Highlights',
        'Goal Progress',
        'Lessons Learned',
        'Next Week Planning'
      ],
    },
  ],

  // Core daily rules
  dailyRules: [
    'No phone for first hour after waking',
    'Complete morning routine before 9 AM',
    'Review daily goals before starting work',
    'Take breaks every 90 minutes',
    'No social media during work hours',
    'Exercise for minimum 30 minutes',
    'Journal for 10 minutes before bed',
    'No screens 1 hour before sleep',
  ],
};

function generateDailyMetrics(): DailyMetrics[] {
  const metrics: DailyMetrics[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const totalTasks = Math.floor(Math.random() * 5) + 8; // 8-12 tasks
    const completedTasks = Math.floor(totalTasks * (0.6 + Math.random() * 0.4)); // 60-100% completion
    const successRate = Math.round((completedTasks / totalTasks) * 100);
    
    const domainBreakdown: Record<string, { total: number; completed: number; rate: number }> = {};
    const domains = ['physical', 'mental', 'emotional', 'social', 'financial', 'spiritual'];
    
    domains.forEach(domain => {
      const total = Math.floor(Math.random() * 3) + 1; // 1-3 tasks per domain
      const completed = Math.floor(total * (0.5 + Math.random() * 0.5)); // 50-100% completion
      domainBreakdown[domain] = {
        total,
        completed,
        rate: Math.round((completed / total) * 100),
      };
    });
    
    metrics.push({
      date,
      totalTasks,
      completedTasks,
      successRate,
      domainBreakdown,
    });
  }
  
  return metrics;
}

// Helper functions for data management
export const getSuccessRateForPeriod = (days: number): number => {
  const recentMetrics = enhancedUserData.dailyMetrics.slice(-days);
  const totalTasks = recentMetrics.reduce((sum, day) => sum + day.totalTasks, 0);
  const completedTasks = recentMetrics.reduce((sum, day) => sum + day.completedTasks, 0);
  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
};

export const getDomainSuccessRate = (domain: string, days: number = 7): number => {
  const recentMetrics = enhancedUserData.dailyMetrics.slice(-days);
  const domainData = recentMetrics.map(day => day.domainBreakdown[domain]).filter(Boolean);
  
  if (domainData.length === 0) return 0;
  
  const totalTasks = domainData.reduce((sum, data) => sum + data.total, 0);
  const completedTasks = domainData.reduce((sum, data) => sum + data.completed, 0);
  
  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
};

export const getStreakData = () => {
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  
  // Calculate streaks based on 80%+ success rate
  for (let i = enhancedUserData.dailyMetrics.length - 1; i >= 0; i--) {
    const day = enhancedUserData.dailyMetrics[i];
    if (day.successRate >= 80) {
      tempStreak++;
      if (i === enhancedUserData.dailyMetrics.length - 1) {
        currentStreak = tempStreak;
      }
    } else {
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
      tempStreak = 0;
    }
  }
  
  if (tempStreak > bestStreak) {
    bestStreak = tempStreak;
  }
  
  return { currentStreak, bestStreak };
};

export const getTrendDirection = (days: number = 7): 'up' | 'down' | 'stable' => {
  const recentRates = enhancedUserData.dailyMetrics.slice(-days).map(day => day.successRate);
  if (recentRates.length < 2) return 'stable';
  
  const firstHalf = recentRates.slice(0, Math.floor(recentRates.length / 2));
  const secondHalf = recentRates.slice(Math.floor(recentRates.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, rate) => sum + rate, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, rate) => sum + rate, 0) / secondHalf.length;
  
  const difference = secondAvg - firstAvg;
  
  if (difference > 5) return 'up';
  if (difference < -5) return 'down';
  return 'stable';
};
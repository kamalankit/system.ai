export const hardTruths = [
  // Discipline & Grit (20 quotes)
  "Discipline is choosing between what you want now and what you want most.",
  "Your comfort zone is a beautiful place, but nothing ever grows there.",
  "The pain of discipline weighs ounces, but the pain of regret weighs tons.",
  "Consistency beats intensity when intensity can't be consistent.",
  "You don't rise to the level of your goals, you fall to the level of your systems.",
  "Champions train when they don't feel like it. That's what makes them champions.",
  "The strongest people aren't those who show strength in front of us, but those who win battles we know nothing about.",
  "Motivation gets you started, but discipline keeps you going when motivation fades.",
  "Your future self is watching you right now through your memories.",
  "The cave you fear to enter holds the treasure you seek.",
  "Strength doesn't come from what you can do. It comes from overcoming what you thought you couldn't.",
  "The only impossible journey is the one you never begin.",
  "You can't build a reputation on what you're going to do.",
  "Success is not final, failure is not fatal. It's the courage to continue that counts.",
  "The difference between ordinary and extraordinary is that little 'extra'.",
  "Don't watch the clock; do what it does. Keep going.",
  "You are never too old to set another goal or to dream a new dream.",
  "The only way to do great work is to love what you do.",
  "If you want something you've never had, you must do something you've never done.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",

  // Solo Work & Focus (20 quotes)
  "Solitude is where you find yourself, productivity is where you lose yourself in purpose.",
  "The ability to work alone is the ultimate form of independence.",
  "Deep work is not just a skill, it's a superpower in our distracted world.",
  "Focus is not about saying yes to the thing you've got to focus on. It's about saying no to the hundred other good ideas.",
  "Your mind is for having ideas, not holding them. Write it down and execute.",
  "The quieter you become, the more you can hear your inner genius.",
  "Solitude is the soul's holiday, where no other task is required but to be.",
  "In the depth of silence, you will find the voice of your true potential.",
  "The most productive people are those who can work effectively in isolation.",
  "Alone time is when you recharge your batteries and reconnect with your mission.",
  "Focus is the art of knowing what to ignore.",
  "Single-tasking is the new multitasking.",
  "The phone is the cigarette of the 21st century - it slowly kills your attention.",
  "Deep work is the ability to focus without distraction on cognitively demanding tasks.",
  "Attention is the rarest and purest form of generosity - give it to yourself first.",
  "The cave of solitude becomes the temple of wisdom.",
  "In stillness, the mind finds its greatest power.",
  "Productivity isn't about being busy, it's about being effective.",
  "The art of being alone is the art of being with yourself.",
  "Focus is like a muscle - the more you use it, the stronger it gets.",

  // Productivity & Systems (20 quotes)
  "You don't lack time, you lack priorities.",
  "Systems run the world, not individual efforts.",
  "What gets measured gets managed, what gets managed gets improved.",
  "Productivity is never an accident. It's always the result of planning and focused effort.",
  "The best system is the one you actually use.",
  "Automation is not about replacing humans, it's about freeing humans to do human work.",
  "A goal without a system is just a wish.",
  "Small daily improvements over time lead to stunning results.",
  "The compound effect is the principle of reaping huge rewards from small, smart choices.",
  "Time blocking is not about controlling time, it's about controlling attention.",
  "Energy management is more important than time management.",
  "Your calendar is a reflection of your priorities.",
  "The two-minute rule: if it takes less than two minutes, do it now.",
  "Batch similar tasks together to minimize context switching.",
  "The paradox of choice: fewer options lead to better decisions.",
  "Done is better than perfect.",
  "The 80/20 rule: 80% of results come from 20% of efforts.",
  "Procrastination is the art of keeping up with yesterday instead of getting ahead of tomorrow.",
  "The most important thing is to keep the most important thing the most important thing.",
  "Systems create freedom, not restrictions.",

  // Mental Strength & Philosophy (20 quotes)
  "Your mind is a powerful thing. When you fill it with positive thoughts, your life will start to change.",
  "The only prison you're trapped in is your own mind.",
  "What you think, you become. What you feel, you attract. What you imagine, you create.",
  "Mental toughness is not being unaffected by pressure, it's being less affected than your competition.",
  "The mind is everything. What you think you become.",
  "Strength doesn't come from physical capacity, it comes from indomitable will.",
  "The greatest enemy of progress is your last success.",
  "Your thoughts become your words, your words become your actions, your actions become your destiny.",
  "The obstacle is the way.",
  "You have power over your mind - not outside events. Realize this, and you will find strength.",
  "The only way out is through.",
  "What doesn't kill you makes you stronger, but only if you learn from it.",
  "The mind that opens to a new idea never returns to its original size.",
  "You are not your thoughts, you are the observer of your thoughts.",
  "Mental clarity comes from emotional stability.",
  "The strongest muscle in the human body is the mind.",
  "Your limitation is your imagination.",
  "The quality of your life is determined by the quality of your thoughts.",
  "Mindset is everything. What you think, you attract.",
  "The mind is like a parachute - it only works when it's open.",

  // Self-Improvement & Growth (20 quotes)
  "Be yourself; everyone else is already taken.",
  "The only person you are destined to become is the person you decide to be.",
  "You can't go back and change the beginning, but you can start where you are and change the ending.",
  "Growth begins at the end of your comfort zone.",
  "The greatest investment you can make is in yourself.",
  "You are the author of your own story. Write a good one.",
  "Change is hard at first, messy in the middle, and gorgeous at the end.",
  "The expert in anything was once a beginner.",
  "Progress, not perfection, is the goal.",
  "You don't have to be great to get started, but you have to get started to be great.",
  "Every master was once a disaster.",
  "The person you'll be in five years is based on the books you read and the people you surround yourself with today.",
  "Self-improvement is masturbation. Self-destruction is the answer.",
  "You cannot change your destination overnight, but you can change your direction overnight.",
  "The best project you'll ever work on is you.",
  "Level up or give up - there is no staying the same.",
  "Your current situation is not your final destination.",
  "The comeback is always stronger than the setback.",
  "You are not here merely to make a living. You are here to enrich the world.",
  "The hunter who hesitates becomes the hunted. Take action now.",
];

export const getRandomHardTruth = (): string => {
  const randomIndex = Math.floor(Math.random() * hardTruths.length);
  return hardTruths[randomIndex];
};

export const getDailyHardTruth = (): string => {
  // Use date as seed for consistent daily quote
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % hardTruths.length;
  return hardTruths[index];
};
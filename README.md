# System.AI - Hunter Evolution Platform

<div align="center">
  <img src="./assets/images/icon.png" alt="System.AI Logo" width="120" height="120" />
  
  **Transform your life through systematic evolution across six domains of human potential**
  
  [![Expo](https://img.shields.io/badge/Expo-53.0.0-blue.svg)](https://expo.dev/)
  [![React Native](https://img.shields.io/badge/React%20Native-0.79.1-green.svg)](https://reactnative.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
</div>

## 🎯 Overview

System.AI is a comprehensive personal development platform that gamifies self-improvement through a hunter-themed evolution system. Track your progress across six life domains, complete daily quests, join guilds, and evolve from E-Class to S-Class hunter.

### ✨ Key Features

- **🏆 Six Evolution Domains**: Physical, Mental, Emotional, Social, Financial, and Spiritual
- **⚡ Daily Quest System**: Auto-generated and custom quests with XP rewards
- **🎮 Gamified Progress**: Level up from E-Class to S-Class across all domains
- **👥 Guild System**: Join communities and chat with fellow hunters
- **📝 Shadow Work Journal**: Personal reflection and growth tracking
- **🏅 Achievement System**: Unlock badges and milestones
- **🌙 Adaptive Theming**: System, light, and dark mode support
- **📊 Progress Analytics**: Detailed tracking and visualization

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/system-ai.git
   cd system-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the app**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `w` to open in web browser
   - Press `i` for iOS simulator
   - Press `a` for Android emulator

## 📱 App Structure

### Core Screens

#### 🏠 Dashboard
- Quick stats overview (streak, daily progress, weekly goals)
- Domain progress cards with visual indicators
- Recent activity feed
- Quick action buttons

#### ⚔️ Quests
- Daily auto-generated quests
- Custom quest creation
- Multiple quest types:
  - **Simple**: Basic completion tasks
  - **Timer**: Time-based challenges
  - **Photo**: Visual documentation quests
  - **Checklist**: Multi-step objectives
- Smart filtering and search
- Real-time progress tracking

#### 👥 Guild System
- Join hunter communities
- Real-time chat functionality
- Guild leaderboards
- Collaborative challenges
- Discovery system for finding new guilds

#### 📈 Evolution Tracking
- Detailed domain analytics
- Progress visualization
- Achievement gallery
- Rank progression system
- Historical data and trends

#### 👤 Profile Management
- Comprehensive profile editing
- Avatar customization
- Personal statistics
- Settings and preferences
- Account management

#### 📝 Shadow Work Journal
- Personal reflection entries
- Mood tracking
- Search and organization
- Growth insights
- Privacy-focused design

## 🎮 Gamification System

### Hunter Ranks
- **E-Class**: Beginner (0-999 XP)
- **D-Class**: Novice (1,000-2,499 XP)
- **C-Class**: Intermediate (2,500-4,999 XP)
- **B-Class**: Advanced (5,000-9,999 XP)
- **A-Class**: Expert (10,000-19,999 XP)
- **S-Class**: Master (20,000+ XP)

### XP Calculation
```typescript
baseXP = difficulty × timeMultiplier × typeMultiplier + subtaskBonus
```

### Achievement Categories
- **Progress Milestones**: First quest, streak achievements
- **Domain Mastery**: Rank progression in specific domains
- **Social Engagement**: Guild participation, community involvement
- **Creation**: Custom quest creation, journal entries
- **Special Events**: Seasonal challenges, limited-time achievements

## 🛠️ Technical Architecture

### Tech Stack
- **Framework**: Expo 53.0.0 with React Native 0.79.1
- **Navigation**: Expo Router 5.0.2
- **Language**: TypeScript 5.8.3
- **Icons**: Lucide React Native
- **Graphics**: React Native SVG
- **Storage**: AsyncStorage for local persistence
- **Animations**: React Native Reanimated

### Project Structure
```
system-ai/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   ├── auth.tsx           # Authentication flow
│   ├── assessment.tsx     # Initial domain assessment
│   ├── quest/             # Quest management screens
│   ├── profile/           # Profile management
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
├── contexts/              # React contexts (Theme, etc.)
├── data/                  # Mock data and utilities
├── hooks/                 # Custom React hooks
└── assets/                # Static assets
```

### Key Components

#### ProgressRing
Circular progress indicator with customizable colors and animations.

#### DomainCard
Interactive cards displaying domain progress and statistics.

#### ThemeProvider
Context provider for system/light/dark theme management.

## 🎨 Design System

### Color Palette
- **Primary**: #4DABF7 (Blue)
- **Success**: #51CF66 (Green)
- **Warning**: #FFB366 (Orange)
- **Error**: #FF6B6B (Red)
- **Purple**: #9775FA
- **Yellow**: #FFC107

### Domain Colors
- **Physical**: #FF6B6B (Red)
- **Mental**: #4DABF7 (Blue)
- **Emotional**: #51CF66 (Green)
- **Social**: #FFB366 (Orange)
- **Financial**: #9775FA (Purple)
- **Spiritual**: #FFC107 (Yellow)

### Typography
- **Headers**: 700 weight, system font
- **Body**: 400-500 weight, system font
- **Captions**: 400 weight, smaller size

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=https://api.system-ai.com
EXPO_PUBLIC_ANALYTICS_KEY=your_analytics_key
```

### Theme Configuration
The app supports three theme modes:
- **System**: Follows device theme
- **Light**: Always light mode
- **Dark**: Always dark mode (default)

## 📊 Data Management

### Local Storage
- User preferences and settings
- Quest progress and completion
- Journal entries
- Achievement unlocks
- Guild chat history

### Data Persistence
All user data is stored locally using AsyncStorage with automatic backup and restore functionality.

## 🚀 Deployment

### Web Deployment
```bash
npm run build:web
```

### Mobile App Store
1. Configure app.json for production
2. Build with EAS Build
3. Submit to App Store/Play Store

### Environment Setup
- **Development**: Local Expo development server
- **Staging**: EAS Preview builds
- **Production**: App Store distribution

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Use TypeScript for all new code
- Follow React Native best practices
- Use ESLint and Prettier for formatting
- Write descriptive commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team**: For the amazing development platform
- **React Native Community**: For continuous innovation
- **Lucide Icons**: For beautiful, consistent iconography
- **Hunter x Hunter**: For inspiration on the ranking system

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/system-ai/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/system-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/system-ai/discussions)
- **Email**: support@system-ai.com

## 🗺️ Roadmap

### Version 2.0
- [ ] Cloud synchronization
- [ ] Social features expansion
- [ ] AI-powered quest recommendations
- [ ] Advanced analytics dashboard
- [ ] Team challenges
- [ ] Mentor system

### Version 2.1
- [ ] Wearable device integration
- [ ] Voice commands
- [ ] AR quest experiences
- [ ] Habit tracking integration
- [ ] Calendar synchronization

---

<div align="center">
  <strong>Transform your potential. Evolve your reality.</strong>
  
  Made with ❤️ by the System.AI Team
</div>
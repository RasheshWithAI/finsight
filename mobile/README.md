# FinSight Mobile App

A React Native mobile application for financial tracking and investment management, built with Expo.

## Features

- **Dashboard**: Overview of financial health with income, expenses, and savings tracking
- **Market**: Real-time stock market data, watchlists, and market indices
- **Finance**: Transaction tracking, budgeting, and expense categorization
- **Insights**: AI-powered financial recommendations and market analysis
- **Profile**: User settings, subscription management, and app preferences

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for navigation
- **Supabase** for backend services
- **Expo Linear Gradient** for beautiful UI gradients
- **React Native Vector Icons** for consistent iconography

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on your preferred platform:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

### Building for Production

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Configure EAS:
   ```bash
   eas build:configure
   ```

3. Build for Android:
   ```bash
   npm run build:android
   ```

4. Build for iOS:
   ```bash
   npm run build:ios
   ```

## Project Structure

```
mobile/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts (Auth, etc.)
│   ├── navigation/         # Navigation configuration
│   ├── screens/           # App screens/pages
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript type definitions
├── assets/                # Images, fonts, and other assets
├── app.json              # Expo configuration
└── package.json          # Dependencies and scripts
```

## Key Features

### Authentication
- Email/password authentication via Supabase
- Secure token storage with AsyncStorage
- Automatic session management

### Financial Tracking
- Income and expense tracking
- Budget management
- Category-based organization
- Visual spending insights

### Market Data
- Real-time stock prices (converted to INR)
- Market indices tracking
- Stock watchlists
- Stock comparison tools

### AI Insights
- Personalized financial recommendations
- Spending pattern analysis
- Investment suggestions
- Market trend insights

## Environment Setup

The app connects to the same Supabase backend as the web version, ensuring data synchronization across platforms.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on both iOS and Android
5. Submit a pull request

## License

This project is licensed under the MIT License.
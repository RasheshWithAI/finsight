import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import StockDetailScreen from './src/screens/StockDetailScreen';
import StockCompareScreen from './src/screens/StockCompareScreen';
import { useAuth } from './src/contexts/AuthContext';
import LoadingScreen from './src/screens/LoadingScreen';

const Stack = createStackNavigator();
const queryClient = new QueryClient();

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#121217' }
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen 
              name="StockDetail" 
              component={StockDetailScreen}
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: '#121217' },
                headerTintColor: '#FFFFFF',
                headerTitle: ''
              }}
            />
            <Stack.Screen 
              name="StockCompare" 
              component={StockCompareScreen}
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: '#121217' },
                headerTintColor: '#FFFFFF',
                headerTitle: 'Compare Stocks'
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar style="light" backgroundColor="#121217" />
        <AppNavigator />
      </AuthProvider>
    </QueryClientProvider>
  );
}
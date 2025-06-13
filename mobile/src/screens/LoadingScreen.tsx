import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoadingScreen() {
  return (
    <LinearGradient
      colors={['#1E1E2F', '#3A3A5B']}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder} />
        <Text style={styles.title}>FinSight</Text>
        <ActivityIndicator size="large" color="#8A2BE2" style={styles.loader} />
        <Text style={styles.subtitle}>Loading...</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#8A2BE2',
    borderRadius: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  loader: {
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0B8',
  },
});
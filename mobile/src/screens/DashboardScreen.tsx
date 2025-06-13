import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { user } = useAuth();
  const [financialSummary, setFinancialSummary] = useState({
    income: 75000,
    expenses: 45000,
    savings: 30000,
    savingsRate: 20.5,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome, {user?.email?.split('@')[0] || 'Investor'}
        </Text>
        <Text style={styles.dateText}>Your financial overview for April 2025</Text>
      </View>

      {/* Premium Banner */}
      <LinearGradient
        colors={['#3F51B5', '#5B4EBD']}
        style={styles.premiumBanner}
      >
        <View style={styles.premiumContent}>
          <Ionicons name="sparkles" size={20} color="#FFD700" />
          <Text style={styles.premiumText}>Unlock Premium Financial Insights</Text>
        </View>
        <TouchableOpacity style={styles.premiumButton}>
          <Text style={styles.premiumButtonText}>Learn More</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Financial Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, { backgroundColor: '#FFC107' }]}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Income</Text>
              <Ionicons name="trending-up" size={16} color="#000" />
            </View>
            <Text style={styles.summaryValue}>{formatCurrency(financialSummary.income)}</Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: '#F44336' }]}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Ionicons name="trending-down" size={16} color="#FFF" />
            </View>
            <Text style={styles.summaryValue}>{formatCurrency(financialSummary.expenses)}</Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: '#4CAF50' }]}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Savings</Text>
              <Ionicons name="wallet" size={16} color="#FFF" />
            </View>
            <Text style={styles.summaryValue}>{formatCurrency(financialSummary.savings)}</Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: '#2196F3' }]}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Savings Rate</Text>
              <Ionicons name="pie-chart" size={16} color="#FFF" />
            </View>
            <Text style={styles.summaryValue}>{formatPercentage(financialSummary.savingsRate)}</Text>
          </View>
        </View>
      </View>

      {/* Market Summary */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Market Summary</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.marketCard}>
            <Text style={styles.marketName}>Dow Jones</Text>
            <Text style={styles.marketValue}>₹32,45,678</Text>
            <View style={styles.marketChange}>
              <Ionicons name="arrow-up" size={12} color="#4CAF50" />
              <Text style={styles.marketChangeText}>+0.46%</Text>
            </View>
          </View>
          <View style={styles.marketCard}>
            <Text style={styles.marketName}>S&P 500</Text>
            <Text style={styles.marketValue}>₹4,28,567</Text>
            <View style={styles.marketChange}>
              <Ionicons name="arrow-up" size={12} color="#4CAF50" />
              <Text style={styles.marketChangeText}>+0.68%</Text>
            </View>
          </View>
          <View style={styles.marketCard}>
            <Text style={styles.marketName}>NASDAQ</Text>
            <Text style={styles.marketValue}>₹13,56,789</Text>
            <View style={styles.marketChange}>
              <Ionicons name="arrow-up" size={12} color="#4CAF50" />
              <Text style={styles.marketChangeText}>+0.62%</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Watchlist */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Watchlist</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>Manage</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.watchlistCard}>
          <View style={styles.watchlistItem}>
            <View>
              <Text style={styles.stockSymbol}>AAPL</Text>
              <Text style={styles.stockName}>Apple Inc.</Text>
            </View>
            <View style={styles.stockPriceContainer}>
              <Text style={styles.stockPrice}>₹14,067</Text>
              <View style={styles.stockChange}>
                <Ionicons name="arrow-up" size={10} color="#4CAF50" />
                <Text style={styles.stockChangeText}>+3.33%</Text>
              </View>
            </View>
          </View>
          <View style={styles.watchlistItem}>
            <View>
              <Text style={styles.stockSymbol}>MSFT</Text>
              <Text style={styles.stockName}>Microsoft Corp.</Text>
            </View>
            <View style={styles.stockPriceContainer}>
              <Text style={styles.stockPrice}>₹33,629</Text>
              <View style={styles.stockChange}>
                <Ionicons name="arrow-up" size={10} color="#4CAF50" />
                <Text style={styles.stockChangeText}>+3.30%</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* AI Insights */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>All Insights</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View style={styles.insightIcon}>
              <Ionicons name="bulb" size={20} color="#FFC107" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Reduce Food Expenses</Text>
              <Text style={styles.insightDescription}>
                Your food spending is trending 15% higher than last month. Consider meal planning to reduce costs.
              </Text>
              <Text style={styles.insightSavings}>Potential savings: ₹7,515/month</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121217',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#A0A0B8',
  },
  premiumBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  premiumText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 8,
    fontSize: 14,
  },
  premiumButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  premiumButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  viewAllText: {
    fontSize: 14,
    color: '#8A2BE2',
    fontWeight: '500',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  summaryCard: {
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  marketCard: {
    backgroundColor: '#1E1E24',
    padding: 16,
    borderRadius: 12,
    marginLeft: 20,
    marginRight: 8,
    minWidth: 140,
  },
  marketName: {
    fontSize: 12,
    color: '#A0A0B8',
    marginBottom: 4,
  },
  marketValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  marketChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marketChangeText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  watchlistCard: {
    backgroundColor: '#1E1E24',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
  },
  watchlistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C3036',
  },
  stockSymbol: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stockName: {
    fontSize: 12,
    color: '#A0A0B8',
  },
  stockPriceContainer: {
    alignItems: 'flex-end',
  },
  stockPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stockChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  stockChangeText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  insightCard: {
    backgroundColor: '#1E1E24',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIcon: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: '#A0A0B8',
    lineHeight: 20,
    marginBottom: 8,
  },
  insightSavings: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
});
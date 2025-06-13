import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function StockDetailScreen() {
  const route = useRoute();
  const { symbol = 'AAPL' } = route.params as any || {};
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  // Mock stock data
  const stockData = {
    symbol: symbol,
    name: 'Apple Inc.',
    price: 14067.25,
    change: 468.75,
    changePercent: 3.33,
    marketCap: 2156789000000,
    volume: 47892100,
    pe: 26.5,
    dividend: 0.92,
    high52: 15234.67,
    low52: 12001.23,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) {
      return `₹${(value / 1e12).toFixed(2)} T`;
    } else if (value >= 1e9) {
      return `₹${(value / 1e9).toFixed(2)} B`;
    } else if (value >= 1e7) {
      return `₹${(value / 1e7).toFixed(2)} Cr`;
    } else if (value >= 1e5) {
      return `₹${(value / 1e5).toFixed(2)} L`;
    }
    return `₹${value.toFixed(2)}`;
  };

  const isPositive = stockData.change >= 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Stock Header */}
      <View style={styles.header}>
        <View style={styles.stockInfo}>
          <Text style={styles.stockName}>{stockData.name}</Text>
          <Text style={styles.stockSymbol}>{stockData.symbol}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsWatchlisted(!isWatchlisted)}
          >
            <Ionicons
              name={isWatchlisted ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isWatchlisted ? '#8A2BE2' : '#A0A0B8'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={24} color="#A0A0B8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Price Section */}
      <View style={styles.priceSection}>
        <Text style={styles.currentPrice}>{formatCurrency(stockData.price)}</Text>
        <View style={[styles.priceChange, { backgroundColor: isPositive ? '#4CAF50' : '#F44336' }]}>
          <Ionicons
            name={isPositive ? 'arrow-up' : 'arrow-down'}
            size={16}
            color="#FFFFFF"
          />
          <Text style={styles.priceChangeText}>
            {isPositive ? '+' : ''}{formatCurrency(stockData.change)} ({stockData.changePercent.toFixed(2)}%)
          </Text>
        </View>
        <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleString()}</Text>
      </View>

      {/* Chart Placeholder */}
      <View style={styles.chartContainer}>
        <View style={styles.chartPlaceholder}>
          <Ionicons name="analytics" size={48} color="#A0A0B8" />
          <Text style={styles.chartPlaceholderText}>Stock Chart</Text>
          <Text style={styles.chartSubtext}>Interactive chart coming soon</Text>
        </View>
      </View>

      {/* Time Period Buttons */}
      <View style={styles.timePeriodContainer}>
        {['1D', '1W', '1M', '6M', '1Y'].map((period) => (
          <TouchableOpacity key={period} style={styles.timePeriodButton}>
            <Text style={styles.timePeriodText}>{period}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Key Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Statistics</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Market Cap</Text>
            <Text style={styles.statValue}>{formatLargeNumber(stockData.marketCap)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>P/E Ratio</Text>
            <Text style={styles.statValue}>{stockData.pe.toFixed(2)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Dividend Yield</Text>
            <Text style={styles.statValue}>{stockData.dividend}%</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Volume</Text>
            <Text style={styles.statValue}>{formatLargeNumber(stockData.volume)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>52 Week High</Text>
            <Text style={styles.statValue}>{formatCurrency(stockData.high52)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>52 Week Low</Text>
            <Text style={styles.statValue}>{formatCurrency(stockData.low52)}</Text>
          </View>
        </View>
      </View>

      {/* Company Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Company Overview</Text>
        <View style={styles.overviewContainer}>
          <Text style={styles.overviewText}>
            Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, 
            wearables, and accessories worldwide. The company offers iPhone, Mac, iPad, and wearables, 
            home, and accessories.
          </Text>
          <View style={styles.companyDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Sector</Text>
              <Text style={styles.detailValue}>Technology</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Industry</Text>
              <Text style={styles.detailValue}>Consumer Electronics</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.primaryActionButton}>
          <Text style={styles.primaryActionButtonText}>Compare Stocks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryActionButton}>
          <Text style={styles.secondaryActionButtonText}>View News</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121217',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  stockInfo: {
    flex: 1,
  },
  stockName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  stockSymbol: {
    fontSize: 16,
    color: '#A0A0B8',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  priceSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  currentPrice: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  priceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  priceChangeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#A0A0B8',
  },
  chartContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#1E1E24',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A0A0B8',
    marginTop: 8,
  },
  chartSubtext: {
    fontSize: 12,
    color: '#75788A',
    marginTop: 4,
  },
  timePeriodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  timePeriodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1E1E24',
    borderRadius: 8,
  },
  timePeriodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A0A0B8',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  statsContainer: {
    backgroundColor: '#1E1E24',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2C3036',
  },
  statLabel: {
    fontSize: 14,
    color: '#A0A0B8',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  overviewContainer: {
    backgroundColor: '#1E1E24',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
  },
  overviewText: {
    fontSize: 14,
    color: '#A0A0B8',
    lineHeight: 20,
    marginBottom: 16,
  },
  companyDetails: {
    borderTopWidth: 1,
    borderTopColor: '#2C3036',
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#A0A0B8',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  primaryActionButton: {
    flex: 1,
    backgroundColor: '#8A2BE2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  primaryActionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryActionButton: {
    flex: 1,
    backgroundColor: '#1E1E24',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  secondaryActionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A0A0B8',
  },
  bottomSpacing: {
    height: 40,
  },
});
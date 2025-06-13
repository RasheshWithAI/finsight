import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockStocks = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc.', price: 14067, change: 3.33, isPositive: true },
  { id: '2', symbol: 'MSFT', name: 'Microsoft Corp.', price: 33629, change: 3.30, isPositive: true },
  { id: '3', symbol: 'GOOGL', name: 'Alphabet Inc.', price: 15456, change: -1.25, isPositive: false },
  { id: '4', symbol: 'AMZN', name: 'Amazon.com Inc.', price: 15456, change: 2.69, isPositive: true },
  { id: '5', symbol: 'TSLA', name: 'Tesla Inc.', price: 12267, change: -5.74, isPositive: false },
];

export default function MarketScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderStockItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.stockItem}>
      <View style={styles.stockInfo}>
        <Text style={styles.stockSymbol}>{item.symbol}</Text>
        <Text style={styles.stockName}>{item.name}</Text>
      </View>
      <View style={styles.stockPriceContainer}>
        <Text style={styles.stockPrice}>{formatCurrency(item.price)}</Text>
        <View style={[styles.stockChange, { backgroundColor: item.isPositive ? '#4CAF50' : '#F44336' }]}>
          <Ionicons 
            name={item.isPositive ? 'arrow-up' : 'arrow-down'} 
            size={10} 
            color="#FFF" 
          />
          <Text style={styles.stockChangeText}>
            {item.isPositive ? '+' : ''}{item.change.toFixed(2)}%
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.watchlistButton}>
        <Ionicons name="bookmark-outline" size={20} color="#8A2BE2" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#75788A" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stocks..."
            placeholderTextColor="#75788A"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="#8A2BE2" />
        </TouchableOpacity>
      </View>

      {/* Market Indices */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Market Indices</Text>
          <TouchableOpacity>
            <Ionicons name="refresh" size={20} color="#8A2BE2" />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.indexCard}>
            <Text style={styles.indexName}>Dow Jones</Text>
            <Text style={styles.indexValue}>₹32,45,678</Text>
            <View style={styles.indexChange}>
              <Ionicons name="arrow-up" size={12} color="#4CAF50" />
              <Text style={styles.indexChangeText}>+0.46%</Text>
            </View>
          </View>
          <View style={styles.indexCard}>
            <Text style={styles.indexName}>S&P 500</Text>
            <Text style={styles.indexValue}>₹4,28,567</Text>
            <View style={styles.indexChange}>
              <Ionicons name="arrow-up" size={12} color="#4CAF50" />
              <Text style={styles.indexChangeText}>+0.68%</Text>
            </View>
          </View>
          <View style={styles.indexCard}>
            <Text style={styles.indexName}>NASDAQ</Text>
            <Text style={styles.indexValue}>₹13,56,789</Text>
            <View style={styles.indexChange}>
              <Ionicons name="arrow-up" size={12} color="#4CAF50" />
              <Text style={styles.indexChangeText}>+0.62%</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All Stocks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'watchlist' && styles.activeTab]}
          onPress={() => setActiveTab('watchlist')}
        >
          <Text style={[styles.tabText, activeTab === 'watchlist' && styles.activeTabText]}>
            Watchlist
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sectors' && styles.activeTab]}
          onPress={() => setActiveTab('sectors')}
        >
          <Text style={[styles.tabText, activeTab === 'sectors' && styles.activeTabText]}>
            Sectors
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stock List */}
      <FlatList
        data={mockStocks}
        renderItem={renderStockItem}
        keyExtractor={(item) => item.id}
        style={styles.stockList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121217',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E24',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  filterButton: {
    marginLeft: 12,
    padding: 12,
    backgroundColor: '#1E1E24',
    borderRadius: 12,
  },
  section: {
    marginBottom: 20,
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
  indexCard: {
    backgroundColor: '#1E1E24',
    padding: 16,
    borderRadius: 12,
    marginLeft: 20,
    marginRight: 8,
    minWidth: 140,
  },
  indexName: {
    fontSize: 12,
    color: '#A0A0B8',
    marginBottom: 4,
  },
  indexValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  indexChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indexChangeText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#1E1E24',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#8A2BE2',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A0A0B8',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  stockList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E24',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  stockInfo: {
    flex: 1,
  },
  stockSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  stockName: {
    fontSize: 12,
    color: '#A0A0B8',
  },
  stockPriceContainer: {
    alignItems: 'flex-end',
    marginRight: 16,
  },
  stockPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  stockChange: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockChangeText: {
    fontSize: 10,
    color: '#FFFFFF',
    marginLeft: 2,
    fontWeight: '600',
  },
  watchlistButton: {
    padding: 8,
  },
});
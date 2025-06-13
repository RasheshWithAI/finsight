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
  { symbol: 'AAPL', name: 'Apple Inc.', price: 14067, marketCap: 2156789000000 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 33629, marketCap: 2589432000000 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 15456, marketCap: 1678234000000 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 15456, marketCap: 1567890000000 },
];

export default function StockCompareScreen() {
  const [selectedStocks, setSelectedStocks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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
    }
    return `₹${value.toFixed(2)}`;
  };

  const addStock = (stock: any) => {
    if (selectedStocks.length >= 3) {
      return;
    }
    if (!selectedStocks.find(s => s.symbol === stock.symbol)) {
      setSelectedStocks([...selectedStocks, stock]);
    }
  };

  const removeStock = (symbol: string) => {
    setSelectedStocks(selectedStocks.filter(s => s.symbol !== symbol));
  };

  const filteredStocks = mockStocks.filter(stock =>
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Selected Stocks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selected Stocks ({selectedStocks.length}/3)</Text>
        {selectedStocks.length === 0 ? (
          <Text style={styles.emptyText}>Add stocks to compare using the search below</Text>
        ) : (
          <View style={styles.selectedStocksContainer}>
            {selectedStocks.map((stock) => (
              <View key={stock.symbol} style={styles.selectedStock}>
                <Text style={styles.selectedStockSymbol}>{stock.symbol}</Text>
                <TouchableOpacity
                  onPress={() => removeStock(stock.symbol)}
                  style={styles.removeButton}
                >
                  <Ionicons name="close" size={16} color="#F44336" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Search */}
      {selectedStocks.length < 3 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Stocks</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#75788A" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for stocks to compare..."
              placeholderTextColor="#75788A"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          {searchQuery && (
            <View style={styles.searchResults}>
              {filteredStocks.map((stock) => (
                <TouchableOpacity
                  key={stock.symbol}
                  style={styles.searchResultItem}
                  onPress={() => addStock(stock)}
                  disabled={selectedStocks.find(s => s.symbol === stock.symbol)}
                >
                  <View style={styles.stockInfo}>
                    <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                    <Text style={styles.stockName}>{stock.name}</Text>
                  </View>
                  <Ionicons name="add-circle" size={24} color="#8A2BE2" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Chart Placeholder */}
      {selectedStocks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Comparison</Text>
          <View style={styles.chartPlaceholder}>
            <Ionicons name="analytics" size={48} color="#A0A0B8" />
            <Text style={styles.chartPlaceholderText}>Comparison Chart</Text>
            <Text style={styles.chartSubtext}>Interactive comparison chart coming soon</Text>
          </View>
        </View>
      )}

      {/* Comparison Table */}
      {selectedStocks.length > 1 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics Comparison</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.comparisonTable}>
              {/* Header */}
              <View style={styles.tableRow}>
                <View style={styles.metricCell}>
                  <Text style={styles.tableHeader}>Metric</Text>
                </View>
                {selectedStocks.map((stock) => (
                  <View key={stock.symbol} style={styles.stockCell}>
                    <Text style={styles.tableHeader}>{stock.symbol}</Text>
                  </View>
                ))}
              </View>

              {/* Price Row */}
              <View style={styles.tableRow}>
                <View style={styles.metricCell}>
                  <Text style={styles.metricLabel}>Price</Text>
                </View>
                {selectedStocks.map((stock) => (
                  <View key={stock.symbol} style={styles.stockCell}>
                    <Text style={styles.metricValue}>{formatCurrency(stock.price)}</Text>
                  </View>
                ))}
              </View>

              {/* Market Cap Row */}
              <View style={styles.tableRow}>
                <View style={styles.metricCell}>
                  <Text style={styles.metricLabel}>Market Cap</Text>
                </View>
                {selectedStocks.map((stock) => (
                  <View key={stock.symbol} style={styles.stockCell}>
                    <Text style={styles.metricValue}>{formatLargeNumber(stock.marketCap)}</Text>
                  </View>
                ))}
              </View>

              {/* P/E Ratio Row */}
              <View style={styles.tableRow}>
                <View style={styles.metricCell}>
                  <Text style={styles.metricLabel}>P/E Ratio</Text>
                </View>
                {selectedStocks.map((stock) => (
                  <View key={stock.symbol} style={styles.stockCell}>
                    <Text style={styles.metricValue}>26.5</Text>
                  </View>
                ))}
              </View>

              {/* Dividend Yield Row */}
              <View style={styles.tableRow}>
                <View style={styles.metricCell}>
                  <Text style={styles.metricLabel}>Dividend Yield</Text>
                </View>
                {selectedStocks.map((stock) => (
                  <View key={stock.symbol} style={styles.stockCell}>
                    <Text style={styles.metricValue}>0.92%</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      )}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121217',
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
  emptyText: {
    fontSize: 14,
    color: '#A0A0B8',
    paddingHorizontal: 20,
    textAlign: 'center',
    paddingVertical: 20,
  },
  selectedStocksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  selectedStock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E24',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedStockSymbol: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  removeButton: {
    padding: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E24',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  searchResults: {
    backgroundColor: '#1E1E24',
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C3036',
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
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#1E1E24',
    marginHorizontal: 20,
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
  comparisonTable: {
    backgroundColor: '#1E1E24',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#2C3036',
  },
  metricCell: {
    width: 120,
    padding: 16,
    justifyContent: 'center',
  },
  stockCell: {
    width: 100,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A2BE2',
  },
  metricLabel: {
    fontSize: 14,
    color: '#A0A0B8',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 40,
  },
});
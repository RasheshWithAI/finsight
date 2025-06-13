import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const insights = [
  {
    id: '1',
    type: 'cost-saving',
    title: 'Reduce Food Expenses',
    description: 'Your food spending is trending 15% higher than last month. Consider meal planning to reduce costs.',
    savings: '₹7,515/month',
    icon: 'restaurant',
    color: '#FF9800',
  },
  {
    id: '2',
    type: 'investment',
    title: 'Investment Opportunity',
    description: 'Based on your current savings, you could invest ₹41,750 in index funds this month without impacting your emergency fund.',
    return: '₹1,670 (8%) in 1 year',
    icon: 'trending-up',
    color: '#4CAF50',
  },
  {
    id: '3',
    type: 'market',
    title: 'Technology Sector Trending Up',
    description: 'The technology sector has risen 3.2% this week. Your watchlist stocks in this sector are performing well.',
    icon: 'analytics',
    color: '#2196F3',
  },
  {
    id: '4',
    type: 'health',
    title: 'Financial Health Score: B+',
    description: 'Your savings rate has improved to 28% this month, but your emergency fund could use some attention.',
    icon: 'fitness',
    color: '#9C27B0',
  },
];

export default function InsightsScreen() {
  const renderInsightCard = (insight: any) => (
    <View key={insight.id} style={styles.insightCard}>
      <View style={styles.insightHeader}>
        <View style={[styles.insightIcon, { backgroundColor: `${insight.color}20` }]}>
          <Ionicons name={insight.icon as any} size={24} color={insight.color} />
        </View>
        <View style={styles.insightContent}>
          <View style={styles.insightTitleRow}>
            <Text style={styles.insightType}>{insight.type.toUpperCase()}</Text>
            <Text style={styles.insightDate}>Jan 15, 2025</Text>
          </View>
          <Text style={styles.insightTitle}>{insight.title}</Text>
          <Text style={styles.insightDescription}>{insight.description}</Text>
          
          {insight.savings && (
            <View style={styles.metricContainer}>
              <Ionicons name="cash" size={16} color="#4CAF50" />
              <Text style={styles.metricText}>Potential savings: {insight.savings}</Text>
            </View>
          )}
          
          {insight.return && (
            <View style={styles.metricContainer}>
              <Ionicons name="trending-up" size={16} color="#2196F3" />
              <Text style={styles.metricText}>Potential return: {insight.return}</Text>
            </View>
          )}
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>View Details</Text>
              <Ionicons name="chevron-forward" size={16} color="#8A2BE2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.dismissButton}>
              <Text style={styles.dismissButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Insights</Text>
          <Text style={styles.headerSubtitle}>AI-powered financial tips and suggestions</Text>
        </View>

        {/* Insights Feed */}
        <View style={styles.insightsContainer}>
          <Text style={styles.sectionTitle}>Your Financial Insights</Text>
          {insights.map(renderInsightCard)}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <View style={styles.disclaimerIcon}>
            <Ionicons name="alert-circle" size={20} color="#FF9800" />
          </View>
          <View style={styles.disclaimerContent}>
            <Text style={styles.disclaimerTitle}>Important Disclaimer</Text>
            <Text style={styles.disclaimerText}>
              The insights provided are based on your data and market analysis but are not professional financial advice. 
              Always do your own research or consult a certified financial advisor before making investment decisions.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#A0A0B8',
    marginTop: 2,
  },
  insightsContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  insightCard: {
    backgroundColor: '#1E1E24',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIcon: {
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightType: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8A2BE2',
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  insightDate: {
    fontSize: 12,
    color: '#A0A0B8',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 14,
    color: '#A0A0B8',
    lineHeight: 20,
    marginBottom: 12,
  },
  metricContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8A2BE2',
    marginRight: 4,
  },
  dismissButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dismissButtonText: {
    fontSize: 12,
    color: '#A0A0B8',
  },
  disclaimer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.3)',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    alignItems: 'flex-start',
  },
  disclaimerIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  disclaimerContent: {
    flex: 1,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800',
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#FFB74D',
    lineHeight: 16,
  },
});
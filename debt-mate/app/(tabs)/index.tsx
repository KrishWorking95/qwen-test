import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { Header } from '@/components/Header';
import { StatCard } from '@/components/StatCard';
import { RecordItem } from '@/components/RecordItem';
import { AdBanner } from '@/components/AdBanner';
import { EmptyState } from '@/components/EmptyState';
import { Colors, Spacing } from '@/constants/Colors';
import { useApp } from '@/hooks/useApp';
import { useData } from '@/hooks/useData';
import { Record as RecordType } from '@/types';

export default function OverviewScreen() {
  const { theme, currency, toggleTheme } = useApp();
  const colors = Colors[theme];
  const { records, getTotalLent, getPendingAmount, getUniqueContactsCount, refreshData } = useData();
  const [recentRecords, setRecentRecords] = useState<RecordType[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      refreshData();
    }, [])
  );

  useEffect(() => {
    setRecentRecords(records.slice(0, 5));
  }, [records]);

  const totalLent = getTotalLent();
  const pending = getPendingAmount();
  const contactsCount = getUniqueContactsCount();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Header title="Debt Mate" subtitle="Overview" />
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.themeToggle, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <FontAwesome name={theme === 'light' ? 'moon-o' : 'sun-o'} size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Total Lent"
            value={`${currency}${totalLent.toLocaleString()}`}
            icon="💰"
            color={colors.primaryLight}
          />
          <StatCard
            title="Pending"
            value={`${currency}${pending.toLocaleString()}`}
            icon="⏳"
            color={colors.warning + '30'}
          />
          <StatCard
            title="Contacts"
            value={contactsCount.toString()}
            icon="👥"
            color={colors.success + '30'}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="clock-o" size={18} color={colors.primary} />
            <Link href="/records" style={[styles.seeAll, { color: colors.primary }]}>
              See All
            </Link>
          </View>

          {recentRecords.length === 0 ? (
            <EmptyState title="No records yet" subtitle="Start by adding your first lent amount" />
          ) : (
            recentRecords.map((record) => (
              <RecordItem key={record.id} record={record} />
            ))
          )}
        </View>

        {/* Ad Banner */}
        <View style={styles.adContainer}>
          <AdBanner />
        </View>
      </ScrollView>

      {/* FAB */}
      <Link href="/add-record" asChild>
        <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]}>
          <FontAwesome name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 'auto',
  },
  adContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: 100,
  },
  fab: {
    position: 'absolute',
    right: Spacing.md,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, router } from 'expo-router';
import { Header } from '@/components/Header';
import { RecordItem } from '@/components/RecordItem';
import { AdBanner } from '@/components/AdBanner';
import { EmptyState } from '@/components/EmptyState';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { useApp } from '@/hooks/useApp';
import { useData } from '@/hooks/useData';
import { Record as RecordType } from '@/types';

type FilterType = 'all' | 'pending' | 'paid';

export default function RecordsScreen() {
  const { theme, currency } = useApp();
  const colors = Colors[theme];
  const { records, refreshData } = useData();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecords, setFilteredRecords] = useState<RecordType[]>([]);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    let result = [...records];

    // Apply filter
    if (filter === 'pending') {
      result = result.filter(r => r.status === 'pending');
    } else if (filter === 'paid') {
      result = result.filter(r => r.status === 'paid');
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        r =>
          r.contactName.toLowerCase().includes(query) ||
          r.reason.toLowerCase().includes(query)
      );
    }

    setFilteredRecords(result);
  }, [records, filter, searchQuery]);

  const renderRecord = ({ item }: { item: RecordType }) => (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: '/record/[id]',
          params: { id: item.id },
        });
      }}
    >
      <RecordItem record={item} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Header title="Records" subtitle="All lent amounts" />
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <FontAwesome name="search" size={18} color={colors.textSecondary} />
        <Text
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search by name or reason..."
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['all', 'pending', 'paid'] as FilterType[]).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[
              styles.filterTab,
              {
                backgroundColor: filter === f ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === f ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <EmptyState
          title="No records found"
          subtitle={searchQuery ? 'Try a different search term' : 'Add your first record'}
        />
      ) : (
        <FlatList
          data={filteredRecords}
          renderItem={renderRecord}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Ad Banner */}
      <View style={styles.adContainer}>
        <AdBanner />
      </View>

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
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: Spacing.sm,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 100,
  },
  adContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.md,
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

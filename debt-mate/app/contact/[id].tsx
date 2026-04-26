import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { RecordItem } from '@/components/RecordItem';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { useApp } from '@/hooks/useApp';
import { useData } from '@/hooks/useData';
import { Contact, Record as RecordType } from '@/types';

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, currency } = useApp();
  const colors = Colors[theme];
  const { contacts, records, refreshData } = useData();
  const [contact, setContact] = useState<Contact | null>(null);
  const [contactRecords, setContactRecords] = useState<RecordType[]>([]);
  const [stats, setStats] = useState({ totalLent: 0, paidBack: 0, outstanding: 0 });

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (id && contacts.length > 0) {
      const found = contacts.find(c => c.id === id);
      setContact(found || null);
    }
  }, [id, contacts]);

  useEffect(() => {
    if (contact && records.length > 0) {
      const contactRecs = records.filter(r => r.contactId === contact.id);
      setContactRecords(contactRecs);
      
      const totalLent = contactRecs.reduce((sum, r) => sum + r.amount, 0);
      const paidBack = contactRecs.reduce((sum, r) => sum + r.paidBack, 0);
      const outstanding = totalLent - paidBack;
      
      setStats({ totalLent, paidBack, outstanding });
    }
  }, [contact, records]);

  if (!contact) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Contact Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Contact Info */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{contact.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={[styles.contactName, { color: colors.textPrimary }]}>{contact.name}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Lent</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {currency}{stats.totalLent.toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Paid Back</Text>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {currency}{stats.paidBack.toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Outstanding</Text>
            <Text style={[styles.statValue, { color: colors.danger }]}>
              {currency}{stats.outstanding.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Transaction History */}
      <View style={styles.historySection}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Transaction History</Text>
        
        {contactRecords.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No transactions yet</Text>
          </View>
        ) : (
          <FlatList
            data={contactRecords}
            renderItem={({ item }) => <RecordItem record={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  card: {
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4F6EF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  contactName: {
    fontSize: 22,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: Spacing.sm,
  },
  historySection: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: 14,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
});

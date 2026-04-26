import { View, StyleSheet, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, router } from 'expo-router';
import { Header } from '@/components/Header';
import { ContactItem } from '@/components/ContactItem';
import { AdBanner } from '@/components/AdBanner';
import { EmptyState } from '@/components/EmptyState';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { useApp } from '@/hooks/useApp';
import { useData } from '@/hooks/useData';
import { Contact, Record as RecordType } from '@/types';

export default function ContactsScreen() {
  const { theme, currency } = useApp();
  const colors = Colors[theme];
  const { contacts, records, refreshData } = useData();
  const [contactsWithData, setContactsWithData] = useState<(Contact & {
    outstandingAmount: number;
    totalTransactions: number;
    lastTransactionDate?: string;
  })[]>([]);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    const enriched = contacts.map(contact => {
      const contactRecords = records.filter(r => r.contactId === contact.id);
      const outstandingAmount = contactRecords.reduce(
        (sum, r) => sum + (r.amount - r.paidBack),
        0
      );
      const totalTransactions = contactRecords.length;
      const lastTransactionDate = contactRecords.length > 0
        ? contactRecords.sort((a, b) => new Date(b.lentAt).getTime() - new Date(a.lentAt).getTime())[0].lentAt
        : undefined;

      return {
        ...contact,
        outstandingAmount,
        totalTransactions,
        lastTransactionDate,
      };
    }).filter(c => c.totalTransactions > 0);

    setContactsWithData(enriched);
  }, [contacts, records]);

  const renderContact = ({ item }: { item: typeof contactsWithData[0] }) => (
    <Link href={`/contact/${item.id}`} asChild>
      <ContactItem contact={item} />
    </Link>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Header title="Contacts" subtitle="People who owe you" />
      </View>

      {/* Contacts List */}
      {contactsWithData.length === 0 ? (
        <EmptyState
          title="No contacts yet"
          subtitle="Add a record to see contacts here"
        />
      ) : (
        <FlatList
          data={contactsWithData}
          renderItem={renderContact}
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

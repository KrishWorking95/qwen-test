import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { useApp } from '@/hooks/useApp';
import { Contact } from '@/types';

interface ContactItemProps {
  contact: Contact & {
    outstandingAmount?: number;
    totalTransactions?: number;
    lastTransactionDate?: string;
  };
  onPress?: () => void;
}

export function ContactItem({ contact, onPress }: ContactItemProps) {
  const { theme, currency } = useApp();
  const colors = Colors[theme];

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {contact.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
          {contact.name}
        </Text>
        <View style={styles.details}>
          <Text style={[styles.detail, { color: colors.textSecondary }]}>
            {contact.totalTransactions || 0} transactions
          </Text>
          <Text style={[styles.detail, { color: colors.textSecondary }]}>
            Last: {formatDate(contact.lastTransactionDate)}
          </Text>
        </View>
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: colors.danger }]}>
          {currency}{(contact.outstandingAmount || 0).toLocaleString()}
        </Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Outstanding
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4F6EF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  detail: {
    fontSize: 12,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});

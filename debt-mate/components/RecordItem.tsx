import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { useApp } from '@/hooks/useApp';
import { Record as RecordType } from '@/types';

interface RecordItemProps {
  record: RecordType;
  onPress?: () => void;
}

export function RecordItem({ record, onPress }: RecordItemProps) {
  const { theme, currency } = useApp();
  const colors = Colors[theme];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const remaining = record.amount - record.paidBack;
  const isPaid = record.status === 'paid';

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.textPrimary }]}>{record.contactName}</Text>
          <Text style={[styles.amount, { color: colors.textPrimary }]}>
            {currency}{record.amount.toLocaleString()}
          </Text>
        </View>
        
        <Text style={[styles.reason, { color: colors.textSecondary }]} numberOfLines={1}>
          {record.reason}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.dateTime}>
            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {formatDate(record.lentAt)}
            </Text>
            <Text style={[styles.time, { color: colors.textSecondary }]}>
              {formatTime(record.lentAt)}
            </Text>
          </View>
          
          <View style={[
            styles.badge,
            { 
              backgroundColor: isPaid ? colors.success + '20' : colors.warning + '20',
              borderColor: isPaid ? colors.success : colors.warning,
            }
          ]}>
            <Text style={[
              styles.badgeText,
              { color: isPaid ? colors.success : colors.warning }
            ]}>
              {isPaid ? 'Paid' : 'Pending'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  reason: {
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  date: {
    fontSize: 12,
  },
  time: {
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

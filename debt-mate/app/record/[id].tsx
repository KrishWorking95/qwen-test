import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Header } from '@/components/Header';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { useApp } from '@/hooks/useApp';
import { useData } from '@/hooks/useData';
import { Record as RecordType } from '@/types';

export default function RecordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, currency } = useApp();
  const colors = Colors[theme];
  const { records, updateRecord, refreshData } = useData();
  const [record, setRecord] = useState<RecordType | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (id && records.length > 0) {
      const found = records.find(r => r.id === id);
      setRecord(found || null);
    }
  }, [id, records]);

  if (!record) {
    return null;
  }

  const remaining = record.amount - record.paidBack;
  const isPaid = record.status === 'paid';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAddPayment = () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount');
      return;
    }

    const paymentValue = parseFloat(paymentAmount);
    if (paymentValue > remaining) {
      Alert.alert('Invalid Amount', 'Payment cannot exceed remaining amount');
      return;
    }

    const newPaidBack = record.paidBack + paymentValue;
    const updatedRecord: RecordType = {
      ...record,
      paidBack: newPaidBack,
      status: newPaidBack >= record.amount ? 'paid' : 'pending',
      paidAt: newPaidBack >= record.amount ? new Date().toISOString() : record.paidAt,
    };

    updateRecord(updatedRecord);
    setShowPaymentModal(false);
    setPaymentAmount('');
  };

  const handleMarkPaid = () => {
    Alert.alert(
      'Mark as Paid',
      `Are you sure you want to mark this record as fully paid?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Mark Paid',
          onPress: () => {
            const updatedRecord: RecordType = {
              ...record,
              paidBack: record.amount,
              status: 'paid',
              paidAt: new Date().toISOString(),
            };
            updateRecord(updatedRecord);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Record Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Contact Info */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.contactHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{record.contactName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.contactInfo}>
            <Text style={[styles.contactName, { color: colors.textPrimary }]}>{record.contactName}</Text>
            <View style={[styles.badge, { backgroundColor: isPaid ? colors.success + '20' : colors.warning + '20' }]}>
              <Text style={[styles.badgeText, { color: isPaid ? colors.success : colors.warning }]}>
                {isPaid ? 'Paid' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.amountSection}>
          <Text style={[styles.remainingLabel, { color: colors.textSecondary }]}>Remaining Amount</Text>
          <Text style={[styles.remainingAmount, { color: colors.danger }]}>
            {currency}{remaining.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Reason</Text>
          <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{record.reason}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Lent On</Text>
          <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{formatDate(record.lentAt)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Total Lent</Text>
          <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
            {currency}{record.amount.toLocaleString()}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Paid Back</Text>
          <Text style={[styles.detailValue, { color: colors.success }]}>
            {currency}{record.paidBack.toLocaleString()}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Outstanding</Text>
          <Text style={[styles.detailValue, { color: colors.danger }]}>
            {currency}{remaining.toLocaleString()}
          </Text>
        </View>

        {record.notes && (
          <>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Notes</Text>
              <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{record.notes}</Text>
            </View>
          </>
        )}
      </View>

      {/* Actions */}
      {!isPaid && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowPaymentModal(true)}
          >
            <FontAwesome name="money" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Add Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.success }]}
            onPress={handleMarkPaid}
          >
            <FontAwesome name="check" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Mark Paid</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
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
    padding: Spacing.md,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F6EF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  amountSection: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  remainingLabel: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  remainingAmount: {
    fontSize: 32,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: Spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

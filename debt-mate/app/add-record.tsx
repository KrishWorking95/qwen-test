import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { useApp } from '@/hooks/useApp';
import { useData } from '@/hooks/useData';
import { Contact } from '@/types';

export default function AddRecordScreen() {
  const { theme, currency } = useApp();
  const colors = Colors[theme];
  const { contacts, addRecord, getOrCreateContact, refreshData } = useData();
  
  const [contactName, setContactName] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (contactName.trim()) {
      const filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(contactName.toLowerCase())
      );
      setFilteredContacts(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setFilteredContacts([]);
    }
  }, [contactName, contacts]);

  const handleSelectContact = (contact: Contact) => {
    setContactName(contact.name);
    setSelectedContact(contact);
    setShowSuggestions(false);
  };

  const handleSubmit = async () => {
    if (!contactName.trim() || !amount || !reason) {
      return;
    }

    const contact = selectedContact || await getOrCreateContact(contactName);
    
    const newRecord = {
      id: Date.now().toString(),
      contactId: contact.id,
      contactName: contact.name,
      amount: parseFloat(amount),
      paidBack: 0,
      reason,
      notes: notes || undefined,
      lentAt: new Date().toISOString(),
      status: 'pending' as const,
    };

    await addRecord(newRecord);
    router.back();
  };

  return (
    <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          {/* Handle */}
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Add Record</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <FontAwesome name="times" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.form}>
            {/* Contact Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Contact Name</Text>
              <View style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <FontAwesome name="user" size={18} color={colors.textSecondary} />
                <TextInput
                  style={[styles.inputText, { color: colors.textPrimary }]}
                  placeholder="Enter or search contact..."
                  placeholderTextColor={colors.textSecondary}
                  value={contactName}
                  onChangeText={setContactName}
                  onFocus={() => contactName && setShowSuggestions(true)}
                />
              </View>

              {/* Suggestions Dropdown */}
              {showSuggestions && filteredContacts.length > 0 && (
                <View style={[styles.suggestions, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <FlatList
                    data={filteredContacts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.suggestionItem}
                        onPress={() => handleSelectContact(item)}
                      >
                        <FontAwesome name="user-circle" size={20} color={colors.primary} />
                        <Text style={[styles.suggestionText, { color: colors.textPrimary }]}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    )}
                    style={{ maxHeight: 150 }}
                  />
                </View>
              )}
            </View>

            {/* Amount */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Amount</Text>
              <View style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[styles.currencySymbol, { color: colors.textSecondary }]}>{currency}</Text>
                <TextInput
                  style={[styles.inputText, { color: colors.textPrimary }]}
                  placeholder="0.00"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
            </View>

            {/* Reason */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Reason</Text>
              <View style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <FontAwesome name="tag" size={18} color={colors.textSecondary} />
                <TextInput
                  style={[styles.inputText, { color: colors.textPrimary }]}
                  placeholder="Why did you lend?"
                  placeholderTextColor={colors.textSecondary}
                  value={reason}
                  onChangeText={setReason}
                />
              </View>
            </View>

            {/* Notes (Optional) */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Notes (Optional)</Text>
              <View style={[styles.input, styles.textArea, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <FontAwesome name="sticky-note-o" size={18} color={colors.textSecondary} />
                <TextInput
                  style={[styles.inputText, styles.textAreaInput, { color: colors.textPrimary }]}
                  placeholder="Add any additional details..."
                  placeholderTextColor={colors.textSecondary}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  backgroundColor: (!contactName.trim() || !amount || !reason) ? colors.border : colors.primary,
                },
              ]}
              onPress={handleSubmit}
              disabled={!contactName.trim() || !amount || !reason}
            >
              <Text style={styles.submitButtonText}>Save Record</Text>
            </TouchableOpacity>

            <View style={{ height: Spacing.xl }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '70%',
    paddingBottom: Spacing.xl,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  form: {
    paddingHorizontal: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.md,
    position: 'relative',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    height: 50,
    gap: Spacing.sm,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
  },
  suggestions: {
    position: 'absolute',
    top: 75,
    left: 0,
    right: 0,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    zIndex: 9999,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  suggestionText: {
    fontSize: 16,
  },
  textArea: {
    height: 100,
    alignItems: 'flex-start',
    paddingTop: Spacing.md,
  },
  textAreaInput: {
    textAlignVertical: 'top',
  },
  submitButton: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

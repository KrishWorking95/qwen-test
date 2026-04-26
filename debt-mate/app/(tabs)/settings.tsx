import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Header } from '@/components/Header';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { useApp } from '@/hooks/useApp';

const currencies = [
  { symbol: '₹', name: 'Indian Rupee' },
  { symbol: '$', name: 'US Dollar' },
  { symbol: '€', name: 'Euro' },
  { symbol: '£', name: 'British Pound' },
  { symbol: '¥', name: 'Japanese Yen' },
];

export default function SettingsScreen() {
  const { theme, toggleTheme, currency, setCurrency, notificationsEnabled, toggleNotifications } = useApp();
  const colors = Colors[theme];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Header title="Settings" subtitle="Customize your experience" />
      </View>

      {/* Appearance Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>
        
        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={toggleTheme}
        >
          <View style={styles.settingLeft}>
            <FontAwesome name={theme === 'light' ? 'moon-o' : 'sun-o'} size={20} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.textPrimary }]}>
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Text>
          </View>
          <View style={[styles.toggle, { backgroundColor: theme === 'dark' ? colors.success : colors.border }]}>
            <View style={[styles.toggleKnob, { transform: [{ translateX: theme === 'dark' ? 20 : 0 }] }]} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Currency Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>CURRENCY</Text>
        
        <View style={[styles.currencyContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {currencies.map((curr) => (
            <TouchableOpacity
              key={curr.symbol}
              onPress={() => setCurrency(curr.symbol)}
              style={[
                styles.currencyItem,
                {
                  backgroundColor: currency === curr.symbol ? colors.primary : 'transparent',
                  borderColor: currency === curr.symbol ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.currencySymbol,
                  { color: currency === curr.symbol ? '#FFFFFF' : colors.textPrimary },
                ]}
              >
                {curr.symbol}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.currencyName, { color: colors.textSecondary }]}>
          {currencies.find(c => c.symbol === currency)?.name}
        </Text>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>NOTIFICATIONS</Text>
        
        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={toggleNotifications}
        >
          <View style={styles.settingLeft}>
            <FontAwesome name="bell" size={20} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.textPrimary }]}>Payment Reminders</Text>
          </View>
          <View style={[styles.toggle, { backgroundColor: notificationsEnabled ? colors.success : colors.border }]}>
            <View style={[styles.toggleKnob, { transform: [{ translateX: notificationsEnabled ? 20 : 0 }] }]} />
          </View>
        </TouchableOpacity>
      </View>

      {/* App Info Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ABOUT</Text>
        
        <View style={[styles.infoItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Version</Text>
          <Text style={[styles.infoValue, { color: colors.textPrimary }]}>1.0.0</Text>
        </View>
        
        <View style={[styles.infoItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Developer</Text>
          <Text style={[styles.infoValue, { color: colors.textPrimary }]}>Debt Mate Team</Text>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
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
  section: {
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    padding: 2,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  currencyContainer: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  currencyItem: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '700',
  },
  currencyName: {
    fontSize: 14,
    marginLeft: Spacing.xs,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});

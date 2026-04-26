import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'debt_mate_theme';
const CURRENCY_KEY = 'debt_mate_currency';

interface AppContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  currency: string;
  setCurrency: (currency: string) => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [currency, setCurrencyState] = useState<string>('₹');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const [savedTheme, savedCurrency, savedNotifications] = await Promise.all([
        AsyncStorage.getItem(THEME_KEY),
        AsyncStorage.getItem(CURRENCY_KEY),
        AsyncStorage.getItem('debt_mate_notifications'),
      ]);
      if (savedTheme) setTheme(savedTheme as ThemeMode);
      if (savedCurrency) setCurrencyState(savedCurrency);
      if (savedNotifications !== null) setNotificationsEnabled(savedNotifications === 'true');
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoaded(true);
    }
  }

  async function toggleTheme() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }

  async function setCurrency(newCurrency: string) {
    setCurrencyState(newCurrency);
    try {
      await AsyncStorage.setItem(CURRENCY_KEY, newCurrency);
    } catch (error) {
      console.error('Error saving currency:', error);
    }
  }

  async function toggleNotifications() {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    try {
      await AsyncStorage.setItem('debt_mate_notifications', String(newValue));
    } catch (error) {
      console.error('Error saving notifications setting:', error);
    }
  }

  if (!loaded) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currency,
        setCurrency,
        notificationsEnabled,
        toggleNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

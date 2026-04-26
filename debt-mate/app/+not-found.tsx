import { Slot } from 'expo-router';
import { AppProvider } from '@/hooks/useApp';

export default function RootLayoutNav() {
  return (
    <AppProvider>
      <Slot />
    </AppProvider>
  );
}

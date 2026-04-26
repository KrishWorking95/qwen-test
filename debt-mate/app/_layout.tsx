import { Stack } from 'expo-router';
import { useApp } from '@/hooks/useApp';
import { Colors } from '@/constants/Colors';

export default function RootLayout() {
  const { theme } = useApp();
  const colors = Colors[theme];

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen 
        name="add-record" 
        options={{
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
        }} 
      />
      <Stack.Screen name="record/[id]" />
      <Stack.Screen name="contact/[id]" />
    </Stack>
  );
}

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen 
        name="_screens/SearchResultScreen" 
        options={{ headerShown: false }} 
      />
      
      <Stack.Screen 
        name="_screens/SearchDetailScreen" 
        options={{ headerShown: false }} 
      />
      
      <Stack.Screen name="_screens/AccountScreen" options={{ headerShown: false }} />
      <Stack.Screen name="_screens/FoodScreen" options={{ headerShown: false }} />
      <Stack.Screen name="_screens/DetectResultScreen" options={{ headerShown: false }} />
      <Stack.Screen name="_screens/HistoryScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
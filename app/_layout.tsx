import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SplashScreenController } from "@/components/SplashScreenController";
import { SafeAreaView } from "react-native-safe-area-context";

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === ("(auth)" as string);

    if (!user && !inAuthGroup) {
      router.replace("/login" as any);
    } else if (user && inAuthGroup) {
      router.replace("/" as any);
    }
  }, [user, isLoading, segments, router]);

  return (
    <SplashScreenController>
      <Stack screenOptions={{ headerShown: false }} />
    </SplashScreenController>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <RootLayoutNav />
      </SafeAreaView>
    </AuthProvider>
  );
}

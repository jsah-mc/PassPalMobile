import { SplashScreenController } from "@/components/SplashScreenController";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

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
        <RootLayoutNav />
    </AuthProvider>
  );
}

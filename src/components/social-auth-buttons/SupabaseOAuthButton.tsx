import { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { supabase } from "@/lib/supabase";

type OAuthProvider = "google" | "github";

type SupabaseOAuthButtonProps = {
  provider: OAuthProvider;
  label: string;
  icon: string;
};

const redirectUri = Linking.createURL("/login");

async function createSessionFromUrl(url: string, provider: OAuthProvider) {
  const fragment = url.includes("#") ? url.split("#")[1] : "";
  const query = url.includes("?") ? url.split("?")[1]?.split("#")[0] : "";
  const params = new URLSearchParams(fragment || query);
  const errorDescription = params.get("error_description");
  const code = params.get("code");
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (errorDescription) {
    throw new Error(errorDescription);
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return;
  }

  if (!accessToken || !refreshToken) {
    throw new Error(`${provider} sign-in completed without a Supabase session.`);
  }

  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (error) throw error;
}

export default function SupabaseOAuthButton({
  provider,
  label,
  icon,
}: SupabaseOAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;
      if (!data.url) throw new Error(`Supabase did not return a ${label} sign-in URL.`);

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
      if (result.type === "success") {
        await createSessionFromUrl(result.url, provider);
      }
    } catch (error: any) {
      Alert.alert(`${label} sign-in failed`, error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={handleSignIn}
      disabled={loading}
    >
      <View style={styles.content}>
        <MaterialDesignIcons name={icon as any} size={20} color="#cdd6f4" />
        <ThemedText style={styles.text}>{loading ? "Loading..." : `Continue with ${label}`}</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.three,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "#313244",
    borderWidth: 1,
    borderColor: "#45475a",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  pressed: {
    opacity: 0.82,
  },
  text: {
    fontWeight: "700",
    fontSize: 16,
    color: "#cdd6f4",
  },
});

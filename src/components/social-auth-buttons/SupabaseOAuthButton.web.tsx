import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
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

WebBrowser.maybeCompleteAuthSession();

export default function SupabaseOAuthButton({
  provider,
  label,
  icon,
}: SupabaseOAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);

    const redirectTo =
      typeof window === "undefined" ? undefined : `${window.location.origin}/login`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      console.error(`Supabase ${label} Sign-In error:`, error);
      setLoading(false);
      return;
    }

    if (data.url && typeof window !== "undefined") {
      window.location.assign(data.url);
    } else {
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

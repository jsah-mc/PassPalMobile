import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import Input from "@/components/vault/Input";
import GoogleSignInButton from "@/components/social-auth-buttons/GoogleSignInButton";
import GitHubSignInButton from "@/components/social-auth-buttons/GitHubSignInButton";
import { supabase } from "@/lib/supabase";

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    code?: string;
    access_token?: string;
    refresh_token?: string;
    error_description?: string;
  }>();
  const handledCallbackRef = useRef(false);
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (handledCallbackRef.current) return;

    const errorDescription = getParam(params.error_description);
    const code = getParam(params.code);
    const accessToken = getParam(params.access_token);
    const refreshToken = getParam(params.refresh_token);

    if (!errorDescription && !code && (!accessToken || !refreshToken)) return;

    handledCallbackRef.current = true;

    async function completeOAuthSignIn() {
      try {
        if (errorDescription) {
          throw new Error(errorDescription);
        }

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        }

        router.replace("/" as any);
      } catch (error: any) {
        Alert.alert("Sign-in failed", error.message);
      }
    }

    completeOAuthSignIn();
  }, [params, router]);

  async function submit() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing info", "Enter your email and password.");
      return;
    }

    setLoading(true);

    const response =
      mode === "sign-in"
        ? await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          })
        : await supabase.auth.signUp({
            email: email.trim(),
            password,
          });

    setLoading(false);

    if (response.error) {
      Alert.alert("Auth error", response.error.message);
      return;
    }

    if (mode === "sign-up") {
      Alert.alert("Account created", "Check your email if confirmation is enabled.");
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#11111b]">
      <View className="flex-1 justify-center px-5">
        <View className="mb-10 items-center">
          <View className="mb-5 h-20 w-20 items-center justify-center rounded-[28px] bg-[#313244]">
            <MaterialDesignIcons name="shield-key-outline" size={42} color="#cba6f7" />
          </View>

          <Text className="text-4xl font-bold text-[#cdd6f4]">PassPal</Text>
          <Text className="mt-2 text-base text-[#a6adc8]">
            Secure your passwords and contacts
          </Text>
        </View>

        <View className="rounded-[32px] border border-[#45475a] bg-[#1e1e2e] p-5">
          <Text className="text-2xl font-bold text-[#cdd6f4]">
            {mode === "sign-in" ? "Welcome back" : "Create account"}
          </Text>

          <Text className="mb-5 mt-2 text-[#a6adc8]">
            {mode === "sign-in" ? "Sign in to open your vault." : "Start your private vault."}
          </Text>

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            icon="email-outline"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            icon="lock-outline"
            secureTextEntry
          />

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={submit}
            disabled={loading}
            className="mt-4 items-center rounded-full bg-[#cba6f7] py-4"
          >
            {loading ? (
              <ActivityIndicator color="#11111b" />
            ) : (
              <Text className="text-base font-bold text-[#11111b]">
                {mode === "sign-in" ? "Sign in" : "Sign up"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() =>
              setMode((current) => (current === "sign-in" ? "sign-up" : "sign-in"))
            }
            className="mt-5 items-center"
          >
            <Text className="font-semibold text-[#89b4fa]">
              {mode === "sign-in"
                ? "Need an account? Sign up"
                : "Already have an account? Sign in"}
            </Text>
          </TouchableOpacity>

          <View className="my-5 h-px bg-[#45475a]" />
          <View className="gap-3">
            <GoogleSignInButton />
            <GitHubSignInButton />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useFocusEffect } from "expo-router";

import Header from "@/components/vault/Header";
import StatCard from "@/components/vault/StatCard";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function DashboardScreen() {
  const { session } = useAuth();
  const [passwordCount, setPasswordCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadCounts = useCallback(async () => {
    if (!session) return;

    setLoading(true);

    const [passwordsResponse, contactsResponse] = await Promise.all([
      supabase
        .from("password_entries")
        .select("id", { count: "exact", head: true })
        .eq("user_id", session.user.id),
      supabase
        .from("contacts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", session.user.id),
    ]);

    setLoading(false);

    if (passwordsResponse.error) {
      Alert.alert("Password count error", passwordsResponse.error.message);
      return;
    }

    if (contactsResponse.error) {
      Alert.alert("Contact count error", contactsResponse.error.message);
      return;
    }

    setPasswordCount(passwordsResponse.count ?? 0);
    setContactCount(contactsResponse.count ?? 0);
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      loadCounts();
    }, [loadCounts])
  );

  const score = useMemo(() => {
    if (passwordCount === 0) return 70;
    if (passwordCount < 5) return 82;
    return 94;
  }, [passwordCount]);

  return (
    <ScrollView
      className="flex-1 bg-[#11111b]"
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 104 }}
      showsVerticalScrollIndicator={false}
    >
      <Header
        title="Dashboard"
        subtitle="Your secure vault overview"
        icon="shield-check-outline"
      />

      <View className="mt-6 overflow-hidden rounded-[32px] bg-[#313244] p-6">
        <View className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
        <View className="absolute bottom-8 right-8 h-20 w-20 rounded-full bg-white/10" />

        <Text className="text-2xl font-bold text-white">Security Score</Text>
        <Text className="mt-2 leading-6 text-[#bac2de]">
          Keep adding strong, unique passwords to improve your protection.
        </Text>

        <View className="mt-7 flex-row items-end justify-between">
          <View>
            <Text className="text-6xl font-bold text-white">{score}</Text>
            <Text className="mt-1 text-[#bac2de]">
              {score >= 90 ? "Excellent" : "Good"}
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator color="#cba6f7" />
          ) : (
            <View className="rounded-full bg-[#cba6f7] px-5 py-3">
              <Text className="font-bold text-[#11111b]">Protected</Text>
            </View>
          )}
        </View>
      </View>

      <View className="mt-5 flex-row gap-3">
        <StatCard
          title="Passwords"
          value={passwordCount}
          icon="lock-outline"
          bg="bg-[#313244]"
          color="#cba6f7"
        />

        <StatCard
          title="Contacts"
          value={contactCount}
          icon="account-box-outline"
          bg="bg-[#313244]"
          color="#f5c2e7"
        />
      </View>

      <View className="mt-5 rounded-[28px] bg-[#1e1e2e] p-5">
        <View className="flex-row items-center">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#a6e3a1]/20">
            <MaterialDesignIcons name="check-circle-outline" size={28} color="#a6e3a1" />
          </View>

          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold text-[#cdd6f4]">Vault synced</Text>
            <Text className="mt-1 text-[#a6adc8]">Your Supabase vault is ready.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

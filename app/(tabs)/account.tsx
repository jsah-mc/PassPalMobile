import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

import Header from "@/components/vault/Header";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function AccountScreen() {
  const { user } = useAuth();

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Sign out error", error.message);
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-[#11111b]"
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 104 }}
      showsVerticalScrollIndicator={false}
    >
      <Header title="Account" subtitle="Manage your vault" icon="account-outline" />

      <View className="mt-6 rounded-[32px] border border-[#45475a] bg-[#1e1e2e] p-5">
        <View className="items-center">
          <View className="h-20 w-20 items-center justify-center rounded-[28px] bg-[#313244]">
            <MaterialDesignIcons name="account-outline" size={42} color="#cba6f7" />
          </View>

          <Text className="mt-4 text-xl font-bold text-[#cdd6f4]">
            {user?.email ?? "No email available"}
          </Text>

          <Text className="mt-1 text-[#a6adc8]">
            User ID: {user?.id ? `${user.id.slice(0, 8)}...` : "Unavailable"}
          </Text>
        </View>

        <View className="mt-6 rounded-[24px] bg-[#313244] p-4">
          <Text className="font-bold text-[#cdd6f4]">Security note</Text>

          <Text className="mt-2 leading-6 text-[#a6adc8]">
            This screen is wired to the existing Supabase vault tables. Add on-device
            encryption before storing real passwords.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={signOut}
          className="mt-6 items-center rounded-full bg-[#f38ba8] py-4"
        >
          <Text className="font-bold text-[#11111b]">Sign out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

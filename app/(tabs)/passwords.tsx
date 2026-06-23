import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";

import Header from "@/components/vault/Header";
import Input from "@/components/vault/Input";
import VaultListCard from "@/components/vault/VaultListCard";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import type { PasswordEntry } from "@/types/database";

export default function PasswordsScreen() {
  const { session } = useAuth();
  const [items, setItems] = useState<PasswordEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");

  const loadPasswords = useCallback(async () => {
    if (!session) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("password_entries")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    setLoading(false);

    if (error) {
      Alert.alert("Load error", error.message);
      return;
    }

    setItems((data ?? []) as PasswordEntry[]);
  }, [session]);

  async function addPassword() {
    if (!session) return;

    if (!title.trim() || !password.trim()) {
      Alert.alert("Missing info", "Title and password are required.");
      return;
    }

    const { error } = await supabase.from("password_entries").insert({
      user_id: session.user.id,
      site_name: title.trim(),
      username: username.trim() || null,
      encrypted_password: password,
      iv: "not-encrypted-yet",
      notes: notes.trim() || null,
    });

    if (error) {
      Alert.alert("Save error", error.message);
      return;
    }

    setTitle("");
    setUsername("");
    setPassword("");
    setNotes("");
    loadPasswords();
  }

  async function deletePassword(id: string) {
    const { error } = await supabase.from("password_entries").delete().eq("id", id);

    if (error) {
      Alert.alert("Delete error", error.message);
      return;
    }

    setItems((current) => current.filter((item) => item.id !== id));
  }

  useFocusEffect(
    useCallback(() => {
      loadPasswords();
    }, [loadPasswords])
  );

  return (
    <ScrollView
      className="flex-1 bg-[#11111b]"
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 104 }}
      showsVerticalScrollIndicator={false}
    >
      <Header title="Passwords" subtitle="Save your logins" icon="lock-outline" />

      <View className="mt-6 rounded-[32px] border border-[#45475a] bg-[#1e1e2e] p-5">
        <Text className="mb-4 text-xl font-bold text-[#cdd6f4]">Add password</Text>

        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Google"
          icon="bookmark-outline"
        />

        <Input
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="email@example.com"
          icon="account-outline"
          autoCapitalize="none"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Secret password"
          icon="key-outline"
          secureTextEntry
        />

        <Input
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Optional notes"
          icon="note-text-outline"
        />

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={addPassword}
          className="mt-3 items-center rounded-full bg-[#cba6f7] py-4"
        >
          <Text className="font-bold text-[#11111b]">Save password</Text>
        </TouchableOpacity>
      </View>

      <Text className="mb-4 mt-7 text-xl font-bold text-[#cdd6f4]">Saved passwords</Text>

      {loading ? (
        <ActivityIndicator color="#cba6f7" className="mt-5" />
      ) : (
        <View className="gap-3">
          {items.map((item) => (
            <VaultListCard
              key={item.id}
              title={item.site_name}
              subtitle={item.username ?? item.notes ?? "No username"}
              icon="lock-outline"
              color="#cba6f7"
              bg="bg-[#cba6f7]/20"
              onDelete={() => deletePassword(item.id)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

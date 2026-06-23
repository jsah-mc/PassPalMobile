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
import type { ContactItem } from "@/types/database";

export default function ContactsScreen() {
  const { session } = useAuth();
  const [items, setItems] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  const loadContacts = useCallback(async () => {
    if (!session) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    setLoading(false);

    if (error) {
      Alert.alert("Load error", error.message);
      return;
    }

    setItems((data ?? []) as ContactItem[]);
  }, [session]);

  async function addContact() {
    if (!session) return;

    if (!name.trim()) {
      Alert.alert("Missing info", "Name is required.");
      return;
    }

    const [firstName, ...lastNameParts] = name.trim().split(/\s+/);
    const { error } = await supabase.from("contacts").insert({
      user_id: session.user.id,
      first_name: firstName,
      last_name: lastNameParts.join(" ") || null,
      email: email.trim() || null,
      phone: phone.trim() || null,
      company: company.trim() || null,
    });

    if (error) {
      Alert.alert("Save error", error.message);
      return;
    }

    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    loadContacts();
  }

  async function deleteContact(id: string) {
    const { error } = await supabase.from("contacts").delete().eq("id", id);

    if (error) {
      Alert.alert("Delete error", error.message);
      return;
    }

    setItems((current) => current.filter((item) => item.id !== id));
  }

  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [loadContacts])
  );

  return (
    <ScrollView
      className="flex-1 bg-[#11111b]"
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 104 }}
      showsVerticalScrollIndicator={false}
    >
      <Header title="Contacts" subtitle="Private people and notes" icon="account-group-outline" />

      <View className="mt-6 rounded-[32px] border border-[#45475a] bg-[#1e1e2e] p-5">
        <Text className="mb-4 text-xl font-bold text-[#cdd6f4]">Add contact</Text>

        <Input
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Jane Doe"
          icon="account-outline"
        />

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="jane@example.com"
          icon="email-outline"
          autoCapitalize="none"
        />

        <Input
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          placeholder="+1 555 123 4567"
          icon="phone-outline"
        />

        <Input
          label="Company"
          value={company}
          onChangeText={setCompany}
          placeholder="Acme"
          icon="domain"
        />

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={addContact}
          className="mt-3 items-center rounded-full bg-[#cba6f7] py-4"
        >
          <Text className="font-bold text-[#11111b]">Save contact</Text>
        </TouchableOpacity>
      </View>

      <Text className="mb-4 mt-7 text-xl font-bold text-[#cdd6f4]">Saved contacts</Text>

      {loading ? (
        <ActivityIndicator color="#cba6f7" className="mt-5" />
      ) : (
        <View className="gap-3">
          {items.map((item) => {
            const fullName = [item.first_name, item.last_name].filter(Boolean).join(" ");

            return (
              <VaultListCard
                key={item.id}
                title={fullName}
                subtitle={item.email ?? item.phone ?? item.company ?? "No contact info"}
                icon="account-outline"
                color="#f5c2e7"
                bg="bg-[#f5c2e7]/20"
                onDelete={() => deleteContact(item.id)}
              />
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

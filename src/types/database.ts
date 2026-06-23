export type TabKey = "index" | "passwords" | "contacts" | "account";

export type PasswordEntry = {
  id: string;
  user_id: string;
  site_name: string;
  username: string | null;
  encrypted_password: string;
  iv: string;
  notes: string | null;
  kdf_salt: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactItem = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

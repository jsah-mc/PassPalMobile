import SupabaseOAuthButton from "./SupabaseOAuthButton";

export default function GitHubSignInButton() {
  return <SupabaseOAuthButton provider="github" label="GitHub" icon="github" />;
}

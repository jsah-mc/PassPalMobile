import { Alert, Pressable, StyleSheet } from 'react-native'
import { ThemedText } from '@/components/themed-text'
import { Colors, Spacing } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
import { useColorScheme } from '@/hooks/use-color-scheme'

export function LogoutButton() {
  const { signOut } = useAuth()
  const scheme = useColorScheme()
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme]

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ])
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.backgroundElement },
        pressed && { opacity: 0.8 },
      ]}
      onPress={handleLogout}>
      <ThemedText style={styles.text}>Sign Out</ThemedText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
  },
})

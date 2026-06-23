import { useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { useAuth } from '@/context/AuthContext'

SplashScreen.preventAutoHideAsync()

export function SplashScreenController({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync()
    }
  }, [isLoading])

  if (isLoading) {
    return null
  }

  return <>{children}</>
}

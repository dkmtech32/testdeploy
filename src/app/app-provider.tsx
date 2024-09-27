'use client'
import { isClient } from '@/lib/http'
import { AccountResType, AccountType } from '@/schemaValidations/account.schema'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

type User = AccountType

const AppContext = createContext<{
  user: User | null
  setUser: (user: User | null) => void
  setSessionToken: (sessionToken: string) => void
  isAuthenticated: boolean
}>({
  user: null,
  setUser: () => {},
  setSessionToken: () => {},
  isAuthenticated: false
})
export const useAppContext = () => {
  const context = useContext(AppContext)
  return context
}
export default function AppProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [user, setUserState] = useState<User | null>(null)
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const isAuthenticated = Boolean(user)

  useEffect(() => {
    const _user = localStorage.getItem('user')
    const _sessionToken = localStorage.getItem('sessionToken')
    if (_user) {
      setUserState(JSON.parse(_user))
    }
    if (_sessionToken) {
      setSessionToken(_sessionToken)
    }
  }, [])

  const setUser = useCallback(
    (user: User | null) => {
      setUserState(user)
      localStorage.setItem('user', JSON.stringify(user))
    },
    [setUserState]
  )

  const setSessionTokenState = useCallback(
    (sessionToken: string) => {
      setSessionToken(sessionToken)
      localStorage.setItem('sessionToken', sessionToken)
    },
    []
  )

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        setSessionToken: setSessionTokenState,
        isAuthenticated
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

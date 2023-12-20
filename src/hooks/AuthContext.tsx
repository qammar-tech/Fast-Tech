import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react'

interface User {
  id: number
  email: string
  name: string
  username: string
  first_name: string
  last_name: string
  uid: string
  active_status: string
  provider: 'email'
  created_at: string
  updated_at: string
}

interface AuthContextProps {
  isAuthenticated: boolean | undefined
  token: string | undefined
  user: User | undefined
  login: (response: any) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!(
      localStorage.getItem('user_id') && localStorage.getItem('user_id') !== ''
    )
  )

  const [user, setUser] = useState<User | undefined>(
    localStorage.getItem('user') && localStorage.getItem('user') !== '' && localStorage.getItem('user') !== 'undefined'
    ? JSON?.parse(localStorage?.getItem('user') as string)
    : undefined

  )

  const [token, setToken] = useState<string | undefined>(
    localStorage.getItem('access_token') &&
      localStorage.getItem('access_token') !== ''
      ? (localStorage.getItem('access_token') as string)
      : undefined
  )

  const login = async (apiResponse: any) => {
    const responseData = await apiResponse.data

    const token = responseData.token
    localStorage.setItem('user', JSON.stringify(responseData.user))
    localStorage.setItem('user_id', responseData.user.id)
    localStorage.setItem('access_token', token)
    // localStorage.setItem('refresh_token', responseData.headers.authorization);
    setIsAuthenticated(true)
    setUser(responseData.user)
    setToken(token)
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('user_id')
    localStorage.removeItem('access_token')
    setIsAuthenticated(false)
    setUser(undefined)
    setToken(undefined)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, user, token } as any}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth, type User }

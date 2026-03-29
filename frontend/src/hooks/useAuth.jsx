/**
 * useAuth — ログイン状態を管理するフック
 * App全体で共有し、ログインユーザー情報を提供する
 */
import { useState, useEffect, createContext, useContext } from 'react'
import { supabase, signInWithGoogle, signOut } from '../lib/supabase'

// Contextで全体共有
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 初期セッション取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    // ログイン状態変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    displayName: user?.user_metadata?.full_name || user?.email || null,
    avatarUrl:   user?.user_metadata?.avatar_url || null,
    signIn:  signInWithGoogle,
    signOut: signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

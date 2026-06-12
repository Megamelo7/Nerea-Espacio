import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

const KEY = 'nerea_admin'

interface AdminAuthCtx {
  isAdmin: boolean
  login: () => void
  logout: () => void
}

const Ctx = createContext<AdminAuthCtx>({ isAdmin: false, login: () => {}, logout: () => {} })

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem(KEY) === 'true')

  function login() {
    localStorage.setItem(KEY, 'true')
    setIsAdmin(true)
  }

  function logout() {
    localStorage.removeItem(KEY)
    setIsAdmin(false)
  }

  return <Ctx.Provider value={{ isAdmin, login, logout }}>{children}</Ctx.Provider>
}

export function useAdminAuth() {
  return useContext(Ctx)
}

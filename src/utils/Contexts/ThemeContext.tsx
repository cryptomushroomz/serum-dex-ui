import React, { useState, createContext } from 'react'

type ThemeType = 'light' | 'dark'
type ThemeContext = [ThemeType, () => void]

/* eslint-disable-next-line */
export const ThemeContext = createContext<ThemeContext>({} as ThemeContext)

export const ThemeProvider: React.FC = ({ children }) => {
  const initialState: ThemeType = (window.localStorage.getItem('THEME') as ThemeType) || 'dark'
  const [theme, setTheme] = useState<ThemeType>(initialState)
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    window.localStorage.setItem('THEME', newTheme)
    // window.location.reload()
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', newTheme)
    }
    setTheme(newTheme)
  }

  return <ThemeContext.Provider value={[theme, toggleTheme]}>{children}</ThemeContext.Provider>
}

export function isDark(theme): Boolean {
  return theme !== 'light' ? true : false
}

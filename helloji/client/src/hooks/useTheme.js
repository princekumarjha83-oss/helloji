import { useState, useEffect } from 'react'

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme
    }
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    
    return 'light'
  })

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement
    
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme)
    
    // Update meta tag for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (metaTheme) {
      metaTheme.content = theme === 'dark' ? '#1f2937' : '#ffffff'
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  const setThemeMode = (mode) => {
    if (mode === 'light' || mode === 'dark') {
      setTheme(mode)
    }
  }

  return {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    toggleTheme,
    setThemeMode
  }
}

export default useTheme

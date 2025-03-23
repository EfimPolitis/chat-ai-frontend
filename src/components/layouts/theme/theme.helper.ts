import { createContext } from 'react'

export const supportedThemes = {
  light: 'light',
  dark: 'dark'
}

export type Themes = keyof typeof supportedThemes

export const StorageKey = 'color-theme'

export const getTheme = (): Themes => {
  if (typeof window === 'undefined') {
    return 'light' // Возвращаем тему по умолчанию на сервере
  }

  let theme = localStorage.getItem(StorageKey)

  if (!theme) {
    localStorage.setItem(StorageKey, 'light')
    theme = 'light'
  }

  return theme as Themes
}

export const ThemeContext = createContext<
  | {
      theme: Themes
      setTheme: (theme: Themes) => void
      supportedThemes: { [key: string]: string }
    }
  | undefined
>(undefined)

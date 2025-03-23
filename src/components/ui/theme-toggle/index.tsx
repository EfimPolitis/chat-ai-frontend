import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useTheme } from '@/hooks/useTheme'

import styles from './index.module.scss'

export const ThemeToggler = () => {
  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <button
      className={styles.themeBtn}
      title={
        theme === 'dark'
          ? 'Поменять на светлую тему'
          : 'Поменять на тёмную тему'
      }
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  )
}

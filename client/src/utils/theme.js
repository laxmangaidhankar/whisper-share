const THEME_KEY = 'whispershare-theme'

export const getTheme = () => {
  return localStorage.getItem(THEME_KEY) || 'light'
}

export const setTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme)
  document.documentElement.setAttribute('data-theme', theme)
}

export const initializeTheme = () => {
  const theme = getTheme()
  document.documentElement.setAttribute('data-theme', theme)
  return theme
}
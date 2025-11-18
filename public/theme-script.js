// Theme initialization script
if (document.documentElement) {
    var defaultThemeMode = 'system'
    var themeMode = localStorage.getItem('kt_theme_mode_value')
    if (!themeMode) {
        if (defaultThemeMode === 'system') {
            themeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        } else {
            themeMode = defaultThemeMode
        }
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        themeMode = "light"
    }
    document.documentElement.setAttribute('data-bs-theme', themeMode)
}

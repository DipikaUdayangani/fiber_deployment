class ThemeManager {
    static init() {
        const theme = localStorage.getItem('theme') || 'light';
        this.setTheme(theme);
    }

    static setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    static toggleTheme() {
        const current = localStorage.getItem('theme') || 'light';
        const newTheme = current === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}
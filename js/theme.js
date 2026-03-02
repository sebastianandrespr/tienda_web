(function () {
    const theme = localStorage.getItem('theme');
    const isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
})();

window.toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Update icons if necessary (optional, but good for UX)
    const icons = document.querySelectorAll('.theme-toggle-icon');
    icons.forEach(icon => {
        icon.innerText = isDark ? 'light_mode' : 'dark_mode';
    });
};

// Also apply the correct icon on load
document.addEventListener('DOMContentLoaded', () => {
    const isDark = document.documentElement.classList.contains('dark');
    const icons = document.querySelectorAll('.theme-toggle-icon');
    icons.forEach(icon => {
        icon.innerText = isDark ? 'light_mode' : 'dark_mode';
    });
});

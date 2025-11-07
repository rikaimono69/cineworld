/**
 * Ключ для сохранения темы в localStorage.
 */
const THEME_KEY = 'cineWorldTheme';

/**
 * CSS класс для активации темной темы.
 */
const DARK_CLASS = 'dark-theme';

/**
 * Обновляет логотип (светлый/темный) в зависимости от текущей темы.
 */
function updateLogo(isDark) {
    const logoImg = document.getElementById('logo-img');
    if (logoImg) {
        logoImg.src = isDark ? 'logomark_dark.svg' : 'logomark.svg';
    }
}

/**
 * Обновляет текст переключателя (Dark theme / Light theme).
 */
function updateThemeText(isDark) {
    const themeTextLabel = document.getElementById('theme-text-label');
    if (themeTextLabel) {
        themeTextLabel.textContent = isDark ? 'Light theme' : 'Dark theme';
    }
}

/**
 * Переключает тему, применяет класс, сохраняет выбор и обновляет элементы.
 */
function toggleTheme(isDark) {
    const body = document.body;
    if (isDark) {
        body.classList.add(DARK_CLASS);
        localStorage.setItem(THEME_KEY, 'dark');
    } else {
        body.classList.remove(DARK_CLASS);
        localStorage.setItem(THEME_KEY, 'light');
    }
    
    updateLogo(isDark);
    updateThemeText(isDark);
}

/**
 * Немедленная инициализация темы при загрузке (предотвращение мерцания).
 * Тема по умолчанию - светлая.
 */
(function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    const isDark = savedTheme === 'dark';
    
    if (isDark) {
        document.body.classList.add(DARK_CLASS);
    }
    
    updateLogo(isDark);
    updateThemeText(isDark);
    
    if (!localStorage.getItem(THEME_KEY)) {
        localStorage.setItem(THEME_KEY, 'light');
    }
})();


// Настройка слушателя после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcherInput = document.querySelector('.theme-switcher__input');
    
    if (themeSwitcherInput) {
        // Установка начального состояния переключателя
        const isDark = document.body.classList.contains(DARK_CLASS);
        themeSwitcherInput.checked = isDark;

        // Слушатель для переключения темы
        themeSwitcherInput.addEventListener('change', (event) => {
            toggleTheme(event.target.checked);
        });
    }
});
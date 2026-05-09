import { ref, onMounted, watch } from 'vue';

const isDark = ref(true);

export function useTheme() {
    const applyTheme = (dark: boolean) => {
        const html = document.documentElement;

        html.classList.add('theme-transitioning');

        if (dark) {
            html.removeAttribute('data-theme');
        } else {
            html.setAttribute('data-theme', 'light');
        }

        const timer = setTimeout(() => {
            html.classList.remove('theme-transitioning');
        }, 400);

        return () => clearTimeout(timer);
    };

    const toggleTheme = () => {
        isDark.value = !isDark.value;
        localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
        applyTheme(isDark.value);
    };

    onMounted(() => {
        const saved = localStorage.getItem('theme');
        if (saved) {
            isDark.value = saved === 'dark';
        } else {
            isDark.value = !window.matchMedia('(prefers-color-scheme: light)').matches;
        }
        if (!isDark.value) {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    });

    return { isDark, toggleTheme };
}

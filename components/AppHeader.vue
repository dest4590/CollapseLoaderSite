<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Github, Download, Sun, Moon } from 'lucide-vue-next';

const { locale, setLocale, availableLocales } = useI18n();
const localePath = useLocalePath();
const { isDark, toggleTheme } = useTheme();
const isScrolled = ref(false);
const isHidden = ref(false);
const mobileMenuOpen = ref(false);

const props = defineProps<{ hideNav?: boolean }>();

const changeLanguage = (lang: string) => {
    setLocale(lang as 'en' | 'ru');
};

const pillClass = computed(() => {
    if (isDark.value) {
        return isScrolled.value
            ? 'bg-base-100/80 backdrop-blur-2xl border-white/10 shadow-lg shadow-black/20'
            : 'bg-base-100/60 backdrop-blur-2xl border-white/8';
    } else {
        return isScrolled.value
            ? 'bg-white/85 backdrop-blur-2xl border-black/10 shadow-lg shadow-black/8'
            : 'bg-white/75 backdrop-blur-2xl border-black/8';
    }
});

const handleScroll = () => {
    isScrolled.value = window.scrollY > 20;

    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        const rect = featuresSection.getBoundingClientRect();
        if (!isHidden.value && rect.top <= 120) {
            isHidden.value = true;
        } else if (isHidden.value && rect.top >= 200) {
            isHidden.value = false;
        }
    }
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <div
        class="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pointer-events-none navbar-wrapper"
        :class="isHidden ? 'navbar-hidden' : 'navbar-visible'"
    >
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">

            <a
                href="/"
                class="navbar-item navbar-item-1 pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full border text-primary font-bold tracking-wide text-xl hover:opacity-80 transition-all duration-300 shrink-0"
                :class="pillClass"
                :style="{ fontFamily: '\'Kind Sans\', sans-serif', backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)' }"
            >
                <img src="~/assets/img/collapse.svg" alt="CollapseLoader Logo" class="h-6 w-6" />
                {{ $t('brand') }}
            </a>

            <nav
                v-if="!props.hideNav"
                class="navbar-item navbar-item-2 pointer-events-auto hidden lg:flex items-center gap-1 px-5 py-2.5 rounded-full border transition-all duration-300"
                :class="pillClass"
                :style="{ backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)' }"
            >
                <a href="#features" class="nav-pill">{{ $t('nav.why') }}</a>
                <a href="#exclusive-features" class="nav-pill">{{ $t('nav.features') }}</a>
                <a href="#downloads" class="nav-pill">{{ $t('nav.download') }}</a>
                <NuxtLink :to="localePath('/clients')" class="nav-pill">{{ $t('nav.clients') }}</NuxtLink>
                <NuxtLink :to="localePath('/changelog')" class="nav-pill">Changelog</NuxtLink>
            </nav>

            <div class="navbar-item navbar-item-3 pointer-events-auto hidden lg:flex items-center gap-2 shrink-0">
                <div
                    class="flex items-center gap-1 px-3 py-2 rounded-full border transition-all duration-300"
                    :class="pillClass"
                    :style="{ backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)' }"
                >
                    <a
                        href="https://discord.com/invite/FyKtnFqs6J"
                        target="_blank"
                        rel="noopener noreferrer"
                        :aria-label="$t('footer.discord')"
                        class="icon-btn"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                        </svg>
                    </a>

                    <a
                        href="https://t.me/collapseloader"
                        target="_blank"
                        rel="noopener noreferrer"
                        :aria-label="$t('footer.telegram')"
                        class="icon-btn"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                    </a>

                    <a
                        href="https://github.com/dest4590/CollapseLoader"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub Repository"
                        class="icon-btn"
                    >
                        <Github class="w-[18px] h-[18px]" />
                    </a>

                    <div class="w-px h-4 bg-white/10 mx-1"></div>

                    <button
                        @click="toggleTheme"
                        class="icon-btn"
                        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
                        :title="isDark ? 'Light mode' : 'Dark mode'"
                    >
                        <Sun v-if="isDark" class="w-[18px] h-[18px]" />
                        <Moon v-else class="w-[18px] h-[18px]" />
                    </button>

                    <div class="w-px h-4 bg-white/10 mx-1"></div>

                    <div class="flex items-center gap-1">
                        <button
                            v-for="loc in availableLocales"
                            :key="loc"
                            @click="changeLanguage(loc)"
                            class="lang-dot"
                            :class="locale === loc ? 'lang-dot-active' : 'lang-dot-inactive'"
                            :aria-label="loc.toUpperCase()"
                            :title="loc.toUpperCase()"
                        >
                            {{ loc.toUpperCase() }}
                        </button>
                    </div>
                </div>

                <a
                    href="#downloads"
                    class="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-content text-sm font-semibold hover:opacity-90 transition-opacity duration-200 shadow-lg shadow-primary/20"
                >
                    <Download class="w-4 h-4" />
                    {{ $t('nav.download') }}
                </a>
            </div>

            <button
                class="navbar-item navbar-item-3 pointer-events-auto lg:hidden flex items-center justify-center w-9 h-9 rounded-full bg-base-100/80 backdrop-blur-md border border-white/10 text-base-content"
                @click="mobileMenuOpen = !mobileMenuOpen"
                :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
            >
                <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <Transition name="mobile-menu">
            <div
                v-if="mobileMenuOpen"
                class="pointer-events-auto lg:hidden mt-2 mx-auto max-w-sm rounded-2xl border border-white/10 bg-base-100/90 backdrop-blur-xl shadow-2xl shadow-black/30 overflow-hidden"
            >
                <div class="p-4 flex flex-col gap-1">
                    <a href="#features" class="mobile-nav-item" @click="mobileMenuOpen = false">{{ $t('nav.why') }}</a>
                    <a href="#exclusive-features" class="mobile-nav-item" @click="mobileMenuOpen = false">{{ $t('nav.features') }}</a>
                    <a href="#downloads" class="mobile-nav-item" @click="mobileMenuOpen = false">{{ $t('nav.download') }}</a>
                    <NuxtLink :to="localePath('/clients')" class="mobile-nav-item" @click="mobileMenuOpen = false">{{ $t('nav.clients') }}</NuxtLink>
                    <NuxtLink :to="localePath('/changelog')" class="mobile-nav-item" @click="mobileMenuOpen = false">Changelog</NuxtLink>

                    <div class="h-px bg-white/10 my-2"></div>

                    <div class="flex items-center justify-between px-3 py-2">
                        <div class="flex items-center gap-3">
                            <a href="https://discord.com/invite/FyKtnFqs6J" target="_blank" rel="noopener noreferrer" :aria-label="$t('footer.discord')" class="icon-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                </svg>
                            </a>
                            <a href="https://t.me/collapseloader" target="_blank" rel="noopener noreferrer" :aria-label="$t('footer.telegram')" class="icon-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                </svg>
                            </a>
                            <a href="https://github.com/dest4590/CollapseLoader" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository" class="icon-btn">
                                <Github class="w-[18px] h-[18px]" />
                            </a>
                        </div>

                        <div class="flex items-center gap-1">
                            <button
                                @click="toggleTheme"
                                class="icon-btn"
                                :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
                            >
                                <Sun v-if="isDark" class="w-[18px] h-[18px]" />
                                <Moon v-else class="w-[18px] h-[18px]" />
                            </button>
                            <div class="w-px h-4 bg-white/10 mx-1"></div>
                            <button
                                v-for="loc in availableLocales"
                                :key="loc"
                                @click="changeLanguage(loc)"
                                class="lang-dot"
                                :class="locale === loc ? 'lang-dot-active' : 'lang-dot-inactive'"
                                :aria-label="loc.toUpperCase()"
                            >
                                {{ loc.toUpperCase() }}
                            </button>
                        </div>
                    </div>

                    <a href="#downloads" class="mt-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-content text-sm font-semibold" @click="mobileMenuOpen = false">
                        <Download class="w-4 h-4" />
                        {{ $t('nav.download') }}
                    </a>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
@reference "../assets/style.css";

.navbar-wrapper {
    transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: opacity;
}

.navbar-visible {
    opacity: 1;
    pointer-events: none;
}

.navbar-hidden {
    opacity: 0;
    pointer-events: none !important;
}

.navbar-item {
    opacity: 0;
}

.navbar-item-1 {
    animation: drop-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.05s forwards;
}

.navbar-item-2 {
    animation: drop-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
}

.navbar-item-3 {
    animation: drop-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards;
}

@keyframes drop-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.nav-pill {
    @apply px-4 py-1.5 rounded-full text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-white/5 transition-all duration-200;
}

.icon-btn {
    @apply p-1.5 rounded-full text-base-content/60 hover:text-base-content hover:bg-white/5 transition-all duration-200;
}

.lang-dot {
    @apply text-[10px] font-bold px-2 py-1 rounded-full transition-all duration-200 cursor-pointer;
}

.lang-dot-active {
    @apply bg-primary text-primary-content;
}

.lang-dot-inactive {
    @apply text-base-content/50 hover:text-base-content hover:bg-white/5;
}

.mobile-nav-item {
    @apply px-3 py-2.5 rounded-xl text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-white/5 transition-all duration-200;
}

.mobile-menu-enter-active {
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.mobile-menu-leave-active {
    transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.mobile-menu-enter-from {
    opacity: 0;
    transform: translateY(-8px) scale(0.97);
}

.mobile-menu-leave-to {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
}
</style>

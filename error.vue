<script setup lang="ts">
import { Home, Github } from 'lucide-vue-next';

const props = defineProps<{
    error: { statusCode?: number; statusMessage?: string; message?: string; description?: string }
}>();

const { t } = useI18n();
const localePath = useLocalePath();
useTheme();

const statusCode = props.error?.statusCode ?? 404;
const is404 = statusCode === 404;
</script>

<template>
    <div class="min-h-screen bg-base-200 bg-grid-pattern overflow-x-hidden relative flex flex-col">
        <div class="absolute inset-0 pointer-events-none z-0">
            <div class="absolute inset-0 hero-gradient-bg opacity-50"></div>
            <div class="absolute inset-0 pattern-dots opacity-30"></div>
        </div>

        <div class="relative z-10 flex-1 flex items-center justify-center px-6 py-24">
            <div class="glass-card max-w-lg w-full text-center p-12 rounded-2xl smooth-appear">
                <div class="text-8xl font-black leading-none mb-2 mt-2" style="font-family: 'Kind Sans', sans-serif;">
                    <span class="text-gradient">{{ statusCode }}</span>
                </div>

                <p class="text-lg font-semibold text-base-content/70 mt-4 mb-8">
                    <template v-if="is404">
                        {{ t('error.not_found') }}
                    </template>
                    <template v-else>
                        {{ props.error?.statusMessage || t('error.something_wrong') }}
                    </template>
                </p>

                <div class="flex flex-wrap items-center justify-center gap-2">
                    <button
                        @click="clearError({ redirect: localePath('/') })"
                        class="btn-404"
                    >
                        <Home class="w-4 h-4" />
                        {{ t('error.home') }}
                    </button>

                    <span class="w-px h-5 bg-base-content/10 mx-1"></span>

                    <a
                        href="https://discord.com/invite/FyKtnFqs6J"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="social-404"
                        aria-label="Discord"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                        </svg>
                    </a>
                    <a
                        href="https://telegram.me/collapseloader"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="social-404"
                        aria-label="Telegram"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                        </svg>
                    </a>
                    <a
                        href="https://github.com/dest4590/CollapseLoader"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="social-404"
                        aria-label="GitHub"
                    >
                        <Github class="w-[18px] h-[18px]" />
                    </a>
                </div>
            </div>
        </div>

        <footer class="relative z-10 text-center px-6 py-6 text-xs text-base-content/40">
            {{ t('footer.copyright') }}
        </footer>
    </div>
</template>

<style scoped>
@reference "~/assets/style.css";

.bg-grid-pattern {
    background-image:
        linear-gradient(rgb(var(--b3) / 0.5) 1px, transparent 1px),
        linear-gradient(to right, rgb(var(--b3) / 0.5) 1px, transparent 1px);
    background-size: 3rem 3rem;
}

.hero-gradient-bg {
    background:
        radial-gradient(ellipse at 50% 0%, hsl(var(--p) / 0.1), transparent 60%),
        radial-gradient(ellipse at 0% 100%, hsl(var(--s) / 0.08), transparent 70%),
        radial-gradient(ellipse at 100% 100%, hsl(var(--a) / 0.08), transparent 70%);
}

.pattern-dots {
    background-image: radial-gradient(currentColor 0.7px, transparent 0.7px);
    background-size: 15px 15px;
    color: hsl(var(--b3) / 0.7);
    animation: pan-dots 60s linear infinite reverse;
    will-change: background-position;
}

@keyframes pan-dots {
    0% { background-position: 0% 0%; }
    100% { background-position: 15px 15px; }
}

.text-gradient {
    @apply bg-clip-text text-transparent;
    background-image: linear-gradient(90deg, var(--color-primary), var(--color-secondary), var(--color-accent), var(--color-primary));
    background-size: 200% 100%;
    animation: gradient-flow 3s linear infinite;
}

@keyframes gradient-flow {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
}

.btn-404 {
    @apply inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-base-content/10 text-base-content/70 hover:text-base-content hover:border-base-content/30 bg-base-100/50 hover:bg-base-100/80 backdrop-blur-sm transition-all duration-200 text-sm font-medium;
}

.social-404 {
    @apply p-2 rounded-full text-base-content/40 hover:text-base-content hover:bg-base-content/5 transition-all duration-200;
}

.glass-card {
    @apply bg-base-100/60 backdrop-blur-xl border border-white/5 shadow-2xl;
    -webkit-backdrop-filter: blur(12px) saturate(140%);
    backdrop-filter: blur(12px) saturate(140%);
    border-color: rgba(255, 255, 255, 0.06);
    transition: all 0.3s ease-out;
}

.glass-card:hover {
    transform: none !important;
    box-shadow: none !important;
}

.glass-card::before {
    display: none !important;
}

@keyframes pop-in {
    0% { opacity: 0; transform: translateY(8px) scale(0.995); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
}

.smooth-appear {
    animation: pop-in 560ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@media (prefers-reduced-motion: reduce) {
    .pattern-dots { animation: none !important; }
    .smooth-appear { animation: none !important; opacity: 1 !important; }
}
</style>

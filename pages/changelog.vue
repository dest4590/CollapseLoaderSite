<script setup lang="ts">
import { GitCommit, ArrowLeft, RefreshCw, ExternalLink } from 'lucide-vue-next';
import { useGitHubCommits } from '~/composables/useGitHubCommits';

const { t } = useI18n();
const localePath = useLocalePath();
const { isDark } = useTheme();

const { mainCommits, devCommits, mainLoading, devLoading, mainError, devError, fetchAll } = useGitHubCommits('dest4590/CollapseLoader');

const activeTab = ref<'main' | 'dev'>('main');

onMounted(() => fetchAll());

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

const shortSha = (sha: string) => sha.slice(0, 7);

const commitTitle = (message: string) => message.split('\n')[0];
const commitBody = (message: string) => message.split('\n').slice(1).join('\n').trim();

const onCardMouseMove = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    target.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    target.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
};

const heroTitleChars = computed(() => {
    const title = typeof t('changelog.title') === 'string' ? t('changelog.title') : 'Changelog';
    return Array.from(title);
});

useSeoMeta({
    title: () => `${t('changelog.title')} – CollapseLoader`,
    description: () => t('changelog.subtitle'),
});
</script>

<template>
    <div class="clients-page min-h-screen relative overflow-x-hidden">
        <AppHeader hide-nav />

        <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div class="absolute inset-0 clients-hero-gradient opacity-50"></div>
            <div class="absolute inset-0 clients-dots opacity-30"></div>
            <div class="absolute inset-0 hero-ken-bg opacity-25"></div>
            <div class="absolute inset-0 hero-radial-accent pointer-events-none"></div>
        </div>

        <div class="max-w-4xl mx-auto relative z-10 pt-28 pb-24 px-4 sm:px-6">
            <NuxtLink
                :to="localePath('/')"
                class="inline-flex items-center gap-2 mb-10 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 hover:opacity-70"
                :class="isDark ? 'bg-white/5 border-white/10 text-base-content/50' : 'bg-black/5 border-black/10 text-base-content/50'"
            >
                <ArrowLeft class="w-4 h-4" />
                <span>{{ t('back') }}</span>
            </NuxtLink>

            <div class="flex items-start justify-between gap-4 mb-10 flex-wrap">
                <div>
                    <h1
                        class="text-5xl md:text-6xl font-black mb-2 tracking-tight changelog-title"
                        :style="{ fontFamily: '\'Kind Sans\', sans-serif' }"
                    >
                        <span
                            v-for="(ch, idx) in heroTitleChars"
                            :key="idx"
                            class="hero-char"
                            :style="{ '--d': (idx * 35) + 'ms' }"
                        >{{ ch === ' ' ? ' ' : ch }}</span>
                    </h1>
                    <p class="text-base-content/50">{{ t('changelog.subtitle') }}</p>
                </div>
                <button
                    @click="fetchAll"
                    class="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 hover:opacity-70"
                    :class="isDark ? 'bg-white/5 border-white/10 text-base-content/60' : 'bg-black/5 border-black/10 text-base-content/60'"
                >
                    <RefreshCw class="w-4 h-4" :class="(mainLoading || devLoading) ? 'animate-spin' : ''" />
                    {{ t('changelog.refresh') }}
                </button>
            </div>

            <div
                class="flex gap-1 p-1 rounded-xl mb-8 w-fit"
                :class="isDark ? 'bg-black/20' : 'bg-black/5'"
            >
                <button
                    @click="activeTab = 'main'"
                    class="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200"
                    :class="activeTab === 'main'
                        ? 'bg-primary text-primary-content'
                        : 'text-base-content/40 hover:text-base-content'"
                >
                    <GitCommit class="w-4 h-4" />
                    {{ t('changelog.branch_main') }}
                    <span
                        v-if="mainCommits.length"
                        class="text-[10px] px-1.5 py-0.5 rounded-md"
                        :class="activeTab === 'main' ? 'bg-black/15' : 'bg-base-content/8'"
                    >{{ mainCommits.length }}</span>
                </button>
                <button
                    @click="activeTab = 'dev'"
                    class="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200"
                    :class="activeTab === 'dev'
                        ? 'bg-primary text-primary-content'
                        : 'text-base-content/40 hover:text-base-content'"
                >
                    <GitCommit class="w-4 h-4" />
                    {{ t('changelog.branch_dev') }}
                    <span
                        v-if="devCommits.length"
                        class="text-[10px] px-1.5 py-0.5 rounded-md"
                        :class="activeTab === 'dev' ? 'bg-black/15' : 'bg-base-content/8'"
                    >{{ devCommits.length }}</span>
                </button>
            </div>

            <div v-if="activeTab === 'main'">
                <div v-if="mainLoading" class="flex items-center justify-center py-24">
                    <RefreshCw class="w-6 h-6 text-base-content/30 animate-spin" />
                </div>
                <div v-else-if="mainError" class="text-center py-24 text-base-content/40">{{ mainError }}</div>
                <div v-else class="space-y-2">
                    <a
                        v-for="(commit, idx) in mainCommits"
                        :key="commit.sha"
                        :href="commit.html_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="commit-card group"
                        :class="isDark ? 'bg-base-100/50 border-white/6 hover:bg-base-100/80 hover:border-white/12' : 'bg-white/70 border-black/6 hover:bg-white hover:border-black/10'"
                        :style="{ animationDelay: `${idx * 40}ms`, '--i': idx }"
                        @mousemove="onCardMouseMove"
                    >
                        <div class="flex items-start gap-4">
                            <img
                                v-if="commit.author?.avatar_url"
                                :src="commit.author.avatar_url"
                                :alt="commit.author.login"
                                class="w-8 h-8 rounded-full shrink-0 mt-0.5"
                            />
                            <div v-else class="w-8 h-8 rounded-full shrink-0 mt-0.5 flex items-center justify-center" :class="isDark ? 'bg-white/10' : 'bg-black/10'">
                                <GitCommit class="w-4 h-4 text-base-content/30" />
                            </div>

                            <div class="flex-1 min-w-0">
                                <p class="font-semibold text-base-content text-sm leading-snug mb-1 truncate">
                                    {{ commitTitle(commit.commit.message) }}
                                </p>
                                <p v-if="commitBody(commit.commit.message)" class="text-xs text-base-content/40 mb-2 line-clamp-2">
                                    {{ commitBody(commit.commit.message) }}
                                </p>
                                <div class="flex items-center gap-3 text-xs text-base-content/40">
                                    <span class="font-medium text-base-content/60">{{ commit.author?.login || commit.commit.author.name }}</span>
                                    <span>{{ formatDate(commit.commit.author.date) }}</span>
                                    <span>{{ formatTime(commit.commit.author.date) }}</span>
                                </div>
                            </div>

                            <div class="flex items-center gap-2 shrink-0">
                                <code class="text-[11px] font-mono px-2 py-1 rounded-lg text-base-content/40" :class="isDark ? 'bg-white/5' : 'bg-black/5'">
                                    {{ shortSha(commit.sha) }}
                                </code>
                                <ExternalLink class="w-3.5 h-3.5 text-base-content/20 group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            <div v-if="activeTab === 'dev'">
                <div v-if="devLoading" class="flex items-center justify-center py-24">
                    <RefreshCw class="w-6 h-6 text-base-content/30 animate-spin" />
                </div>
                <div v-else-if="devError" class="text-center py-24 text-base-content/40">{{ devError }}</div>
                <div v-else-if="devCommits.length === 0" class="text-center py-24 text-base-content/40">
                    {{ t('changelog.no_commits') }}
                </div>
                <div v-else class="space-y-2">
                    <a
                        v-for="(commit, idx) in devCommits"
                        :key="commit.sha"
                        :href="commit.html_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="commit-card group"
                        :class="isDark ? 'bg-base-100/50 border-white/6 hover:bg-base-100/80 hover:border-white/12' : 'bg-white/70 border-black/6 hover:bg-white hover:border-black/10'"
                        :style="{ animationDelay: `${idx * 40}ms`, '--i': idx }"
                        @mousemove="onCardMouseMove"
                    >
                        <div class="flex items-start gap-4">
                            <img
                                v-if="commit.author?.avatar_url"
                                :src="commit.author.avatar_url"
                                :alt="commit.author.login"
                                class="w-8 h-8 rounded-full shrink-0 mt-0.5"
                            />
                            <div v-else class="w-8 h-8 rounded-full shrink-0 mt-0.5 flex items-center justify-center" :class="isDark ? 'bg-white/10' : 'bg-black/10'">
                                <GitCommit class="w-4 h-4 text-base-content/30" />
                            </div>

                            <div class="flex-1 min-w-0">
                                <p class="font-semibold text-base-content text-sm leading-snug mb-1 truncate">
                                    {{ commitTitle(commit.commit.message) }}
                                </p>
                                <p v-if="commitBody(commit.commit.message)" class="text-xs text-base-content/40 mb-2 line-clamp-2">
                                    {{ commitBody(commit.commit.message) }}
                                </p>
                                <div class="flex items-center gap-3 text-xs text-base-content/40">
                                    <span class="font-medium text-base-content/60">{{ commit.author?.login || commit.commit.author.name }}</span>
                                    <span>{{ formatDate(commit.commit.author.date) }}</span>
                                    <span>{{ formatTime(commit.commit.author.date) }}</span>
                                </div>
                            </div>

                            <div class="flex items-center gap-2 shrink-0">
                                <code class="text-[11px] font-mono px-2 py-1 rounded-lg text-base-content/40" :class="isDark ? 'bg-white/5' : 'bg-black/5'">
                                    {{ shortSha(commit.sha) }}
                                </code>
                                <ExternalLink class="w-3.5 h-3.5 text-base-content/20 group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference "~/assets/style.css";

.commit-card {
    @apply block rounded-xl p-4 border transition-all duration-300;
    animation: commit-appear 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(var(--i, 0) * 40ms);
    position: relative;
    overflow: hidden;
    isolation: isolate;
}

.commit-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
        400px circle at var(--mx, 50%) var(--my, 50%),
        hsl(var(--p) / 0.16),
        transparent 55%
    );
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
    z-index: -1;
}

.commit-card:hover::before {
    opacity: 1;
}

@keyframes commit-appear {
    from {
        opacity: 0;
        transform: translateY(14px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.changelog-title {
    background: linear-gradient(110deg, hsl(var(--bc)) 0%, hsl(var(--bc)) 35%, hsl(var(--p)) 50%, hsl(var(--bc)) 65%, hsl(var(--bc)) 100%);
    background-size: 220% 100%;
    background-position: 0% center;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    animation: gradientShiftTitle 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes gradientShiftTitle {
    0%   { background-position: 0% center; }
    50%  { background-position: 100% center; }
    100% { background-position: 0% center; }
}

.hero-char {
    display: inline-block;
    opacity: 0;
    transform: translateY(10px) scale(0.92);
    filter: blur(8px);
    animation: charReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    animation-delay: var(--d, 0ms);
    will-change: opacity, transform, filter;
}

@keyframes charReveal {
    0%   { opacity: 0; filter: blur(10px); transform: translateY(12px) scale(0.86); }
    60%  { filter: blur(2px); }
    100% { opacity: 1; filter: blur(0);   transform: translateY(0)    scale(1); }
}

.hero-ken-bg {
    background:
        radial-gradient(ellipse at 25% 30%, hsl(var(--p) / 0.5) 0%, transparent 45%),
        radial-gradient(ellipse at 75% 70%, hsl(var(--s) / 0.4) 0%, transparent 45%),
        radial-gradient(ellipse at 50% 50%, hsl(var(--a) / 0.3) 0%, transparent 60%);
    filter: blur(70px) saturate(1.4);
    animation: heroKen 30s ease-in-out infinite alternate;
    will-change: transform;
}

@keyframes heroKen {
    0%   { transform: scale(1) rotate(0deg); }
    100% { transform: scale(1.1) rotate(-1.5deg); }
}

.hero-radial-accent {
    background: radial-gradient(
        circle at 50% 0%,
        hsl(var(--p) / 0.15),
        transparent 50%
    );
}
</style>

<style>
.clients-page {
    background-color: var(--color-base-200);
}

.clients-hero-gradient {
    background:
        radial-gradient(ellipse at 50% 0%, oklch(98% 0.003 247.858 / 0.1), transparent 60%),
        radial-gradient(ellipse at 0% 100%, oklch(60% 0 0 / 0.08), transparent 70%),
        radial-gradient(ellipse at 100% 100%, oklch(60% 0 0 / 0.08), transparent 70%);
}

.clients-dots {
    background-image: radial-gradient(oklch(60% 0 0 / 0.7) 0.7px, transparent 0.7px);
    background-size: 15px 15px;
    animation: pan-dots 60s linear infinite reverse;
    will-change: background-position;
}

@keyframes pan-dots {
    0% { background-position: 0% 0%; }
    100% { background-position: 15px 15px; }
}
</style>

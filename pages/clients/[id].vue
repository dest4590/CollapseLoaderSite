<script setup lang="ts">
import { Play, Download, ArrowLeft, ShieldCheck, Github, Star, Zap } from 'lucide-vue-next';
import useClients from '~/composables/useClients';
import { useTheme } from '~/composables/useTheme';

const route = useRoute();
const clientId = route.params.id as string;
const requestUrl = useRequestURL();
const canonicalUrl = computed(() => `${requestUrl.origin}${route.path}`);

const { t } = useI18n();
const localePath = useLocalePath();
const { isDark } = useTheme();
const { all, fetchClients } = useClients();

const clientInfo = computed(() => {
    const allClients = all.value ?? [];
    return allClients.find((c: any) => c?.id?.toString() === clientId.toString()) ?? null;
});

const client = computed(() => clientInfo.value ?? null);

const description = computed(() =>
    t('clients.detail.description_template', {
        name: client.value?.name,
        version: client.value?.version,
        type: client.value?.client_type,
    }),
);

useSeoMeta({
    title: () => `${client.value?.name || t('clients.loading')} – ${t('clients.detail.seo_title_suffix')}`,
    ogTitle: () => `${client.value?.name} – ${t('clients.detail.og_title_suffix')}`,
    description: () => description.value,
    ogDescription: () => description.value,
    keywords: () => `${client.value?.name}, minecraft ${client.value?.name}, ${client.value?.name} download, collapse loader`,
    ogType: 'website',
    ogUrl: () => canonicalUrl.value,
    twitterCard: 'summary_large_image',
    robots: 'index, follow',
});

useHead({
    link: [{ rel: 'canonical', href: canonicalUrl.value }],
});

if (!all.value || all.value.length === 0) {
    await fetchClients();
}

if (!clientInfo.value) {
    throw createError({ statusCode: 404, statusMessage: 'client not found' });
}

const launchClient = () => {
    if (client.value?.id) {
        window.location.href = `collapseloader://launch?client=${client.value.id}`;
    }
};
</script>

<template>
    <div v-if="client" class="min-h-screen bg-base-200">
        <AppHeader hide-nav />

        <div class="pt-28 pb-24 px-4 sm:px-6">
            <div class="max-w-5xl mx-auto">

                <NuxtLink
                    :to="localePath('/clients')"
                    class="inline-flex items-center gap-2 mb-10 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 hover:opacity-70"
                    :class="isDark ? 'bg-white/5 border-white/10 text-base-content/50' : 'bg-black/5 border-black/10 text-base-content/50'"
                >
                    <ArrowLeft class="w-4 h-4" />
                    <span>{{ t('clients.back_to_library') }}</span>
                </NuxtLink>

                <div class="grid lg:grid-cols-3 gap-6 items-start">

                    <div class="lg:col-span-2 space-y-6">
                        <div
                            class="rounded-2xl p-8 border"
                            :class="isDark ? 'bg-base-100/50 border-white/6' : 'bg-white/70 border-black/6'"
                        >
                            <div class="flex flex-wrap items-center gap-2 mb-6">
                                <span class="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-primary/10 text-primary">
                                    {{ client?.client_type || 'Client' }}
                                </span>
                                <span
                                    v-if="clientInfo?.working"
                                    class="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg text-emerald-500"
                                    :class="isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/8'"
                                >
                                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Working
                                </span>
                            </div>

                            <h1
                                class="text-5xl md:text-6xl font-black text-base-content tracking-tight mb-2"
                                :style="{ fontFamily: '\'Kind Sans\', sans-serif' }"
                            >{{ client?.name }}</h1>
                            <p class="text-base-content/40 text-sm">
                                {{ t('clients.detail.description_paragraph', { version: client?.version, type: client?.client_type }) }}
                            </p>
                        </div>

                        <div class="grid grid-cols-3 gap-3">
                            <div
                                v-for="stat in [
                                    { label: t('clients.detail.stats.downloads'), value: clientInfo?.downloads ?? '—', icon: Download },
                                    { label: t('clients.detail.stats.version'), value: clientInfo?.version, icon: ShieldCheck },
                                    { label: t('clients.detail.stats.status'), value: clientInfo?.working ? t('clients.detail.status_ok') : t('clients.detail.status_error'), icon: Zap },
                                ]"
                                :key="stat.label"
                                class="rounded-2xl p-5 border"
                                :class="isDark ? 'bg-base-100/50 border-white/6' : 'bg-white/70 border-black/6'"
                            >
                                <component :is="stat.icon" class="w-4 h-4 text-primary mb-3" />
                                <div class="text-[10px] font-black uppercase tracking-widest text-base-content/30 mb-1">{{ stat.label }}</div>
                                <div class="text-lg font-black text-base-content">{{ stat.value }}</div>
                            </div>
                        </div>

                        <div
                            class="rounded-2xl p-6 border"
                            :class="isDark ? 'bg-base-100/50 border-white/6' : 'bg-white/70 border-black/6'"
                        >
                            <div class="flex items-center gap-3 mb-4">
                                <ShieldCheck class="w-5 h-5 text-primary" />
                                <h3 class="font-bold text-base-content">{{ t('clients.detail.safety') }}</h3>
                            </div>
                            <p class="text-sm text-base-content/50 leading-relaxed">{{ t('clients.detail.safety_desc') }}</p>
                        </div>

                        <div
                            class="rounded-2xl p-6 border"
                            :class="isDark ? 'bg-base-100/50 border-white/6' : 'bg-white/70 border-black/6'"
                        >
                            <div class="flex items-center gap-3 mb-4">
                                <Github class="w-5 h-5 text-base-content/40" />
                                <span class="text-sm text-base-content/50">Support the developers by starring CollapseLoader on GitHub.</span>
                            </div>
                            <a
                                href="https://github.com/dest4590/CollapseLoader"
                                target="_blank"
                                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all duration-200 hover:opacity-70"
                                :class="isDark ? 'bg-white/5 border-white/10 text-base-content' : 'bg-black/5 border-black/10 text-base-content'"
                            >
                                <Star class="w-4 h-4" />
                                Star on GitHub
                            </a>
                        </div>
                    </div>

                    <div class="lg:sticky lg:top-24 space-y-4">
                        <div
                            class="rounded-2xl p-6 border"
                            :class="isDark ? 'bg-base-100/50 border-primary/20' : 'bg-white/80 border-primary/15'"
                        >
                            <h3 class="text-xl font-black text-base-content mb-1">{{ t('clients.detail.launch') }}</h3>
                            <p class="text-xs text-base-content/40 mb-6">Ready to play? Launch directly via CollapseLoader.</p>

                            <button
                                @click="launchClient"
                                class="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-primary text-primary-content font-black text-base transition-all duration-200 hover:opacity-90 mb-4"
                            >
                                <Play class="w-5 h-5 fill-current" />
                                {{ t('clients.detail.launch_now') }}
                            </button>

                            <p class="text-xs text-center text-base-content/30">
                                <i18n-t keypath="clients.detail.download_loader_hint">
                                    <template #link>
                                        <NuxtLink
                                            :to="localePath('/') + '#downloads'"
                                            class="text-primary hover:underline underline-offset-2"
                                        >{{ t('clients.detail.main_page') }}</NuxtLink>
                                    </template>
                                </i18n-t>
                            </p>
                        </div>

                        <div
                            class="rounded-2xl p-5 border space-y-3"
                            :class="isDark ? 'bg-base-100/50 border-white/6' : 'bg-white/70 border-black/6'"
                        >
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-base-content/40">Platform</span>
                                <span class="font-bold text-base-content">Windows / Linux</span>
                            </div>
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-base-content/40">ID</span>
                                <span class="font-mono text-xs text-base-content/60">{{ client?.id }}</span>
                            </div>
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-base-content/40">Compatibility</span>
                                <span class="flex items-center gap-1.5 font-bold text-emerald-500 text-xs">
                                    <ShieldCheck class="w-3.5 h-3.5" /> Verified
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

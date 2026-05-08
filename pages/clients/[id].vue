<script setup lang="ts">
import {
    Play,
    Download,
    ArrowLeft,
    ShieldCheck,
    Github,
    Star,
} from 'lucide-vue-next';
import useClients from '~/composables/useClients';

const route = useRoute();
const clientId = route.params.id as string;
const requestUrl = useRequestURL();
const canonicalUrl = computed(() => `${requestUrl.origin}${route.path}`);

const { t } = useI18n();
const localePath = useLocalePath();
const { all, fetchClients } = useClients();

const clientRawDetailed = ref<{ success: boolean; data: any } | null>(null);
const clientDetailed = computed(() => clientRawDetailed.value?.data ?? null);

const clientInfo = computed(() => {
    const allClients = all.value ?? [];
    return (
        allClients.find(
            (c: any) => c?.id?.toString() === clientId.toString(),
        ) ?? null
    );
});

const client = computed(() => clientDetailed.value ?? clientInfo.value ?? null);

const description = computed(() =>
    t('clients.detail.description_template', {
        name: client.value?.name,
        version: client.value?.version,
        type: client.value?.client_type,
    }),
);

useSeoMeta({
    title: () =>
        `${client.value?.name || t('clients.loading')} – ${t('clients.detail.seo_title_suffix')}`,
    ogTitle: () =>
        `${client.value?.name} – ${t('clients.detail.og_title_suffix')}`,
    description: () => description.value,
    ogDescription: () => description.value,
    keywords: () =>
        `${client.value?.name}, minecraft ${client.value?.name}, ${client.value?.name} download, ${client.value?.name} minecraft client, collapse loader, minecraft hacks`,
    ogType: 'website',
    ogUrl: () => canonicalUrl.value,
    twitterCard: 'summary_large_image',
    twitterTitle: () =>
        `${client.value?.name} – ${t('clients.detail.og_title_suffix')}`,
    twitterDescription: () => description.value,
    robots: 'index, follow',
});

useHead({
    link: [
        {
            rel: 'canonical',
            href: canonicalUrl.value,
        },
    ],
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: client.value?.name,
                description: description.value,
                applicationCategory: 'GameApplication',
                operatingSystem: 'Windows, Linux',
                softwareVersion: client.value?.version,
                datePublished: '2026-02-20',
                dateModified: '2026-02-20',
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                },
            }),
        },
    ],
});

if (!all.value || all.value.length === 0) {
    await fetchClients();
}

const { data: fetchedDetailed, error } = await useFetch<{
    success: boolean;
    data: any;
}>(`https://atlas.collapseloader.org/api/v1/clients/${clientId}/detailed`);
clientRawDetailed.value = fetchedDetailed.value ?? null;

if (!clientDetailed.value && !clientInfo.value && !error.value) {
    throw createError({ statusCode: 404, statusMessage: 'client not found' });
}

const launchClient = () => {
    if (clientDetailed.value) {
        window.location.href = `collapseloader://launch?client=${clientDetailed.value.id}`;
    }
};
</script>

<template>
    <div
        v-if="client"
        class="bg-base-200 min-h-screen selection:bg-primary/30 pb-20 overflow-x-hidden"
    >
        <div class="relative min-h-[50vh] flex items-end overflow-hidden pb-12">
            <div class="absolute inset-0 z-0">
                <div class="absolute inset-0 bg-base-300"></div>
                <div
                    class="absolute inset-0 bg-linear-to-t from-base-200 via-base-200/40 to-transparent z-10"
                ></div>

                <div
                    class="absolute top-0 right-0 w-125 h-125 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60"
                ></div>
                <div
                    class="absolute bottom-0 left-0 w-100 h-100 bg-secondary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 opacity-40"
                ></div>

                <div
                    class="absolute inset-0 bg-grid-white/[0.02] mask-image-gradient-b"
                ></div>
            </div>

            <div class="container mx-auto px-6 relative z-20">
                <NuxtLink
                    :to="localePath('/clients')"
                    class="group inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all hover:bg-white/10"
                >
                    <ArrowLeft
                        class="w-4 h-4 transition-transform group-hover:-translate-x-1"
                    />
                    <span class="text-sm font-bold tracking-wide">{{
                        t('clients.back_to_library')
                    }}</span>
                </NuxtLink>

                <div
                    class="flex flex-col lg:flex-row lg:items-end justify-between gap-8"
                >
                    <div class="space-y-6 max-w-3xl">
                        <div class="flex flex-wrap items-center gap-3">
                            <span
                                class="badge badge-primary border-none font-bold uppercase tracking-wider px-3 py-1 text-[10px]"
                                >{{ client?.client_type || 'Client' }}</span
                            >
                            <span
                                v-if="clientInfo?.working"
                                class="badge badge-success badge-outline gap-1 px-3 py-1 text-[10px] font-bold"
                            >
                                <div
                                    class="w-1.5 h-1.5 rounded-full bg-success animate-pulse"
                                ></div>
                                WORKING
                            </span>
                        </div>

                        <h1
                            class="text-6xl md:text-8xl font-black text-white tracking-tight drop-shadow-2xl"
                        >
                            {{ client?.name }}
                        </h1>

                        <div class="flex flex-wrap items-center gap-6">
                            <div
                                class="flex items-center gap-3 px-4 py-2 bg-black/30 rounded-full backdrop-blur-md border border-white/5"
                            >
                                <ShieldCheck class="w-5 h-5 text-primary" />
                                <span class="font-bold text-white/90">{{
                                    client?.version
                                }}</span>
                            </div>
                            <div
                                class="text-white/40 font-mono text-sm tracking-widest uppercase"
                            >
                                ID: {{ client?.id }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container mx-auto px-6 -mt-6 relative z-30">
            <div class="grid lg:grid-cols-12 gap-8 items-start">
                <div class="lg:col-span-8 space-y-8">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div
                            v-for="stat in [
                                {
                                    l: t('clients.detail.stats.downloads'),
                                    v: clientInfo?.downloads,
                                    i: Download,
                                    color: 'text-blue-400',
                                    bg: 'bg-blue-400/10',
                                },
                                {
                                    l: t('clients.detail.stats.version'),
                                    v: clientInfo?.version,
                                    i: ShieldCheck,
                                    color: 'text-emerald-400',
                                    bg: 'bg-emerald-400/10',
                                },
                                {
                                    l: t('clients.detail.stats.status'),
                                    v: clientInfo?.working
                                        ? t('clients.detail.status_ok')
                                        : t('clients.detail.status_error'),
                                    i: ShieldCheck,
                                    color: clientInfo?.working
                                        ? 'text-green-400'
                                        : 'text-red-400',
                                    bg: clientInfo?.working
                                        ? 'bg-green-400/10'
                                        : 'bg-red-400/10',
                                },
                            ]"
                            :key="stat.l"
                            class="glass-card p-6 rounded-3xl border border-white/5 hover:border-primary/20 transition-all flex items-center gap-6 group"
                        >
                            <div
                                :class="`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform shadow-lg`"
                            >
                                <component :is="stat.i" class="w-7 h-7" />
                            </div>
                            <div>
                                <div
                                    class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1"
                                >
                                    {{ stat.l }}
                                </div>
                                <div
                                    class="text-xl font-bold tracking-tight text-white/90"
                                >
                                    {{ stat.v }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                    <div
                        class="glass-card rounded-[2.5rem] p-8 border border-primary/20 overflow-hidden group shadow-2xl relative"
                    >
                        <div
                            class="absolute inset-0 bg-primary/5 pointer-events-none opacity-50"
                        ></div>
                        <div
                            class="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 blur-[80px] rounded-full group-hover:bg-primary/30 transition-colors duration-700"
                        ></div>

                        <div class="relative z-10 space-y-8">
                            <div class="text-center space-y-2">
                                <h3 class="text-3xl font-black">
                                    {{ t('clients.detail.launch') }}
                                </h3>
                                <p class="text-sm text-white/40">
                                    Ready to play? Launch directly via
                                    CollapseLoader.
                                </p>
                            </div>

                            <button
                                @click="launchClient"
                                class="btn btn-primary btn-lg w-full rounded-2xl h-20 text-xl font-black group/btn overflow-hidden relative shadow-[0_0_50px_-12px_rgba(var(--color-primary),0.5)] hover:shadow-primary/40 transition-all border-none"
                            >
                                <div
                                    class="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"
                                ></div>
                                <div
                                    class="flex items-center justify-center gap-3 relative z-10"
                                >
                                    <Play class="fill-current w-6 h-6" />
                                    <span>{{
                                        t('clients.detail.launch_now')
                                    }}</span>
                                </div>
                            </button>

                            <p class="text-xs text-center text-white/30 px-4">
                                <i18n-t
                                    keypath="clients.detail.download_loader_hint"
                                >
                                    <template #link>
                                        <NuxtLink
                                            :to="localePath('/') + '#downloads'"
                                            class="text-primary hover:underline underline-offset-4 decoration-primary/30"
                                        >
                                            {{ t('clients.detail.main_page') }}
                                        </NuxtLink>
                                    </template>
                                </i18n-t>
                            </p>

                            <div
                                class="pt-6 border-t border-white/5 flex flex-col gap-4"
                            >
                                <div
                                    class="flex items-center justify-between text-sm"
                                >
                                    <span class="text-white/40">Platform</span>
                                    <span class="font-bold"
                                        >Windows / Linux</span
                                    >
                                </div>
                                <div
                                    class="flex items-center justify-between text-sm"
                                >
                                    <span class="text-white/40"
                                        >Compatibility</span
                                    >
                                    <span
                                        class="font-bold flex items-center gap-2 text-success"
                                    >
                                        <ShieldCheck class="w-4 h-4" /> Fully
                                        Verified
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="glass-card p-6 rounded-3xl border border-white/5 text-sm space-y-4"
                    >
                        <div class="flex items-center gap-3 text-white/60">
                            <Github class="w-5 h-5" />
                            <span
                                >Support the developers by giving CollapseLoader
                                a star.</span
                            >
                        </div>
                        <a
                            href="https://github.com/dest4590/CollapseLoader"
                            target="_blank"
                            class="btn"
                        >
                            <Star class="w-4 h-4" />
                            Star
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference "../../assets/style.css";

.mask-image-gradient-b {
    mask-image: linear-gradient(to bottom, black, transparent);
}

.bg-grid-white\/\[0\.02\] {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white' stroke-opacity='0.02'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E");
}
</style>

<script setup lang="ts">
import { ArrowLeft, RefreshCw, Plus, Server } from 'lucide-vue-next';

const { t } = useI18n();
const localePath = useLocalePath();
const { isDark } = useTheme();

const clients = ref<any[]>([]);
const latestClients = ref<any[]>([]);
const loading = ref(true);
const lastScan = ref('');
const activeTab = ref<'fabric' | 'forge' | 'default'>('fabric');

const fetchData = async () => {
    loading.value = true;
    try {
        const [clientsData, latestData] = await Promise.all([
            $fetch('/api/clients'),
            $fetch('/api/clients/changes'),
        ]);
        clients.value = (clientsData as any).clients || [];
        lastScan.value = (clientsData as any).lastScan || '';
        latestClients.value = (latestData as any).latest || [];
    } catch (err) {
        console.error('Failed to fetch client data:', err);
    } finally {
        loading.value = false;
    }
};

onMounted(() => fetchData());

const filteredClients = computed(() =>
    clients.value.filter((c: any) => c.client_type === activeTab.value),
);

const clientCounts = computed(() => ({
    fabric: clients.value.filter((c: any) => c.client_type === 'fabric').length,
    forge: clients.value.filter((c: any) => c.client_type === 'forge').length,
    default: clients.value.filter((c: any) => c.client_type === 'default').length,
}));

const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

const typeLabel = (type: string) => {
    const map: Record<string, string> = {
        fabric: t('hfapi.fabric'),
        forge: t('hfapi.forge'),
        default: t('hfapi.default'),
    };
    return map[type] || type;
};

useSeoMeta({
    title: () => `HF API – CollapseLoader`,
    description: () => t('hfapi.subtitle'),
});
</script>

<template>
    <div class="clients-page min-h-screen relative overflow-x-hidden">
        <AppHeader hide-nav />

        <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div class="absolute inset-0 clients-hero-gradient opacity-50"></div>
            <div class="absolute inset-0 clients-dots opacity-30"></div>
        </div>

        <div class="max-w-5xl mx-auto relative z-10 pt-28 pb-24 px-4 sm:px-6">
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
                    <div class="flex items-center gap-3 mb-2">
                        <h1
                            class="text-5xl md:text-6xl font-black text-base-content tracking-tight"
                            :style="{ fontFamily: '\'Kind Sans\', sans-serif' }"
                        >HF API</h1>
                        <span
                            class="flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold"
                            :class="isDark ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-green-500/10 border-green-500/20 text-green-600'"
                        >
                            <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                            {{ t('hfapi.live') }}
                        </span>
                    </div>
                    <p class="text-base-content/50">{{ t('hfapi.subtitle') }}</p>
                    <p v-if="lastScan" class="text-xs text-base-content/30 mt-1">
                        {{ t('hfapi.last_scan') }}: {{ formatTime(lastScan) }}
                    </p>
                </div>
                <button
                    @click="fetchData"
                    class="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 hover:opacity-70"
                    :class="isDark ? 'bg-white/5 border-white/10 text-base-content/60' : 'bg-black/5 border-black/10 text-base-content/60'"
                >
                    <RefreshCw class="w-4 h-4" :class="loading ? 'animate-spin' : ''" />
                    {{ t('hfapi.refresh') }}
                </button>
            </div>

            <div v-if="loading" class="flex items-center justify-center py-24">
                <RefreshCw class="w-6 h-6 text-base-content/30 animate-spin" />
            </div>

            <template v-else>
                <div class="mb-12">
                    <h2 class="text-2xl font-bold text-base-content mb-4">{{ t('hfapi.latest_changes') }}</h2>
                    <div v-if="latestClients.length" class="space-y-2">
                        <div
                            v-for="(client, idx) in latestClients"
                            :key="client.md5_hash"
                            class="flex items-center gap-4 rounded-xl p-4 border transition-all duration-200"
                            :class="isDark ? 'bg-base-100/50 border-white/6 hover:border-white/12' : 'bg-white/70 border-black/6 hover:border-black/10'"
                            :style="{ animationDelay: `${idx * 40}ms` }"
                        >
                            <span
                                class="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border"
                                :class="{
                                    'bg-purple-500/10 border-purple-500/20 text-purple-400': client.client_type === 'fabric',
                                    'bg-orange-500/10 border-orange-500/20 text-orange-400': client.client_type === 'forge',
                                    'bg-blue-500/10 border-blue-500/20 text-blue-400': client.client_type === 'default',
                                }"
                            >{{ typeLabel(client.client_type) }}</span>
                            <div class="flex-1 min-w-0">
                                <span class="font-semibold text-base-content text-sm">{{ client.name }}</span>
                                <span class="text-xs text-base-content/40 ml-2">{{ client.version || '—' }}</span>
                            </div>
                            <code class="text-[11px] font-mono text-base-content/30 shrink-0 hidden sm:block">{{ client.md5_hash.slice(0, 10) }}</code>
                            <span class="text-xs text-base-content/30 shrink-0">{{ formatDate(client.created_at) }}</span>
                        </div>
                    </div>
                    <div v-else class="rounded-xl p-6 border text-center text-sm text-base-content/40" :class="isDark ? 'bg-base-100/30 border-white/5' : 'bg-white/50 border-black/5'">
                        {{ t('hfapi.no_changes') }}
                    </div>
                </div>

                <h2 class="text-2xl font-bold text-base-content mb-4">{{ t('hfapi.all_clients') }}</h2>

                <div
                    class="flex gap-1 p-1 rounded-xl mb-6 w-fit"
                    :class="isDark ? 'bg-black/20' : 'bg-black/5'"
                >
                    <button
                        v-for="tab in (['fabric', 'forge', 'default'] as const)"
                        :key="tab"
                        @click="activeTab = tab"
                        class="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 capitalize"
                        :class="activeTab === tab
                            ? 'bg-primary text-primary-content'
                            : 'text-base-content/40 hover:text-base-content'"
                    >
                        {{ typeLabel(tab) }}
                        <span
                            class="text-[10px] px-1.5 py-0.5 rounded-md"
                            :class="activeTab === tab ? 'bg-black/15' : 'bg-base-content/8'"
                        >{{ clientCounts[tab] }}</span>
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="text-left text-base-content/40 text-xs uppercase tracking-wider">
                                <th class="pb-3 pr-4 font-semibold">{{ t('hfapi.table_name') }}</th>
                                <th class="pb-3 pr-4 font-semibold">{{ t('hfapi.table_version') }}</th>
                                <th class="pb-3 pr-4 font-semibold">{{ t('hfapi.table_hash') }}</th>
                                <th class="pb-3 font-semibold hidden sm:table-cell">{{ t('hfapi.table_size') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="client in filteredClients"
                                :key="client.id"
                                class="border-t transition-colors"
                                :class="isDark ? 'border-white/5 hover:bg-white/[0.02]' : 'border-black/5 hover:bg-black/[0.02]'"
                            >
                                <td class="py-3 pr-4">
                                    <div class="flex items-center gap-2">
                                        <span class="font-semibold text-base-content">{{ client.name }}</span>
                                        <span
                                            v-if="!client.working"
                                            class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/20"
                                        >{{ t('hfapi.status_down') }}</span>
                                    </div>
                                </td>
                                <td class="py-3 pr-4">
                                    <span class="px-2 py-0.5 rounded-md text-xs font-medium" :class="isDark ? 'bg-white/5 text-base-content/60' : 'bg-black/5 text-base-content/60'">
                                        {{ client.version || '—' }}
                                    </span>
                                </td>
                                <td class="py-3 pr-4">
                                    <code class="text-xs font-mono text-base-content/40">{{ client.md5_hash }}</code>
                                </td>
                                <td class="py-3 hidden sm:table-cell">
                                    <span class="text-xs text-base-content/40">{{ client.size }} MB</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="mt-8 pt-6 border-t" :class="isDark ? 'border-white/5' : 'border-black/5'">
                    <div class="flex flex-wrap items-center gap-4 text-xs text-base-content/30">
                        <span>{{ t('hfapi.total') }}: <strong class="text-base-content/50">{{ clients.length }}</strong></span>
                        <span>{{ t('hfapi.fabric') }}: <strong class="text-base-content/50">{{ clientCounts.fabric }}</strong></span>
                        <span>{{ t('hfapi.forge') }}: <strong class="text-base-content/50">{{ clientCounts.forge }}</strong></span>
                        <span>{{ t('hfapi.default') }}: <strong class="text-base-content/50">{{ clientCounts.default }}</strong></span>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
@reference "~/assets/style.css";

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

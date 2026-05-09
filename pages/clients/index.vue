<script setup lang="ts">
import { Search, Layers, Zap, Cpu, Terminal, Play, ArrowRight } from 'lucide-vue-next';
import useClients from '~/composables/useClients';

const { t } = useI18n();
const localePath = useLocalePath();
const { isDark } = useTheme();

const { all, vanilla, fabric, forge, fetchClients } = useClients();

await fetchClients();

const activeTab = ref('all');
const searchQuery = ref('');

const tabs = [
    { id: 'all', label: computed(() => t('clients.tabs.all')), icon: Layers, count: computed(() => all.value?.length || 0) },
    { id: 'vanilla', label: computed(() => t('clients.tabs.vanilla')), icon: Terminal, count: computed(() => vanilla.value?.length || 0) },
    { id: 'fabric', label: computed(() => t('clients.tabs.fabric')), icon: Zap, count: computed(() => fabric.value?.length || 0) },
    { id: 'forge', label: computed(() => t('clients.tabs.forge')), icon: Cpu, count: computed(() => forge.value?.length || 0) },
];

const currentList = computed(() => {
    switch (activeTab.value) {
        case 'vanilla': return vanilla.value;
        case 'fabric': return fabric.value;
        case 'forge': return forge.value;
        default: return all.value;
    }
});

const filteredClients = computed(() => {
    const list = currentList.value ?? [];
    if (!searchQuery.value) return list;
    const q = searchQuery.value.toLowerCase();
    return list.filter(c => c.name.toLowerCase().includes(q) || c.version.toLowerCase().includes(q));
});

const launchClient = (client: any) => {
    if (client?.id) window.location.href = `collapseloader://launch?client=${client.id}`;
};

useSeoMeta({
    title: () => `${t('clients.seo_title')} | Discovery Hub`,
    description: () => t('clients.seo_desc'),
});
</script>

<template>
    <div class="clients-page min-h-screen relative overflow-x-hidden">
        <AppHeader hide-nav />

        <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div class="absolute inset-0 clients-hero-gradient opacity-50"></div>
            <div class="absolute inset-0 clients-dots opacity-30"></div>
        </div>

        <div class="max-w-7xl mx-auto relative z-10 pt-28 pb-24 px-4 sm:px-6">
            <header class="text-center mb-14">
                <NuxtLink
                    :to="localePath('/')"
                    class="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 hover:opacity-70"
                    :class="isDark
                        ? 'bg-white/5 border-white/10 text-base-content/50'
                        : 'bg-black/5 border-black/10 text-base-content/50'"
                >
                    <span>← {{ t('back') }}</span>
                </NuxtLink>

                <h1
                    class="text-5xl md:text-7xl font-black text-base-content mb-4 tracking-tight"
                    :style="{ fontFamily: '\'Kind Sans\', sans-serif' }"
                >
                    {{ t('clients.title') }}
                </h1>
                <p class="text-base-content/50 max-w-lg mx-auto text-lg mb-10">
                    {{ t('clients.subtitle') }}
                </p>

                <div class="max-w-3xl mx-auto">
                    <div
                        class="rounded-2xl p-2 flex flex-col md:flex-row gap-3 items-stretch md:items-center border"
                        :class="isDark ? 'bg-base-100/60 border-white/8' : 'bg-base-100/80 border-black/6'"
                    >
                        <div class="relative grow">
                            <input
                                v-model="searchQuery"
                                type="text"
                                :placeholder="t('search_clients')"
                                class="w-full pl-11 pr-4 h-11 rounded-xl bg-transparent border-none outline-none text-sm text-base-content placeholder:text-base-content/30 transition-all"
                            />
                            <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30 pointer-events-none" />
                        </div>

                        <div class="flex gap-1 p-1 rounded-xl" :class="isDark ? 'bg-black/20' : 'bg-black/5'">
                            <button
                                v-for="tab in tabs"
                                :key="tab.id"
                                @click="activeTab = tab.id"
                                class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200"
                                :class="activeTab === tab.id
                                    ? 'bg-primary text-primary-content shadow-sm'
                                    : 'text-base-content/40 hover:text-base-content hover:bg-base-content/5'"
                            >
                                <component :is="tab.icon" class="w-3.5 h-3.5" />
                                <span>{{ tab.label.value }}</span>
                                <span
                                    v-if="tab.count.value > 0"
                                    class="text-[10px] px-1.5 py-0.5 rounded-md"
                                    :class="activeTab === tab.id ? 'bg-black/15' : 'bg-base-content/8'"
                                >{{ tab.count.value }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div v-if="filteredClients.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <NuxtLink
                    v-for="client in filteredClients"
                    :key="client.id"
                    :to="localePath(`/clients/${client.id}`)"
                    class="group block rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg"
                    :class="isDark
                        ? 'bg-base-100/50 border-white/6 hover:bg-base-100/80 hover:border-white/12'
                        : 'bg-white/70 border-black/6 hover:bg-white hover:border-black/10 hover:shadow-black/8'"
                >
                    <div class="flex flex-col h-full gap-4">
                        <div class="flex items-start justify-between">
                            <span
                                class="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
                                :class="isDark ? 'bg-white/5 text-base-content/40' : 'bg-black/5 text-base-content/40'"
                            >{{ client.version }}</span>
                            <ArrowRight class="w-4 h-4 text-base-content/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
                        </div>

                        <div>
                            <h2 class="text-2xl font-black text-base-content tracking-tight mb-1">{{ client.name }}</h2>
                        </div>

                        <div class="flex flex-wrap items-center gap-2 mt-auto pt-2 border-t" :class="isDark ? 'border-white/5' : 'border-black/5'">
                            <span
                                class="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg text-primary"
                                :class="isDark ? 'bg-primary/10' : 'bg-primary/8'"
                            >{{ client.client_type }}</span>
                            <span
                                class="text-[10px] font-bold px-2.5 py-1 rounded-lg"
                                :class="isDark ? 'bg-white/5 text-base-content/30' : 'bg-black/5 text-base-content/30'"
                            >{{ client.launches }} {{ t('launches') }}</span>
                            <button
                                @click.stop.prevent="launchClient(client)"
                                :title="t('clients.detail.launch_now')"
                                class="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-content text-xs font-bold transition-all duration-200 hover:opacity-80"
                            >
                                <Play class="w-3 h-3 fill-current" />
                                <span>{{ t('clients.detail.launch') }}</span>
                            </button>
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <div
                v-else
                class="text-center py-32 rounded-2xl border border-dashed"
                :class="isDark ? 'border-white/10' : 'border-black/10'"
            >
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" :class="isDark ? 'bg-white/5' : 'bg-black/5'">
                    <Search class="w-6 h-6 text-base-content/20" />
                </div>
                <h3 class="text-xl font-bold text-base-content mb-2">{{ t('no_clients_found') }}</h3>
                <p class="text-base-content/40 text-sm mb-6">{{ t('clients.try_adjusting') }}</p>
                <button
                    @click="searchQuery = ''; activeTab = 'all';"
                    class="text-primary hover:opacity-70 font-bold text-sm transition-opacity"
                >{{ t('clients.clear_filters') }}</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
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

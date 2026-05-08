<script setup lang="ts">
import {
    Search,
    ArrowLeft,
    Layers,
    Zap,
    Cpu,
    Terminal,
    Play,
} from 'lucide-vue-next';
import useClients from '~/composables/useClients';

const { t } = useI18n();
const localePath = useLocalePath();

const { all, vanilla, fabric, forge, fetchClients } = useClients();

await fetchClients();

const activeTab = ref('all');
const searchQuery = ref('');

const tabs = [
    {
        id: 'all',
        label: computed(() => t('clients.tabs.all')),
        icon: Layers,
        count: computed(() => all.value?.length || 0),
    },
    {
        id: 'vanilla',
        label: computed(() => t('clients.tabs.vanilla')),
        icon: Terminal,
        count: computed(() => vanilla.value?.length || 0),
    },
    {
        id: 'fabric',
        label: computed(() => t('clients.tabs.fabric')),
        icon: Zap,
        count: computed(() => fabric.value?.length || 0),
    },
    {
        id: 'forge',
        label: computed(() => t('clients.tabs.forge')),
        icon: Cpu,
        count: computed(() => forge.value?.length || 0),
    },
];

const currentList = computed(() => {
    switch (activeTab.value) {
        case 'vanilla':
            return vanilla.value;
        case 'fabric':
            return fabric.value;
        case 'forge':
            return forge.value;
        default:
            return all.value;
    }
});

const filteredClients = computed(() => {
    const list = currentList.value ?? [];
    if (!searchQuery.value) return list;
    const q = searchQuery.value.toLowerCase();
    return list.filter(
        (c) =>
            c.name.toLowerCase().includes(q) ||
            c.version.toLowerCase().includes(q),
    );
});

const launchClient = (client: any) => {
    if (client?.id) {
        window.location.href = `collapseloader://launch?client=${client.id}`;
    }
};

useSeoMeta({
    title: () => `${t('clients.seo_title')} | Discovery Hub`,
    description: () => t('clients.seo_desc'),
});
</script>

<template>
    <div class="bg-base-200 min-h-screen pt-32 pb-32 px-6">
        <div class="max-w-7xl mx-auto relative z-10">
            <header class="text-center mb-16 relative">
                <NuxtLink
                    :to="localePath('/')"
                    class="inline-flex items-center gap-2 text-white/40 hover:text-white transition-all mb-8 group bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-2xl border border-white/5 hover:border-white/10"
                >
                    <ArrowLeft
                        class="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                    />
                    <span class="text-xs uppercase tracking-widest font-bold">{{
                        t('back')
                    }}</span>
                </NuxtLink>

                <h1
                    class="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
                >
                    {{ t('clients.title') }}
                </h1>

                <p
                    class="text-white/40 max-w-xl mx-auto text-lg mb-12 font-medium"
                >
                    {{ t('clients.subtitle') }}
                </p>

                <div class="max-w-4xl mx-auto">
                    <div
                        class="bg-white/5 border border-white/5 rounded-3xl p-3 flex flex-col md:flex-row gap-4 items-stretch md:items-center shadow-xl"
                    >
                        <div class="relative grow group">
                            <input
                                v-model="searchQuery"
                                type="text"
                                :placeholder="t('search_clients')"
                                class="input w-full pl-12 h-14 bg-white/5 border-none focus:bg-white/10 outline-none transition-all rounded-2xl text-base"
                            />
                            <Search
                                class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors pointer-events-none"
                            />
                        </div>

                        <div
                            class="flex p-1 bg-black/20 rounded-2xl overflow-x-auto whitespace-nowrap no-scrollbar"
                        >
                            <button
                                v-for="tab in tabs"
                                :key="tab.id"
                                @click="activeTab = tab.id"
                                :class="[
                                    'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300',
                                    activeTab === tab.id
                                        ? 'bg-primary text-primary-content'
                                        : 'text-white/40 hover:text-white hover:bg-white/5',
                                ]"
                            >
                                <component :is="tab.icon" class="w-4 h-4" />
                                <span>{{ tab.label.value }}</span>
                                <span
                                    v-if="tab.count.value > 0"
                                    class="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-md min-w-5 text-center"
                                    :class="
                                        activeTab === tab.id ? 'opacity-50' : ''
                                    "
                                >
                                    {{ tab.count.value }}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div
                v-if="filteredClients.length"
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <NuxtLink
                    v-for="(client, idx) in filteredClients"
                    :key="client.id"
                    :to="localePath(`/clients/${client.id}`)"
                    class="group block bg-white/5 border border-white/10 rounded-4xl p-8 transition-all hover:bg-white/10 hover:border-primary/20"
                >
                    <div class="flex flex-col h-full relative">
                        <div class="flex justify-between items-start mb-8">
                            <div
                                class="px-4 py-1.5 rounded-xl bg-white/5 border border-white/5 text-white/50 text-xs font-bold tracking-widest font-mono group-hover:text-primary transition-colors"
                            >
                                {{ client.version }}
                            </div>
                            <span>
                                <ArrowLeft
                                    class="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 rotate-180"
                                />
                            </span>
                        </div>

                        <h2
                            class="text-3xl font-bold mb-4 text-white tracking-tight"
                        >
                            {{ client.name }}
                        </h2>

                        <div class="flex flex-wrap gap-2 mt-auto items-center">
                            <span
                                class="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3.5 py-2 rounded-xl border border-primary/20"
                            >
                                {{ client.client_type }}
                            </span>
                            <span
                                class="bg-white/5 text-white/30 text-[10px] font-black uppercase tracking-widest px-3.5 py-2 rounded-xl border border-white/5"
                            >
                                {{ client.launches }} {{ t('launches') }}
                            </span>
                            <button
                                @click.stop.prevent="launchClient(client)"
                                :title="t('clients.detail.launch_now')"
                                class="ml-auto btn btn-primary btn-sm rounded-xl flex items-center gap-1 px-3 py-1.5 text-xs font-bold shadow hover:shadow-primary/30 transition-all"
                            >
                                <Play class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <div
                v-else
                class="text-center py-40 bg-white/5 rounded-[3rem] border border-dashed border-white/10"
            >
                <div
                    class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6"
                >
                    <Search class="w-8 h-8 opacity-20" />
                </div>
                <h3 class="text-2xl font-bold text-white mb-2">
                    {{ t('no_clients_found') }}
                </h3>
                <p class="text-white/30">{{ t('clients.try_adjusting') }}</p>
                <button
                    @click="
                        searchQuery = '';
                        activeTab = 'all';
                    "
                    class="mt-6 text-primary hover:underline font-bold text-sm"
                >
                    {{ t('clients.clear_filters') }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>

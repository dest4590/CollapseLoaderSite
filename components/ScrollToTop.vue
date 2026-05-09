<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ArrowUp } from 'lucide-vue-next';

const visible = ref(false);

const handleScroll = () => {
    visible.value = window.scrollY > 400;
};

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <Transition name="scroll-top">
        <button
            v-if="visible"
            @click="scrollToTop"
            aria-label="Scroll to top"
            class="fixed bottom-6 right-6 z-50 flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-base-100/80 backdrop-blur-xl text-base-content/60 hover:text-base-content hover:border-white/20 hover:bg-base-100/95 shadow-lg shadow-black/20 transition-all duration-200 hover:scale-110"
        >
            <ArrowUp class="w-4 h-4" />
        </button>
    </Transition>
</template>

<style scoped>
.scroll-top-enter-active {
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.scroll-top-leave-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.scroll-top-enter-from {
    opacity: 0;
    transform: translateY(12px) scale(0.85);
}

.scroll-top-leave-to {
    opacity: 0;
    transform: translateY(12px) scale(0.85);
}
</style>

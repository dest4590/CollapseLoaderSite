<script setup lang="ts">
import { onMounted } from 'vue';
import { Users, Settings, MessageCircle, MapPin, PackagePlus } from 'lucide-vue-next';

const { t, tm } = useI18n();

const getBadges = (path: string) => {
    const raw = tm(path);

    // If the translation is an array (message AST), map indexes to real translated strings
    if (Array.isArray(raw)) {
        return raw.map((_, i) => t(`${path}.${i}`));
    }

    // If translation returns an array directly via t, use it
    const maybeArray = t(path) as unknown;
    if (Array.isArray(maybeArray)) return maybeArray as string[];

    // Fallback: return a single translated string as an array
    return [t(path) as string];
};

onMounted(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    document
        .querySelectorAll('.animate-on-scroll')
        .forEach((el) => observer.observe(el));
});
</script>

<template>
    <section id="exclusive-features" class="py-32 bg-transparent relative">
        <div class="container mx-auto px-6 text-center relative z-10">
            <div class="max-w-4xl mx-auto mb-20">
                <h2 class="section-title animate-on-scroll anim-fade-up">
                    {{ t('features.title') }}
                </h2>
                <p class="section-subtitle animate-on-scroll anim-fade-up text-xl" style="--delay: 100ms">
                    {{ t('features.desc') }}
                </p>
            </div>
        </div>

        <div class="container mx-auto px-6 space-y-32 mt-16">
            <template v-if="false">
                <FeatureSection :title="t('features.cloud.title')" :description="t('features.cloud.desc')" :icon="Users"
                    :badges="getBadges('features.cloud.badges')" icon-color="primary" :delay="0" />
            </template>

            <FeatureSection :title="t('features.custom.title')" :description="t('features.custom.desc')"
                :icon="Settings" :badges="getBadges('features.custom.badges')" icon-color="primary" :reverse="true"
                :delay="0" />

            <template v-if="false">
                <FeatureSection :title="t('features.cord.title')" :description="t('features.cord.desc')" :icon="MapPin"
                    :badges="getBadges('features.cord.badges')" icon-color="primary" :delay="0" />
            </template>

            <FeatureSection :title="t('features.irc.title')" :description="t('features.irc.desc')" :icon="MessageCircle"
                :badges="getBadges('features.irc.badges')" icon-color="primary" :reverse="false" :delay="200" />

            <FeatureSection :title="t('features.custom_clients.title')" :description="t('features.custom_clients.desc')" :icon="PackagePlus"
                :badges="getBadges('features.custom_clients.badges')" icon-color="primary" :reverse="true" :delay="400" />
        </div>
    </section>
</template>

<style scoped>
@reference "../assets/style.css";

.section-title {
    @apply text-4xl md:text-5xl font-bold mb-4 text-center;
}

.section-subtitle {
    @apply text-lg text-base-content/70 mb-16 max-w-3xl mx-auto;
}

.animate-on-scroll {
    opacity: 0;
    transition: opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1),
        transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    transition-delay: var(--delay, 0ms);
}

.animate-on-scroll.anim-fade-up {
    transform: translateY(40px);
}

.animate-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0) translateX(0);
}
</style>

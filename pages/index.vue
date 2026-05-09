<script setup lang="ts">
import VanillaTilt from 'vanilla-tilt';
import { computed, onMounted, ref, watch } from 'vue';
import {
    BarChart,
    ChevronRight,
    Download,
    Github,
    Pyramid,
    Rocket,
    ShieldCheck,
    Unlock,
    Zap,
} from 'lucide-vue-next';

declare global {
    interface Window {
        Odometer: any;
    }
}

const { t } = useI18n();
const localePath = useLocalePath();
const { isDark } = useTheme();
const tiltElement = ref<HTMLElement | null>(null);
const analyticsRef = ref<HTMLElement | null>(null);
const isLinux = ref(false);

const {
    latestReleaseUrl,
    latestReleaseLoaded,
    latestPrereleaseUrl,
    latestPrereleaseLoaded,
    latestLinuxAppImageUrl,
    latestLinuxDebUrl,
    latestPreLinuxAppImageUrl,
    latestPreLinuxDebUrl,
    latestWindowsExeUrl,
    latestWindowsMsiUrl,
    latestWindowsSetupUrl,
    latestPreWindowsExeUrl,
    latestPreWindowsMsiUrl,
    latestPreWindowsSetupUrl,
} = useGitHubReleases('https://api.github.com/repos/dest4590/CollapseLoader');

const isWindows = computed(() => {
    if (import.meta.server) return false;
    return /windows/i.test(navigator.userAgent);
});
const releasesPage = 'https://github.com/dest4590/CollapseLoader/releases';
const latestHref = computed(() => {
    if (isLinux.value || isWindows.value) return releasesPage;
    return latestReleaseUrl.value || releasesPage;
});
const prereleaseHref = computed(() => {
    if (isLinux.value || isWindows.value) return releasesPage;
    return latestPrereleaseUrl.value || releasesPage;
});
const latestLinuxOptions = computed(() => {
    const options: Array<{ label: string; href: string }> = [];
    if (latestLinuxAppImageUrl.value)
        options.push({ label: 'AppImage', href: latestLinuxAppImageUrl.value });
    if (latestLinuxDebUrl.value)
        options.push({ label: 'Deb', href: latestLinuxDebUrl.value });
    return options;
});
const preLinuxOptions = computed(() => {
    const options: Array<{ label: string; href: string }> = [];
    if (latestPreLinuxAppImageUrl.value)
        options.push({ label: 'AppImage', href: latestPreLinuxAppImageUrl.value });
    if (latestPreLinuxDebUrl.value)
        options.push({ label: 'Deb', href: latestPreLinuxDebUrl.value });
    return options;
});
const latestWindowsOptions = computed(() => {
    const options: Array<{ label: string; href: string }> = [];
    if (latestWindowsExeUrl.value)
        options.push({ label: 'EXE', href: latestWindowsExeUrl.value });
    if (latestWindowsSetupUrl.value)
        options.push({ label: 'Setup', href: latestWindowsSetupUrl.value });
    if (latestWindowsMsiUrl.value)
        options.push({ label: 'MSI', href: latestWindowsMsiUrl.value });
    return options;
});
const preWindowsOptions = computed(() => {
    const options: Array<{ label: string; href: string }> = [];
    if (latestPreWindowsExeUrl.value)
        options.push({ label: 'EXE', href: latestPreWindowsExeUrl.value });
    if (latestPreWindowsSetupUrl.value)
        options.push({ label: 'Setup', href: latestPreWindowsSetupUrl.value });
    if (latestPreWindowsMsiUrl.value)
        options.push({ label: 'MSI', href: latestPreWindowsMsiUrl.value });
    return options;
});

const { totalLoaderLaunches, totalClientDownloads, totalClientLaunches } = useAnalytics();

function ensureOdometer(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') return reject();
        if ((window as any).Odometer) return resolve();
        const existing = document.querySelector('script[data-odometer-loader]');
        if (existing) {
            (existing as HTMLScriptElement).addEventListener('load', () => resolve());
            (existing as HTMLScriptElement).addEventListener('error', () => reject());
            return;
        }
        const s = document.createElement('script');
        s.setAttribute('data-odometer-loader', '1');
        s.src = '/scripts/odometer.min.js';
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject();
        document.head.appendChild(s);
    });
}

const loaderOdometer = ref<any>(null);
const downloadsOdometer = ref<any>(null);
const launchesOdometer = ref<any>(null);

onMounted(async () => {
    try {
        const ua = navigator?.userAgent || '';
        const pf = (navigator as any)?.platform || '';
        isLinux.value = /linux/i.test(ua) || /linux/i.test(pf);
    } catch (e) {
        isLinux.value = false;
    }

    if (tiltElement.value) {
        VanillaTilt.init(tiltElement.value, { max: 25, speed: 400, scale: 1.02 });
    }

    try {
        await ensureOdometer();
    } catch (e) {
        console.warn('Odometer script failed to load', e);
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    if (entry.target === analyticsRef.value) {
                        loaderOdometer.value = new window.Odometer({
                            el: document.querySelector('#loader-launches-odometer'),
                            value: 0, format: '(,ddd)', duration: 2000, theme: 'minimal',
                        });
                        loaderOdometer.value.update(totalLoaderLaunches.value);
                        downloadsOdometer.value = new window.Odometer({
                            el: document.querySelector('#client-downloads-odometer'),
                            value: 0, format: '(,ddd)', duration: 2000, theme: 'minimal',
                        });
                        downloadsOdometer.value.update(totalClientDownloads.value);
                        launchesOdometer.value = new window.Odometer({
                            el: document.querySelector('#client-launches-odometer'),
                            value: 0, format: '(,ddd)', duration: 2000, theme: 'minimal',
                        });
                        launchesOdometer.value.update(totalClientLaunches.value);
                        observer.unobserve(entry.target);
                    }
                    observer.unobserve(entry.target);
                }
            });
        },
        { root: null, rootMargin: '0px', threshold: 0.1 },
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    if (analyticsRef.value) observer.observe(analyticsRef.value);
});

watch(totalLoaderLaunches, (val) => { if (loaderOdometer.value) loaderOdometer.value.update(val); });
watch(totalClientDownloads, (val) => { if (downloadsOdometer.value) downloadsOdometer.value.update(val); });
watch(totalClientLaunches, (val) => { if (launchesOdometer.value) launchesOdometer.value.update(val); });
</script>

<template>
    <div class="bg-base-200 bg-grid-pattern overflow-x-hidden relative">
        <div class="absolute inset-0 pointer-events-none z-0">
            <div class="absolute inset-0 hero-gradient-bg opacity-50"></div>
            <div class="absolute inset-0 pattern-dots opacity-30"></div>
        </div>

        <ScrollProgress />
        <AppHeader />
        <ScrollToTop />

        <main class="relative z-10">
            <section ref="heroRef" class="hero min-h-screen relative overflow-hidden flex items-center pt-20">
                <div class="hero-content grid lg:grid-cols-2 gap-16 lg:gap-20 items-center w-full max-w-7xl mx-auto px-6 z-10 py-24 lg:py-0">
                    <div class="text-center lg:text-left space-y-6">
                        <div class="space-y-4">
                            <h1
                                class="text-5xl md:text-7xl font-extrabold text-primary mb-4 drop-shadow-xl relative animate-slide-in-up"
                                style="--stagger: 0; font-family: 'Kind Sans', sans-serif;"
                            >
                                {{ t('hero.title') }}
                            </h1>
                            <p
                                class="text-xl md:text-2xl mb-4 font-semibold text-base-content animate-slide-in-up"
                                style="--stagger: 1; font-family: 'Kind Sans Semibold', sans-serif;"
                            >
                                {{ t('hero.subtitle') }}
                            </p>
                            <p
                                class="text-lg text-base-content/80 mb-10 leading-relaxed animate-slide-in-up max-w-xl"
                                style="--stagger: 2"
                            >
                                {{ t('hero.desc') }}
                            </p>
                        </div>

                        <div class="flex flex-col gap-6 animate-slide-in-up w-fit" style="--stagger: 3">
                            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <a
                                    href="#downloads"
                                    class="btn btn-primary btn-lg shadow-xl transition-all duration-300 animate-cta-pulse group relative overflow-hidden"
                                >
                                    <span class="relative z-10 flex items-center gap-2">
                                        {{ t('hero.download') }}
                                        <ChevronRight class="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <div class="btn-shine"></div>
                                </a>
                                <a
                                    href="https://github.com/dest4590/CollapseLoader"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="ghost-btn"
                                >
                                    <span class="flex items-center gap-2">
                                        {{ t('hero.source') }}
                                        <Github class="h-5 w-5" />
                                    </span>
                                </a>
                            </div>
                            <div class="flex justify-center">
                                <NuxtLink
                                    :to="localePath('/clients')"
                                    class="ghost-btn"
                                >
                                    <span class="flex items-center gap-2">
                                        {{ t('hero.clients') }}
                                        <Pyramid class="h-5 w-5" />
                                    </span>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>

                    <div ref="tiltElement" class="showcase-wrapper relative" style="--stagger: 1">
                        <div class="showcase shadow-2xl hover:shadow-primary/20 group">
                            <img
                                :src="isDark ? '/img/background-dark.png' : '/img/background-light.png'"
                                alt="CollapseLoader background"
                                class="showcase-bg"
                            />
                            <img
                                :src="isDark ? '/img/foreground-dark.png' : '/img/foreground-light.png'"
                                alt="CollapseLoader foreground"
                                class="showcase-fg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" class="relative py-24">
                <div class="section-wave-divider-top"></div>
                <div class="bg-base-100 py-24">
                    <div class="container mx-auto px-6 text-center">
                        <div class="max-w-4xl mx-auto mb-20">
                            <h2 class="section-title animate-on-scroll anim-fade-up">{{ t('why.title') }}</h2>
                            <p class="section-subtitle animate-on-scroll anim-fade-up text-xl" style="--delay: 100ms">
                                {{ t('why.desc') }}
                            </p>
                        </div>
                        <div class="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                            <FeatureCard :title="t('why.open.title')" :description="t('why.open.desc')" :icon="Unlock" :delay="200" variant="primary" class="animate-on-scroll anim-scale-in" />
                            <FeatureCard :title="t('why.modern.title')" :description="t('why.modern.desc')" :icon="Zap" :delay="300" variant="secondary" class="animate-on-scroll anim-scale-in" />
                            <FeatureCard :title="t('why.safe.title')" :description="t('why.safe.desc')" :icon="ShieldCheck" :delay="400" variant="accent" class="animate-on-scroll anim-scale-in" />
                        </div>
                    </div>
                </div>
            </section>

            <section id="community" class="relative py-24 bg-base-100">
                <div class="container mx-auto px-6">
                    <div class="max-w-4xl mx-auto text-center mb-14">
                        <h2 class="section-title animate-on-scroll anim-fade-up">{{ t('community.title') }}</h2>
                        <p class="section-subtitle animate-on-scroll anim-fade-up" style="--delay: 100ms">{{ t('community.desc') }}</p>
                    </div>

                    <div class="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        <a
                            href="https://discord.com/invite/FyKtnFqs6J"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="community-card animate-on-scroll anim-scale-in group"
                            style="--delay: 150ms"
                        >
                            <div class="community-icon-wrap">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                </svg>
                            </div>
                            <h3 class="text-2xl font-bold text-base-content mt-4 mb-2">{{ t('community.discord_title') }}</h3>
                            <p class="text-base-content/60 text-sm leading-relaxed mb-6">{{ t('community.discord_desc') }}</p>
                            <span class="community-cta-btn">{{ t('community.discord_cta') }}</span>
                        </a>

                        <a
                            href="https://t.me/collapseloader"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="community-card animate-on-scroll anim-scale-in group"
                            style="--delay: 250ms"
                        >
                            <div class="community-icon-wrap">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                </svg>
                            </div>
                            <h3 class="text-2xl font-bold text-base-content mt-4 mb-2">{{ t('community.telegram_title') }}</h3>
                            <p class="text-base-content/60 text-sm leading-relaxed mb-6">{{ t('community.telegram_desc') }}</p>
                            <span class="community-cta-btn">{{ t('community.telegram_cta') }}</span>
                        </a>
                    </div>
                </div>
            </section>

            <ExclusiveFeatures />

            <section id="downloads" class="py-32 bg-base-200/95 backdrop-blur-sm relative">
                <div class="absolute inset-0 pointer-events-none z-0">
                    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-1/2 download-gradient-bg"></div>
                </div>
                <div class="container mx-auto px-6 text-center relative z-10">
                    <h2 class="section-title animate-on-scroll anim-fade-up">{{ t('download.title') }}</h2>
                    <p class="section-subtitle animate-on-scroll anim-fade-up" style="--delay: 100ms">{{ t('download.desc') }}</p>
                    <p v-if="isLinux" class="section-subtitle text-sm mt-2 text-base-content/70">
                        {{ t('download.aur_note', { pkg1: 'collapseloader-bin', pkg2: 'collapseloader-git' }) }}
                    </p>
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                        <DownloadCard
                            :icon="Rocket"
                            :title="t('download.latest')"
                            :description="t('download.latest_desc')"
                            :href="latestHref"
                            :cta-text="t('download.get_latest')"
                            :loading="!latestReleaseLoaded && !latestReleaseUrl"
                            variant="primary"
                            :delay="200"
                            :options="isLinux ? latestLinuxOptions : isWindows ? latestWindowsOptions : []"
                        />
                        <DownloadCard
                            :icon="Download"
                            :title="'Nightly'"
                            :description="t('download.nightly_desc')"
                            :href="prereleaseHref"
                            :cta-text="t('download.get_nightly')"
                            :loading="!latestPrereleaseLoaded && !latestPrereleaseUrl"
                            variant="secondary"
                            :delay="300"
                            :options="isLinux ? preLinuxOptions : isWindows ? preWindowsOptions : []"
                        />
                        <DownloadCard
                            :icon="Github"
                            :title="t('download.source_code')"
                            :description="t('download.source_code_desc')"
                            href="https://github.com/dest4590/CollapseLoader"
                            :cta-text="t('download.view_source')"
                            variant="accent"
                            :delay="400"
                        />
                    </div>
                </div>
            </section>
        </main>

        <footer class="footer footer-center px-4 py-8 sm:px-6 md:px-8 lg:p-10 bg-base-300 text-base-content relative">
            <div class="section-wave-divider-bottom" style="top: 0px; transform: translateY(-100%)"></div>
            <aside class="animate-on-scroll anim-fade-up text-center space-y-2 sm:space-y-3">
                <p class="text-xl sm:text-2xl font-bold text-primary">{{ t('brand') }}</p>
                <p class="text-sm sm:text-base leading-relaxed max-w-md mx-auto" v-html="t('footer.desc')"></p>
                <p class="text-xs sm:text-sm text-base-content/80">{{ t('footer.copyright') }}</p>
            </aside>
            <nav class="animate-on-scroll anim-fade-up mt-6 sm:mt-8" style="--delay: 100ms">
                <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                    <a href="https://github.com/dest4590/CollapseLoader/issues" target="_blank" rel="noopener noreferrer" class="link link-hover text-sm sm:text-base hover:text-primary transition-colors">{{ t('footer.issues') }}</a>
                    <div class="flex items-center gap-4">
                        <a href="https://discord.com/invite/FyKtnFqs6J" target="_blank" rel="noopener noreferrer" :aria-label="t('footer.discord')" class="hover:text-primary transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5 sm:h-6 sm:w-6">
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                            </svg>
                        </a>
                        <a href="https://t.me/collapseloader" target="_blank" rel="noopener noreferrer" :aria-label="t('footer.telegram')" class="hover:text-primary transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5 sm:h-6 sm:w-6">
                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                            </svg>
                        </a>
                        <a href="https://github.com/dest4590/CollapseLoader" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository" class="hover:text-primary transition-colors">
                            <Github class="h-5 w-5 sm:h-6 sm:w-6" />
                        </a>
                    </div>
                </div>
                <p class="text-xs sm:text-sm text-base-content/60 max-w-xs sm:max-w-sm mx-auto pt-4 sm:pt-6 leading-relaxed text-center">
                    {{ t('footer.not_affiliated') }}
                </p>
            </nav>
        </footer>
    </div>
</template>

<style scoped>
@reference "~/assets/style.css";

@keyframes slide-in-up {
    from { opacity: 0; transform: translateY(30px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

.animate-slide-in-up {
    animation: slide-in-up 0.7s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    animation-delay: calc(var(--stagger, 0) * 90ms);
    opacity: 0;
}

.animate-on-scroll {
    opacity: 0;
    will-change: opacity, transform;
    transition: opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1), transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    transition-delay: var(--delay, 0ms);
}

.animate-on-scroll.anim-fade-up { transform: translateY(40px); }
.animate-on-scroll.anim-fade-left { transform: translateX(-40px); }
.animate-on-scroll.anim-fade-right { transform: translateX(40px); }
.animate-on-scroll.anim-scale-in { transform: scale(0.9); }
.animate-on-scroll.is-visible { opacity: 1; transform: translateY(0) translateX(0) scale(1); }

.showcase-wrapper {
    position: relative;
    transform-style: preserve-3d;
    perspective: 1500px;
}

.showcase {
    transform-style: preserve-3d;
    border-radius: 0.75rem;
    will-change: transform;
    position: relative;
}

.showcase-bg {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 0.75rem;
    transition: opacity 0.4s ease;
}

.showcase-fg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 500ms cubic-bezier(0.23, 1, 0.32, 1), opacity 0.4s ease;
}

.showcase:hover .showcase-fg {
    transform: translateZ(40px) scale(1.03);
}

@keyframes cta-pulse {
    0% { box-shadow: 0 0 0 0 hsl(var(--p) / 0.5); }
    70% { box-shadow: 0 0 0 20px hsl(var(--p) / 0); }
    100% { box-shadow: 0 0 0 0 hsl(var(--p) / 0); }
}

.animate-cta-pulse {
    animation: cta-pulse 2.5s ease-out infinite;
    will-change: box-shadow;
}

.btn-shine {
    @apply absolute inset-0 opacity-0 transition-opacity duration-300;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transform: translateX(-100%);
    will-change: transform, opacity;
}

.btn:hover .btn-shine {
    @apply opacity-100;
    animation: btn-shine 0.8s ease-out;
}

@keyframes btn-shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

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

.download-gradient-bg {
    background: radial-gradient(ellipse at 50% 100%, hsl(var(--p) / 0.1), transparent 70%);
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

.ghost-btn {
    @apply inline-flex items-center gap-2 px-2 py-1 text-lg font-medium text-base-content/50 transition-all duration-250;
}

.ghost-btn:hover {
    @apply text-base-content;
    transform: translateY(-2px);
}

.community-card {
    @apply flex flex-col items-center text-center p-8 rounded-2xl border border-base-content/8 bg-base-200/60 backdrop-blur-sm transition-all duration-300;
    @apply hover:border-primary/20 hover:bg-base-200/90 hover:shadow-xl hover:-translate-y-1;
}

.community-icon-wrap {
    @apply w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-all duration-300;
}

.community-card:hover .community-icon-wrap {
    @apply bg-primary/15 scale-110;
}

.community-cta-btn {
    @apply mt-auto px-6 py-2.5 rounded-full bg-primary text-primary-content text-sm font-semibold transition-opacity duration-200;
}

.community-card:hover .community-cta-btn {
    @apply opacity-90;
}

.community-cta {
    @apply shrink-0 text-sm font-semibold text-primary opacity-60 group-hover:opacity-100 transition-opacity duration-200;
}

.feature-icon-wrapper { @apply relative; }

.nav-link {
    @apply relative after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-4/5;
}

.section-title { @apply text-4xl md:text-5xl font-bold mb-4 text-center; }
.section-subtitle { @apply text-lg text-base-content/70 mb-16 max-w-3xl mx-auto; }

.card-feature {
    @apply card bg-base-200 shadow-lg border border-transparent transition-all duration-400;
    @apply hover:shadow-2xl hover:border-primary/50 hover:bg-base-300;
    will-change: transform, box-shadow, border-color, background-color;
}

.card-icon {
    @apply rounded-lg p-4 transition-all duration-400 group-hover:scale-110;
    will-change: transform;
}

.section-wave-divider-top,
.section-wave-divider-bottom {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100px;
    background-color: hsl(var(--b1));
    z-index: 1;
    pointer-events: none;
}

.section-wave-divider-top { top: 0; }
.section-wave-divider-bottom { bottom: 0; }

.odometer {
    font-family: 'Kind Sans', sans-serif;
    line-height: 1.2;
}

.odometer.odometer-auto-theme,
.odometer.odometer-theme-minimal {
    @apply text-4xl font-extrabold text-base-content;
}

@media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }

    .animate-on-scroll,
    .animate-slide-in-up {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
    }

    .showcase:hover .showcase-front,
    .showcase:hover .showcase-front-2 {
        transform: none !important;
        transition: none !important;
    }

    .btn-shine { opacity: 0 !important; animation: none !important; }
    .bg-grid-pattern, .pattern-dots { animation: none !important; }
    .animate-cta-pulse, [data-vanilla-tilt] { transform: none !important; }
    .odometer { animation: none !important; transition: none !important; }
}
</style>

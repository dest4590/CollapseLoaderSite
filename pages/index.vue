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
        options.push({
            label: 'AppImage',
            href: latestPreLinuxAppImageUrl.value,
        });
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
        options.push({
            label: 'EXE',
            href: latestPreWindowsExeUrl.value,
        });
    if (latestPreWindowsSetupUrl.value)
        options.push({ label: 'Setup', href: latestPreWindowsSetupUrl.value });
    if (latestPreWindowsMsiUrl.value)
        options.push({ label: 'MSI', href: latestPreWindowsMsiUrl.value });
    return options;
});

const { totalLoaderLaunches, totalClientDownloads, totalClientLaunches } =
    useAnalytics();

function ensureOdometer(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') return reject();
        if ((window as any).Odometer) return resolve();
        const existing = document.querySelector('script[data-odometer-loader]');
        if (existing) {
            (existing as HTMLScriptElement).addEventListener('load', () =>
                resolve(),
            );
            (existing as HTMLScriptElement).addEventListener('error', () =>
                reject(),
            );
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
        VanillaTilt.init(tiltElement.value, {
            max: 25,
            speed: 400,
            scale: 1.02,
        });
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
                            el: document.querySelector(
                                '#loader-launches-odometer',
                            ),
                            value: 0,
                            format: '(,ddd)',
                            duration: 2000,
                            theme: 'minimal',
                        });
                        loaderOdometer.value.update(totalLoaderLaunches.value);

                        downloadsOdometer.value = new window.Odometer({
                            el: document.querySelector(
                                '#client-downloads-odometer',
                            ),
                            value: 0,
                            format: '(,ddd)',
                            duration: 2000,
                            theme: 'minimal',
                        });
                        downloadsOdometer.value.update(
                            totalClientDownloads.value,
                        );

                        launchesOdometer.value = new window.Odometer({
                            el: document.querySelector(
                                '#client-launches-odometer',
                            ),
                            value: 0,
                            format: '(,ddd)',
                            duration: 2000,
                            theme: 'minimal',
                        });
                        launchesOdometer.value.update(
                            totalClientLaunches.value,
                        );

                        observer.unobserve(entry.target);
                    }
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        },
    );

    document
        .querySelectorAll('.animate-on-scroll')
        .forEach((el) => observer.observe(el));

    if (analyticsRef.value) {
        observer.observe(analyticsRef.value);
    }
});

watch(totalLoaderLaunches, (val) => {
    if (loaderOdometer.value) {
        loaderOdometer.value.update(val);
    }
});
watch(totalClientDownloads, (val) => {
    if (downloadsOdometer.value) {
        downloadsOdometer.value.update(val);
    }
});
watch(totalClientLaunches, (val) => {
    if (launchesOdometer.value) {
        launchesOdometer.value.update(val);
    }
});
</script>

<template>
    <div class="bg-base-200 bg-grid-pattern overflow-x-hidden relative">
        <div class="absolute inset-0 pointer-events-none z-0">
            <div class="absolute inset-0 hero-gradient-bg opacity-50"></div>
            <div class="absolute inset-0 pattern-dots opacity-30"></div>
        </div>

        <ScrollProgress />
        <AppHeader />

        <main class="relative z-10">
            <section
                ref="heroRef"
                class="hero min-h-screen relative overflow-hidden flex items-center"
            >
                <div
                    class="hero-content grid lg:grid-cols-2 gap-16 lg:gap-20 items-center w-full max-w-7xl mx-auto px-6 z-10 py-24 lg:py-0"
                >
                    <div class="text-center lg:text-left space-y-6">
                        <div class="space-y-4">
                            <h1
                                class="text-5xl md:text-7xl font-extrabold text-primary mb-4 drop-shadow-xl relative animate-slide-in-up"
                                style="
                                    --stagger: 0;
                                    font-family: 'Kind Sans', sans-serif;
                                "
                            >
                                {{ t('hero.title') }}
                            </h1>
                            <p
                                class="text-xl md:text-2xl mb-4 font-semibold text-base-content animate-slide-in-up"
                                style="
                                    --stagger: 1;
                                    font-family:
                                        'Kind Sans Semibold', sans-serif;
                                "
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

                        <div
                            class="flex flex-col gap-6 animate-slide-in-up w-fit"
                            style="--stagger: 3"
                        >
                            <div
                                class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            >
                                <a
                                    href="#downloads"
                                    class="btn btn-primary btn-lg shadow-xl hover:scale-105 transition-all duration-300 animate-cta-pulse group relative overflow-hidden"
                                >
                                    <span
                                        class="relative z-10 flex items-center gap-2"
                                    >
                                        {{ t('hero.download') }}
                                        <ChevronRight
                                            class="h-6 w-6 group-hover:translate-x-1 transition-transform"
                                        />
                                    </span>
                                    <div class="btn-shine"></div>
                                </a>

                                <a
                                    href="https://github.com/dest4590/CollapseLoader"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="btn btn-ghost btn-lg hover:bg-base-content/10 hover:scale-105 transition-all duration-300 group border-2 border-transparent hover:border-primary/30"
                                >
                                    <span class="flex items-center gap-2">
                                        {{ t('hero.source') }}
                                        <Github
                                            class="h-6 w-6 transition-transform"
                                        />
                                    </span>
                                </a>
                            </div>
                            <div class="flex justify-center">
                                <NuxtLink
                                    :to="localePath('/clients')"
                                    class="btn btn-outline btn-lg hover:bg-base-content/10 hover:scale-105 transition-all duration-300 group border-2 border-transparent hover:border-primary/30"
                                >
                                    <span class="flex items-center gap-2">
                                        {{ t('hero.clients') }}
                                        <Pyramid
                                            class="h-6 w-6 transition-transform"
                                        />
                                    </span>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>

                    <div
                        ref="tiltElement"
                        class="showcase-wrapper relative"
                        style="--stagger: 1"
                    >
                        <div
                            class="showcase shadow-2xl hover:shadow-primary/20 group"
                        >
                            <div class="showcase-front"></div>
                            <div class="showcase-front-2"></div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" class="relative py-24">
                <div class="section-wave-divider-top"></div>
                <div class="bg-base-100 py-24">
                    <div class="container mx-auto px-6 text-center">
                        <div class="max-w-4xl mx-auto mb-20">
                            <h2
                                class="section-title animate-on-scroll anim-fade-up"
                            >
                                {{ t('why.title') }}
                            </h2>
                            <p
                                class="section-subtitle animate-on-scroll anim-fade-up text-xl"
                                style="--delay: 100ms"
                            >
                                {{ t('why.desc') }}
                            </p>
                        </div>

                        <div
                            class="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto"
                        >
                            <FeatureCard
                                :title="t('why.open.title')"
                                :description="t('why.open.desc')"
                                :icon="Unlock"
                                :delay="200"
                                variant="primary"
                                class="animate-on-scroll anim-scale-in"
                            />
                            <FeatureCard
                                :title="t('why.modern.title')"
                                :description="t('why.modern.desc')"
                                :icon="Zap"
                                :delay="300"
                                variant="secondary"
                                class="animate-on-scroll anim-scale-in"
                            />
                            <FeatureCard
                                :title="t('why.safe.title')"
                                :description="t('why.safe.desc')"
                                :icon="ShieldCheck"
                                :delay="400"
                                variant="accent"
                                class="animate-on-scroll anim-scale-in"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section id="community" class="relative py-24 bg-base-100">
                <div class="container mx-auto px-6 text-center">
                    <h2 class="section-title">
                        {{ t('community.title') }}
                    </h2>
                    <p class="section-subtitle">
                        {{ t('community.desc') }}
                    </p>

                    <div
                        class="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8"
                    >
                        <a
                            href="https://discord.com/invite/FyKtnFqs6J"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="card shadow-lg border border-primary/15 bg-base-200/60 backdrop-blur-sm"
                        >
                            <div class="card-body items-center text-center">
                                <div
                                    class="rounded-2xl p-4 bg-primary/10 text-primary"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        class="h-7 w-7"
                                    >
                                        <path
                                            d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
                                        />
                                    </svg>
                                </div>

                                <h3
                                    class="text-2xl font-bold text-primary mt-3"
                                >
                                    {{ t('community.discord_title') }}
                                </h3>
                                <p class="text-base-content/70">
                                    {{ t('community.discord_desc') }}
                                </p>

                                <div class="mt-5">
                                    <span class="btn btn-primary btn-wide">
                                        {{ t('community.discord_cta') }}
                                    </span>
                                </div>
                            </div>
                        </a>

                        <a
                            href="https://t.me/collapseloader"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="card shadow-lg border border-primary/15 bg-base-200/60 backdrop-blur-sm"
                        >
                            <div class="card-body items-center text-center">
                                <div
                                    class="rounded-2xl p-4 bg-primary/10 text-primary"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 240.1 240.1"
                                        class="h-7 w-7"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M54.3,118.8c35-15.2,58.3-25.3,70-30.2 c33.3-13.9,40.3-16.3,44.8-16.4c1,0,3.2,0.2,4.7,1.4c1.2,1,1.5,2.3,1.7,3.3s0.4,3.1,0.2,4.7c-1.8,19-9.6,65.1-13.6,86.3 c-1.7,9-5,12-8.2,12.3c-7,0.6-12.3-4.6-19-9c-10.6-6.9-16.5-11.2-26.8-18c-11.9-7.8-4.2-12.1,2.6-19.1c1.8-1.8,32.5-29.8,33.1-32.3 c0.1-0.3,0.1-1.5-0.6-2.1c-0.7-0.6-1.7-0.4-2.5-0.2c-1.1,0.2-17.9,11.4-50.6,33.5c-4.8,3.3-9.1,4.9-13,4.8 c-4.3-0.1-12.5-2.4-18.7-4.4c-7.5-2.4-13.5-3.7-13-7.9C45.7,123.3,48.7,121.1,54.3,118.8z"
                                        />
                                    </svg>
                                </div>

                                <h3
                                    class="text-2xl font-bold text-primary mt-3"
                                >
                                    {{ t('community.telegram_title') }}
                                </h3>
                                <p class="text-base-content/70">
                                    {{ t('community.telegram_desc') }}
                                </p>

                                <div class="mt-5">
                                    <span class="btn btn-primary btn-wide">
                                        {{ t('community.telegram_cta') }}
                                    </span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            <ExclusiveFeatures />

            <!-- <section
                id="analytics"
                ref="analyticsRef"
                class="relative py-24 bg-base-100"
            >
                <div class="container mx-auto px-6 text-center">
                    <h2 class="section-title animate-on-scroll anim-fade-up">
                        {{ t('analytics.title') }}
                    </h2>
                    <p
                        class="section-subtitle animate-on-scroll anim-fade-up"
                        style="--delay: 100ms"
                    >
                        {{ t('analytics.desc') }}
                    </p>
                    <div
                        class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16"
                    >
                        <div
                            class="card shadow-xl p-6 border border-primary/20 bg-primary/5 transition-all duration-300 animate-on-scroll anim-scale-in"
                            style="--delay: 200ms"
                        >
                            <div class="flex items-center justify-center mb-4">
                                <BarChart
                                    class="h-12 w-12 text-primary group-hover:scale-110 transition-transform"
                                />
                            </div>
                            <h3 class="text-2xl font-bold text-primary mb-2">
                                {{ t('analytics.loader_launches') }}
                            </h3>
                            <ClientOnly>
                                <p
                                    id="loader-launches-odometer"
                                    class="odometer text-4xl font-extrabold text-primary"
                                >
                                    0
                                </p>
                            </ClientOnly>
                            <p class="text-base-content/70 mt-2">
                                {{ t('analytics.loader_launches_desc') }}
                            </p>
                        </div>
                        <div
                            class="card shadow-xl p-6 border border-primary/20 bg-primary/5 transition-all duration-300 animate-on-scroll anim-scale-in"
                            style="--delay: 300ms"
                        >
                            <div class="flex items-center justify-center mb-4">
                                <Download
                                    class="h-12 w-12 text-primary group-hover:scale-110 transition-transform"
                                />
                            </div>
                            <h3 class="text-2xl font-bold text-primary mb-2">
                                {{ t('analytics.client_downloads') }}
                            </h3>
                            <ClientOnly>
                                <p
                                    id="client-downloads-odometer"
                                    class="odometer text-4xl font-extrabold text-primary"
                                >
                                    0
                                </p>
                            </ClientOnly>
                            <p class="text-base-content/70 mt-2">
                                {{ t('analytics.client_downloads_desc') }}
                            </p>
                        </div>
                        <div
                            class="card shadow-xl p-6 border border-primary/20 bg-primary/5 transition-all duration-300 animate-on-scroll anim-scale-in"
                            style="--delay: 400ms"
                        >
                            <div class="flex items-center justify-center mb-4">
                                <Rocket
                                    class="h-12 w-12 text-primary group-hover:scale-110 transition-transform"
                                />
                            </div>
                            <h3 class="text-2xl font-bold text-primary mb-2">
                                {{ t('analytics.client_launches') }}
                            </h3>
                            <ClientOnly>
                                <p
                                    id="client-launches-odometer"
                                    class="odometer text-4xl font-extrabold text-accent"
                                >
                                    0
                                </p>
                            </ClientOnly>
                            <p class="text-base-content/70 mt-2">
                                {{ t('analytics.client_launches_desc') }}
                            </p>
                        </div>
                    </div>
                </div>
            </section> -->

            <section
                id="downloads"
                class="py-32 bg-base-200/95 backdrop-blur-sm relative"
            >
                <div class="absolute inset-0 pointer-events-none z-0">
                    <div
                        class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-1/2 download-gradient-bg"
                    ></div>
                </div>

                <div class="container mx-auto px-6 text-center relative z-10">
                    <h2 class="section-title animate-on-scroll anim-fade-up">
                        {{ t('download.title') }}
                    </h2>
                    <p
                        class="section-subtitle animate-on-scroll anim-fade-up"
                        style="--delay: 100ms"
                    >
                        {{ t('download.desc') }}
                    </p>
                    <p
                        v-if="isLinux"
                        class="section-subtitle text-sm mt-2 text-base-content/70"
                    >
                        {{
                            t('download.aur_note', {
                                pkg1: 'collapseloader-bin',
                                pkg2: 'collapseloader-git',
                            })
                        }}
                    </p>
                    <div
                        class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
                    >
                        <DownloadCard
                            :icon="Rocket"
                            :title="t('download.latest')"
                            :description="t('download.latest_desc')"
                            :href="latestHref"
                            :cta-text="t('download.get_latest')"
                            :loading="!latestReleaseLoaded && !latestReleaseUrl"
                            variant="primary"
                            :delay="200"
                            :options="
                                isLinux
                                    ? latestLinuxOptions
                                    : isWindows
                                      ? latestWindowsOptions
                                      : []
                            "
                        />

                        <DownloadCard
                            :icon="Download"
                            :title="'Nightly'"
                            :description="t('download.nightly_desc')"
                            :href="prereleaseHref"
                            :cta-text="t('download.get_nightly')"
                            :loading="
                                !latestPrereleaseLoaded && !latestPrereleaseUrl
                            "
                            variant="secondary"
                            :delay="300"
                            :options="
                                isLinux
                                    ? preLinuxOptions
                                    : isWindows
                                      ? preWindowsOptions
                                      : []
                            "
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

        <footer
            class="footer footer-center px-4 py-8 sm:px-6 md:px-8 lg:p-10 bg-base-300 text-base-content relative"
        >
            <div
                class="section-wave-divider-bottom"
                style="top: 0px; transform: translateY(-100%)"
            ></div>
            <aside
                class="animate-on-scroll anim-fade-up text-center space-y-2 sm:space-y-3"
            >
                <p class="text-xl sm:text-2xl font-bold text-primary">
                    {{ t('brand') }}
                </p>
                <p
                    class="text-sm sm:text-base leading-relaxed max-w-md mx-auto"
                    v-html="t('footer.desc')"
                ></p>
                <p class="text-xs sm:text-sm text-base-content/80">
                    {{ t('footer.copyright') }}
                </p>
            </aside>
            <nav
                class="animate-on-scroll anim-fade-up mt-6 sm:mt-8"
                style="--delay: 100ms"
            >
                <div
                    class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                >
                    <a
                        href="https://github.com/dest4590/CollapseLoader/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="link link-hover text-sm sm:text-base hover:text-primary transition-colors"
                        >{{ t('footer.issues') }}</a
                    >
                    <div class="flex items-center gap-4">
                        <a
                            href="https://discord.com/invite/FyKtnFqs6J"
                            target="_blank"
                            rel="noopener noreferrer"
                            :aria-label="t('footer.discord')"
                            class="hover:text-primary transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                class="h-5 w-5 sm:h-6 sm:w-6"
                            >
                                <path
                                    d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
                                />
                            </svg>
                        </a>
                        <a
                            href="https://t.me/collapseloader"
                            target="_blank"
                            rel="noopener noreferrer"
                            :aria-label="t('footer.telegram')"
                            class="hover:text-primary transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 240.1 240.1"
                                class="h-5 w-5 sm:h-6 sm:w-6"
                                fill="currentColor"
                            >
                                <path
                                    d="M54.3,118.8c35-15.2,58.3-25.3,70-30.2 c33.3-13.9,40.3-16.3,44.8-16.4c1,0,3.2,0.2,4.7,1.4c1.2,1,1.5,2.3,1.7,3.3s0.4,3.1,0.2,4.7c-1.8,19-9.6,65.1-13.6,86.3 c-1.7,9-5,12-8.2,12.3c-7,0.6-12.3-4.6-19-9c-10.6-6.9-16.5-11.2-26.8-18c-11.9-7.8-4.2-12.1,2.6-19.1c1.8-1.8,32.5-29.8,33.1-32.3 c0.1-0.3,0.1-1.5-0.6-2.1c-0.7-0.6-1.7-0.4-2.5-0.2c-1.1,0.2-17.9,11.4-50.6,33.5c-4.8,3.3-9.1,4.9-13,4.8 c-4.3-0.1-12.5-2.4-18.7-4.4c-7.5-2.4-13.5-3.7-13-7.9C45.7,123.3,48.7,121.1,54.3,118.8z"
                                />
                            </svg>
                        </a>
                        <a
                            href="https://github.com/dest4590/CollapseLoader"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub Repository"
                            class="hover:text-primary transition-colors"
                        >
                            <Github class="h-5 w-5 sm:h-6 sm:w-6" />
                        </a>
                    </div>
                </div>
                <p
                    class="text-xs sm:text-sm text-base-content/60 max-w-xs sm:max-w-sm mx-auto pt-4 sm:pt-6 leading-relaxed text-center"
                >
                    {{ t('footer.not_affiliated') }}
                </p>
            </nav>
        </footer>
    </div>
</template>

<style scoped>
@reference "~/assets/style.css";

html {
    scroll-behavior: smooth;
    scroll-padding-top: 6rem;
}

@keyframes slide-in-up {
    from {
        opacity: 0;
        transform: translateY(30px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.animate-slide-in-up {
    animation: slide-in-up 0.7s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    animation-delay: calc(var(--stagger, 0) * 90ms);
    opacity: 0;
}

.animate-on-scroll {
    opacity: 0;
    will-change: opacity, transform;
    transition:
        opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1),
        transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    transition-delay: var(--delay, 0ms);
}

.animate-on-scroll.anim-fade-up {
    transform: translateY(40px);
}

.animate-on-scroll.anim-fade-left {
    transform: translateX(-40px);
}

.animate-on-scroll.anim-fade-right {
    transform: translateX(40px);
}

.animate-on-scroll.anim-scale-in {
    transform: scale(0.9);
}

.animate-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0) translateX(0) scale(1);
}

.showcase-wrapper {
    position: relative;
    transform-style: preserve-3d;
    perspective: 1500px;
}

.showcase {
    aspect-ratio: 16 / 9;
    background-image: url('~/assets/img/loader-back.png');
    background-size: cover;
    transform-style: preserve-3d;
    border-radius: 0.75rem;
    will-change: transform;
}

.showcase-front {
    position: absolute;
    background-image: url('~/assets/img/loader-front.png');
    width: 100%;
    height: 100%;
    background-size: cover;
    transition: transform 500ms cubic-bezier(0.23, 1, 0.32, 1);
}

.showcase-front-2 {
    position: absolute;
    background-image: url('~/assets/img/loader-front-2.png');
    width: 100%;
    height: 100%;
    background-size: cover;
    transition: transform 500ms cubic-bezier(0.23, 1, 0.32, 1);
}

.showcase:hover .showcase-front {
    transform: translateZ(40px) scale(1.03);
}

.showcase:hover .showcase-front-2 {
    transform: translateZ(60px) scale(1.05);
}

@keyframes icon-bounce {
    0%,
    100% {
        transform: translateY(0) rotate(0deg) scale(1);
    }

    30% {
        transform: translateY(-10px) rotate(-3deg) scale(1.02);
    }

    50% {
        transform: translateY(-15px) rotate(5deg) scale(1.05);
    }

    70% {
        transform: translateY(-8px) rotate(-2deg) scale(1.03);
    }

    90% {
        transform: translateY(-4px) rotate(1deg) scale(1.01);
    }
}

@keyframes icon-pulse-green {
    0%,
    100% {
        transform: scale(1);
        opacity: 1;
    }

    50% {
        transform: scale(1.1);
        opacity: 0.8;
    }
}

.animate-icon-pulse-green {
    animation: icon-pulse-green 2s ease-in-out infinite alternate;
}

@keyframes cta-pulse {
    0% {
        box-shadow: 0 0 0 0 hsl(var(--p) / 0.5);
    }

    70% {
        box-shadow: 0 0 0 20px hsl(var(--p) / 0);
    }

    100% {
        box-shadow: 0 0 0 0 hsl(var(--p) / 0);
    }
}

.animate-cta-pulse {
    animation: cta-pulse 2.5s ease-out infinite;
    will-change: box-shadow;
}

.btn-shine {
    @apply absolute inset-0 opacity-0 transition-opacity duration-300;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
    );
    transform: translateX(-100%);
    will-change: transform, opacity;
}

.btn:hover .btn-shine {
    @apply opacity-100;
    animation: btn-shine 0.8s ease-out;
}

@keyframes btn-shine {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(100%);
    }
}

.bg-grid-pattern {
    background-image:
        linear-gradient(rgb(var(--b3) / 0.5) 1px, transparent 1px),
        linear-gradient(to right, rgb(var(--b3) / 0.5) 1px, transparent 1px);
    background-size: 3rem 3rem;
}

.hero-gradient-bg {
    background:
        radial-gradient(
            ellipse at 50% 0%,
            hsl(var(--p) / 0.1),
            transparent 60%
        ),
        radial-gradient(
            ellipse at 0% 100%,
            hsl(var(--s) / 0.08),
            transparent 70%
        ),
        radial-gradient(
            ellipse at 100% 100%,
            hsl(var(--a) / 0.08),
            transparent 70%
        );
}

.download-gradient-bg {
    background: radial-gradient(
        ellipse at 50% 100%,
        hsl(var(--p) / 0.1),
        transparent 70%
    );
}

.pattern-dots {
    background-image: radial-gradient(currentColor 0.7px, transparent 0.7px);
    background-size: 15px 15px;
    color: hsl(var(--b3) / 0.7);
    animation: pan-dots 60s linear infinite reverse;
    will-change: background-position;
}

@keyframes pan-dots {
    0% {
        background-position: 0% 0%;
    }

    100% {
        background-position: 15px 15px;
    }
}

.feature-icon-wrapper {
    @apply relative;
}

.nav-link {
    @apply relative after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-4/5;
}

.section-title {
    @apply text-4xl md:text-5xl font-bold mb-4 text-center;
}

.section-subtitle {
    @apply text-lg text-base-content/70 mb-16 max-w-3xl mx-auto;
}

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

.section-wave-divider-top {
    top: 0;
}

.section-wave-divider-bottom {
    bottom: 0;
}

.section-wave-divider-bottom[style*='top: -1px'] {
    transform: translateY(-100%);
}

.section-wave-divider-top[style*='transform: scale-y(-1) rotate-180'] {
    bottom: 0;
    transform: scaleX(-1) scaleY(-1) rotate(180deg);
    height: 100px;
    background-color: hsl(var(--b1));
}

.odometer {
    font-family: 'Kind Sans', sans-serif;
    line-height: 1.2;
}

.odometer.odometer-auto-theme,
.odometer.odometer-theme-minimal {
    @apply text-4xl font-extrabold text-base-content;
}

@media (prefers-reduced-motion: reduce) {
    *,
    ::before,
    ::after {
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

    .showcase:hover .showcase-front {
        transform: none !important;
        transition: none !important;
    }

    .btn-shine {
        opacity: 0 !important;
        animation: none !important;
    }

    .bg-grid-pattern,
    .pattern-dots {
        animation: none !important;
    }

    .animate-cta-pulse,
    .group-hover\:animate-icon-bounce,
    .animate-icon-pulse-green,
    [data-vanilla-tilt] {
        transform: none !important;
    }

    .odometer {
        animation: none !important;
        transition: none !important;
    }
}
</style>

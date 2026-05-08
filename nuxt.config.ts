import tailwindcss from '@tailwindcss/vite';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    modules: [
        '@nuxtjs/i18n',
        '@nuxtjs/seo',
        ['nuxt-gtag', { id: 'G-EDZVJ6HR2K' }],
    ],
    sitemap: {
        sources: ['/api/__sitemap__/urls'],
    },
    css: ['~/assets/style.css'],
    app: {
        head: {
            title: 'CollapseLoader - Secure Open Source Minecraft Cheat Client Loader',
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1.0',
            htmlAttrs: {
                id: 'html-root',
            },
            link: [
                { rel: 'icon', href: '/favicon.ico' },
                {
                    rel: 'icon',
                    href: '/favicon.png',
                    type: 'image/png',
                    sizes: '512x512',
                },
                { rel: 'preconnect', href: 'https://api.github.com' },
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                {
                    rel: 'preconnect',
                    href: 'https://fonts.gstatic.com',
                    crossorigin: 'anonymous',
                },
                {
                    rel: 'stylesheet',
                    href: 'https://cdnjs.cloudflare.com/ajax/libs/odometer.js/0.4.8/themes/odometer-theme-minimal.css',
                },
            ],
            meta: [
                {
                    name: 'description',
                    content:
                        'The most secure and transparent Minecraft cheat client loader. Completely open-source with virus-checked clients. Built with Rust and Tauri for Windows and Linux.',
                },
                {
                    name: 'keywords',
                    content:
                        'minecraft, cheat, client, loader, open source, secure, rust, tauri, collapse loader, minecraft hacks, minecraft mods',
                },
                { name: 'author', content: 'CollapseLoader Team' },
                { name: 'robots', content: 'index, follow' },
                { name: 'theme-color', content: '#000000' },
                { property: 'og:type', content: 'website' },
                { property: 'og:url', content: 'https://collapseloader.org/' },
                {
                    property: 'og:title',
                    content:
                        'CollapseLoader - Secure Open Source Minecraft Cheat Client Loader',
                },
                {
                    property: 'og:description',
                    content:
                        'The most secure and transparent Minecraft cheat client loader. Completely open-source with virus-checked clients. Built with Rust and Tauri for Windows and Linux.',
                },
                {
                    property: 'og:image',
                    content: 'https://collapseloader.org/og-image.png',
                },
                { property: 'og:site_name', content: 'CollapseLoader' },
                { name: 'twitter:card', content: 'summary_large_image' },
                {
                    name: 'twitter:title',
                    content:
                        'CollapseLoader - Secure Open Source Minecraft Cheat Client Loader',
                },
                {
                    name: 'twitter:description',
                    content:
                        'The most secure and transparent Minecraft cheat client loader. Completely open-source with virus-checked clients. Built with Rust and Tauri for Windows and Linux.',
                },
                {
                    name: 'twitter:image',
                    content: 'https://collapseloader.org/og-image.png',
                },
            ],
            script: [
                {
                    src: 'https://cdnjs.cloudflare.com/ajax/libs/odometer.js/0.4.8/odometer.min.js',
                },
                {
                    type: 'application/ld+json',
                    innerHTML: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SoftwareApplication',
                        name: 'CollapseLoader',
                        description:
                            'The most secure and transparent Minecraft cheat client loader. Completely open-source with virus-checked clients.',
                        url: 'https://collapseloader.org',
                        applicationCategory: 'GameApplication',
                        operatingSystem: ['Windows', 'Linux'],
                        programmingLanguage: 'Rust',
                        license: 'Open Source',
                        author: {
                            '@type': 'Organization',
                            name: 'CollapseLoader Team',
                        },
                        offers: {
                            '@type': 'Offer',
                            price: '0',
                            priceCurrency: 'USD',
                        },
                        downloadUrl:
                            'https://github.com/dest4590/CollapseLoader/releases',
                        screenshot: 'https://collapseloader.org/og-image.png',
                        featureList: [
                            'Open Source',
                            'Virus-checked clients',
                            'Modern UI',
                            'Cloud sync',
                            'Custom themes',
                            'Discord integration',
                        ],
                    }),
                },
            ],
        },
    },
    vite: {
        plugins: [tailwindcss()],
        optimizeDeps: {
            include: [
                '@vue/devtools-core',
                '@vue/devtools-kit',
                'vanilla-tilt',
                'lucide-vue-next',
            ],
        },
    },
    i18n: {
        baseUrl: 'https://collapseloader.org',
        locales: [
            {
                code: 'en',
                language: 'en-US',
                name: 'English',
                file: 'en.json',
            },
            {
                code: 'ru',
                language: 'ru-RU',
                name: 'Русский',
                file: 'ru.json',
            },
        ],
        langDir: 'locales',
        defaultLocale: 'en',
        strategy: 'prefix_except_default',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            redirectOn: 'root',
        },
    },
    routeRules: {
        '/telegram': { redirect: 'https://t.me/CollapseLoader' },
        '/discord': { redirect: 'https://discord.gg/FyKtnFqs6J' },
    },
    ogImage: {
        zeroRuntime: true,
    },
    components: {
        dirs: [
            {
                path: '~/components',
                pathPrefix: false,
            },
        ],
    },
});

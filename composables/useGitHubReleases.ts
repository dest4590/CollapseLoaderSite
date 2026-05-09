import { ref, onMounted } from 'vue';

interface GitHubRelease {
    tag_name: string;
    name: string;
    prerelease: boolean;
    assets: Array<{
        browser_download_url: string;
        name: string;
    }>;
}

export function useGitHubReleases(repoUrl: string) {
    const latestReleaseUrl = ref<string>('');
    const latestReleaseLoaded = ref(false);
    const latestPrereleaseUrl = ref<string>('');
    const latestPrereleaseLoaded = ref(false);
    const error = ref<string | null>(null);

    const latestLinuxAppImageUrl = ref<string>('');
    const latestLinuxDebUrl = ref<string>('');
    const latestLinuxRpmUrl = ref<string>('');
    const latestPreLinuxAppImageUrl = ref<string>('');
    const latestPreLinuxDebUrl = ref<string>('');
    const latestPreLinuxRpmUrl = ref<string>('');

    const latestWindowsExeUrl = ref<string>('');
    const latestWindowsMsiUrl = ref<string>('');
    const latestWindowsSetupUrl = ref<string>('');
    const latestPreWindowsExeUrl = ref<string>('');
    const latestPreWindowsMsiUrl = ref<string>('');
    const latestPreWindowsSetupUrl = ref<string>('');

    const latestMacDmgUrl = ref<string>('');

    async function fetchJSON(url: string): Promise<any> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (err) {
            console.error('Error fetching JSON:', err);
            throw err;
        }
    }

    function pickLinuxAssets(assets: GitHubRelease['assets'] | undefined) {
        const result = { appImage: '', deb: '', rpm: '' };
        if (!assets) return result;
        for (const a of assets) {
            const name = a?.name?.toLowerCase?.() || '';
            if (!result.appImage && name.endsWith('.appimage')) result.appImage = a.browser_download_url;
            if (!result.deb && name.endsWith('.deb')) result.deb = a.browser_download_url;
            if (!result.rpm && name.endsWith('.rpm')) result.rpm = a.browser_download_url;
        }
        return result;
    }

    function pickWindowsAssets(assets: GitHubRelease['assets'] | undefined) {
        const result = {
            exe: '',
            msi: '',
            setup: '',
        };
        if (!assets) return result;
        for (const a of assets) {
            const name = a?.name?.toLowerCase?.() || '';
            if (name.endsWith('.exe')) {
                if (!result.setup && name.includes('setup')) {
                    result.setup = a.browser_download_url;
                } else if (!result.exe && !name.includes('setup')) {
                    result.exe = a.browser_download_url;
                }
            }
            if (!result.msi && name.endsWith('.msi')) {
                result.msi = a.browser_download_url;
            }
        }
        return result;
    }

    function pickMacAssets(assets: GitHubRelease['assets'] | undefined): string {
        if (!assets) return '';
        const dmg = assets.find(a => a?.name?.toLowerCase().endsWith('.dmg'));
        return dmg?.browser_download_url ?? '';
    }

    async function fetchLatestRelease(): Promise<void> {
        latestReleaseLoaded.value = false;
        try {
            const data: GitHubRelease = await fetchJSON(`${repoUrl}/releases/latest`);
            latestReleaseUrl.value = data?.assets?.[0]?.browser_download_url ?? '';
            const linux = pickLinuxAssets(data?.assets);
            latestLinuxAppImageUrl.value = linux.appImage;
            latestLinuxDebUrl.value = linux.deb;
            latestLinuxRpmUrl.value = linux.rpm;
            const windows = pickWindowsAssets(data?.assets);
            latestWindowsExeUrl.value = windows.exe;
            latestWindowsMsiUrl.value = windows.msi;
            latestWindowsSetupUrl.value = windows.setup;
            latestMacDmgUrl.value = pickMacAssets(data?.assets);
        } catch (err) {
            error.value = 'Failed to fetch latest release';
            console.error('Failed to fetch latest release:', err);
        } finally {
            latestReleaseLoaded.value = true;
        }
    }

    async function fetchLatestPrerelease(): Promise<void> {
        latestPrereleaseLoaded.value = false;
        try {
            const data: GitHubRelease[] = await fetchJSON(
                `${repoUrl}/releases`,
            );
            const latestPrerelease = Array.isArray(data)
                ? data.find((release) => release.prerelease)
                : null;
            latestPrereleaseUrl.value =
                latestPrerelease?.assets?.[0]?.browser_download_url ?? '';
            const linux = pickLinuxAssets(latestPrerelease?.assets);
            latestPreLinuxAppImageUrl.value = linux.appImage;
            latestPreLinuxDebUrl.value = linux.deb;
            latestPreLinuxRpmUrl.value = linux.rpm;
            const windows = pickWindowsAssets(latestPrerelease?.assets);
            latestPreWindowsExeUrl.value = windows.exe;
            latestPreWindowsMsiUrl.value = windows.msi;
            latestPreWindowsSetupUrl.value = windows.setup;
        } catch (err) {
            error.value = 'Failed to fetch latest prerelease';
            console.error('Failed to fetch latest prerelease:', err);
        } finally {
            latestPrereleaseLoaded.value = true;
        }
    }

    onMounted(async () => {
        await Promise.all([fetchLatestRelease(), fetchLatestPrerelease()]);
    });

    return {
        latestReleaseUrl,
        latestReleaseLoaded,
        latestPrereleaseUrl,
        latestPrereleaseLoaded,
        latestLinuxAppImageUrl,
        latestLinuxDebUrl,
        latestLinuxRpmUrl,
        latestPreLinuxAppImageUrl,
        latestPreLinuxDebUrl,
        latestPreLinuxRpmUrl,
        latestWindowsExeUrl,
        latestWindowsMsiUrl,
        latestWindowsSetupUrl,
        latestPreWindowsExeUrl,
        latestPreWindowsMsiUrl,
        latestPreWindowsSetupUrl,
        latestMacDmgUrl,
        error,
        refetch: () => Promise.all([fetchLatestRelease(), fetchLatestPrerelease()]),
    };
}

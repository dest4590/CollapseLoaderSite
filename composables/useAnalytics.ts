import { ref } from 'vue';

interface Analytics {
    total_loader_launches: number;
    total_client_launches: number;
    total_client_downloads: number;
}

export function useAnalytics() {
    const totalLoaderLaunches = ref<number>(0);
    const totalClientLaunches = ref<number>(0);
    const totalClientDownloads = ref<number>(0);
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

    // let intervalId: number | undefined;

    async function refetch() {
        try {
            const data: Analytics = await fetchJSON(
                'https://atlas.collapseloader.org/api/v1/statistics',
            );
            if (data) {
                totalLoaderLaunches.value = data.total_loader_launches;
                totalClientLaunches.value = data.total_client_launches;
                totalClientDownloads.value = data.total_client_downloads;
            } else {
                console.warn('No analytics data found');
            }
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
        }
    }

    // onMounted(() => {
    //     refetch();
    //     intervalId = window.setInterval(refetch, 15000);
    // });

    // onUnmounted(() => {
    //     if (intervalId) {
    //         clearInterval(intervalId);
    //     }
    // });

    return {
        totalLoaderLaunches,
        totalClientLaunches,
        totalClientDownloads,
        refetch,
    };
}

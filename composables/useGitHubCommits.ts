import { ref } from 'vue';

export interface GitHubCommit {
    sha: string;
    commit: {
        message: string;
        author: {
            name: string;
            date: string;
        };
    };
    author: {
        login: string;
        avatar_url: string;
        html_url: string;
    } | null;
    html_url: string;
}

export function useGitHubCommits(repo: string) {
    const mainCommits = ref<GitHubCommit[]>([]);
    const devCommits = ref<GitHubCommit[]>([]);
    const mainLoading = ref(false);
    const devLoading = ref(false);
    const mainError = ref<string | null>(null);
    const devError = ref<string | null>(null);

    const fetchCommits = async (branch: string, perPage = 30): Promise<GitHubCommit[]> => {
        const res = await fetch(
            `https://api.github.com/repos/${repo}/commits?sha=${branch}&per_page=${perPage}`,
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    };

    const fetchMain = async () => {
        mainLoading.value = true;
        mainError.value = null;
        try {
            mainCommits.value = await fetchCommits('main');
        } catch (e) {
            mainError.value = 'Failed to load commits';
        } finally {
            mainLoading.value = false;
        }
    };

    const fetchDev = async () => {
        devLoading.value = true;
        devError.value = null;
        try {
            devCommits.value = await fetchCommits('dev');
        } catch (e) {
            devError.value = 'Failed to load commits';
        } finally {
            devLoading.value = false;
        }
    };

    const fetchAll = () => Promise.all([fetchMain(), fetchDev()]);

    return {
        mainCommits, devCommits,
        mainLoading, devLoading,
        mainError, devError,
        fetchMain, fetchDev, fetchAll,
    };
}

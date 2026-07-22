type Client = {
    id: number;
    name: string;
    version: string;
    client_type: string;
    filename: string;
    md5_hash: string;
    downloads: number;
    launches: number;
    show: boolean;
    working: boolean;
    size: number;
    created_at: string;
    dependencies?: { md5_hash: string; name: string; size: number }[];
};

type Snapshot = Map<number, Client>;

const URLS = [
    'https://huggingface.co/datasets/Collapsecdn/collapsecdn/resolve/main/static/clients.json',
    'https://huggingface.co/datasets/Collapsecdn/collapsecdn/resolve/main/static/fabric-clients.json',
    'https://huggingface.co/datasets/Collapsecdn/collapsecdn/resolve/main/static/forge-clients.json',
];

const POLL_INTERVAL = 5 * 60 * 1000;

let currentSnapshot: Snapshot = new Map();
let lastScanTime = '';
let pollingTimer: ReturnType<typeof setInterval> | null = null;
let initialized = false;
let initPromise: Promise<void> | null = null;

function parseClients(data: unknown): Client[] {
    if (Array.isArray(data)) return data as Client[];
    if (data == null) return [];
    if (typeof data === 'string') {
        try {
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }
    return [];
}

async function fetchAllClients(): Promise<Client[]> {
    const results = await Promise.all(
        URLS.map((url) => fetch(url).then((r) => r.json()).then(parseClients).catch(() => [] as Client[])),
    );
    const map = new Map<number, Client>();
    for (const list of results) {
        for (const client of list) {
            map.set(client.id, client);
        }
    }
    return Array.from(map.values());
}

async function runScan() {
    try {
        const clients = await fetchAllClients();
        const now = new Date().toISOString();
        const newSnapshot: Snapshot = new Map();
        for (const c of clients) {
            newSnapshot.set(c.id, c);
        }
        currentSnapshot = newSnapshot;
        lastScanTime = now;
    } catch (err) {
        console.error('[clientPoller] Scan failed:', err);
    }
}

function startPoller() {
    if (pollingTimer) return;
    pollingTimer = setInterval(runScan, POLL_INTERVAL);
}

async function ensureInitialized() {
    if (initialized) return;
    if (!initPromise) {
        initPromise = runScan().then(() => {
            initialized = true;
            startPoller();
        });
    }
    await initPromise;
}

function getCurrentClients(): Client[] {
    return Array.from(currentSnapshot.values()).filter((c) => c.show);
}

function getLatestClients(count: number) {
    return getCurrentClients()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, count)
        .map((c) => ({
            name: c.name,
            version: c.version,
            md5_hash: c.md5_hash,
            client_type: c.client_type,
            created_at: c.created_at,
        }));
}

function getLastScanTime(): string {
    return lastScanTime;
}

export { ensureInitialized, getCurrentClients, getLatestClients, getLastScanTime, startPoller, runScan };
export type { Client };

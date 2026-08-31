type Client = {
    id: string | number;
    name: string;
    version: string;
    client_type: string;
    launches: number;
    downloads?: number;
    working?: boolean;
};

const SHA_URL =
    'https://huggingface.co/api/datasets/Collapsecdn/collapsecdn';

async function getDatasetSha(): Promise<string | null> {
    try {
        const info: any = await $fetch(SHA_URL);
        return typeof info?.sha === 'string' ? info.sha : null;
    } catch {
        return null;
    }
}

export default function useClients() {
    const vanilla = useState<Client[]>('clients_vanilla', () => []);
    const fabric = useState<Client[]>('clients_fabric', () => []);
    const forge = useState<Client[]>('clients_forge', () => []);
    const all = useState<Client[]>('clients_all', () => []);
    const loading = useState<boolean>('clients_loading', () => false);

    const fetchClients = async () => {
        if (all.value?.length || loading.value) {
            return;
        }

        loading.value = true;
        try {
            const sha = await getDatasetSha();
            const resolve = (u: string) =>
                sha ? u.replace('/resolve/main/', `/resolve/${sha}/`) : u;

            const [allData, fabricData, forgeData] = await Promise.all([
                $fetch(
                    resolve(
                        'https://huggingface.co/datasets/Collapsecdn/collapsecdn/resolve/main/static/clients.json',
                    ),
                ),
                $fetch(
                    resolve(
                        'https://huggingface.co/datasets/Collapsecdn/collapsecdn/resolve/main/static/fabric-clients.json',
                    ),
                ),
                $fetch(
                    resolve(
                        'https://huggingface.co/datasets/Collapsecdn/collapsecdn/resolve/main/static/forge-clients.json',
                    ),
                ),
            ]);

            console.log('Fetched clients data:', {
                allData,
                fabricData,
                forgeData,
            });

            const tryParse = (d: any) => {
                if (Array.isArray(d)) return d;
                if (d == null) return [];
                if (typeof d === 'string') {
                    try {
                        const parsed = JSON.parse(d);
                        return Array.isArray(parsed)
                            ? parsed
                            : Array.isArray(parsed?.data)
                              ? parsed.data
                              : [];
                    } catch (e) {
                        return [];
                    }
                }
                if (Array.isArray(d?.data)) return d.data;
                return [];
            };

            const rawAll = tryParse(allData);
            fabric.value = tryParse(fabricData) as any;
            forge.value = tryParse(forgeData) as any;

            const map = new Map<string, any>();
            rawAll.forEach((c: any) => map.set(`${c.client_type}-${c.id}`, c));
            fabric.value.forEach((c: any) => map.set(`${c.client_type}-${c.id}`, c));
            forge.value.forEach((c: any) => map.set(`${c.client_type}-${c.id}`, c));
            all.value = Array.from(map.values());

            const getType = (c: any) =>
                (c?.client_type ?? '').toString().toLowerCase();
            vanilla.value = all.value.filter(
                (c: any) => getType(c) === 'default',
            );
        } catch (err) {
            console.error('Failed to fetch clients:', err);
        } finally {
            loading.value = false;
        }
    };

    if (import.meta.client && !all.value?.length) {
        void fetchClients();
    }

    return { vanilla, fabric, forge, all, loading, fetchClients };
}

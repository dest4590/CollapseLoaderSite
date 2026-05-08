type Client = {
    id: string | number;
    name: string;
    version: string;
    client_type: string;
    launches: number;
    downloads?: number;
    working?: boolean;
};

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
            const [allData, fabricData, forgeData] = await Promise.all([
                $fetch(
                    'https://huggingface.co/datasets/Collapsecdn/collapsecdn/resolve/main/static/clients.json',
                ),
                $fetch(
                    'https://huggingface.co/datasets/Collapsecdn/collapsecdn/resolve/main/static/fabric-clients.json',
                ),
                $fetch(
                    'https://huggingface.co/datasets/Collapsecdn/collapsecdn/resolve/main/static/forge-clients.json',
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

            const map = new Map<string | number, any>();
            rawAll.forEach((c: any) => map.set(c.id, c));
            fabric.value.forEach((c: any) => map.set(c.id, c));
            forge.value.forEach((c: any) => map.set(c.id, c));
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

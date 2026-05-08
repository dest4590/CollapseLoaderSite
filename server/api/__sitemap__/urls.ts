interface ApiResponse {
    success: boolean;
    data: any;
}

export default defineEventHandler(async (event) => {
    const responses = await Promise.all([
        $fetch<ApiResponse>(
            'https://huggingface.co/datasets/Collapsecdn/collapsecdn/resolve/main/static/clients.json',
        ).catch(() => null),
        $fetch<ApiResponse>(
            'https://huggingface.co/datasets/Collapsecdn/collapsecdn/resolve/main/static/fabric-clients.json',
        ).catch(() => null),
        $fetch<ApiResponse>(
            'https://huggingface.co/datasets/Collapsecdn/collapsecdn/resolve/main/static/forge-clients.json',
        ).catch(() => null),
    ]);

    const allClients: any[] = [];

    responses.forEach((res) => {
        if (res?.data) {
            if (Array.isArray(res.data)) {
                allClients.push(...res.data);
            } else {
                if (res.data.vanilla_clients)
                    allClients.push(...res.data.vanilla_clients);
                if (res.data.fabric_clients)
                    allClients.push(...res.data.fabric_clients);
                if (res.data.forge_clients)
                    allClients.push(...res.data.forge_clients);
            }
        }
    });

    const uniqueClientIds = Array.from(
        new Set(allClients.map((client) => String(client.id))),
    ).filter((id) => id && id !== 'undefined');

    return uniqueClientIds.flatMap((id) => [
        { loc: `/clients/${id}` },
        { loc: `/ru/clients/${id}` },
    ]);
});

export default defineEventHandler(async () => {
    await ensureInitialized();
    return {
        clients: getCurrentClients(),
        lastScan: getLastScanTime(),
    };
});

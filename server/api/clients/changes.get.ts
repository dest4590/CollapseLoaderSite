export default defineEventHandler(async () => {
    await ensureInitialized();
    return {
        latest: getLatestClients(5),
    };
});

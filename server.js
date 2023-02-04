const app = require('./app');
const { initialiseRedis } = require('./redisClient');

const { checkCardsNeedsUpdate, updateEntries, removeBulkDataFile } = require('./services/EntryService')

app.listen(process.env.PORT, async () => {
    console.log('listening to server port:' + process.env.PORT)

    // TODO: This is most likely a stop gap until we can figure out how to get the redis client to work in the test environment
    initialiseRedis();

    if (process.env.ENVIRONMENT !== "production")
        return;

    const cardsNeedUpdate = checkCardsNeedsUpdate()
    if (cardsNeedUpdate) {
        removeBulkDataFile();
        await updateEntries();
    }

    const schedule1amDaily = "1 * * * *"
    cron.schedule(schedule1amDaily, async () => {
        removeBulkDataFile();
        await updateEntries();
    });
})
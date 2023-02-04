const redis = require("redis");

const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

redisClient.on("error", function (error) {
    console.error(error);
});

module.exports = redisClient;

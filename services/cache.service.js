const redis = require('redis');
const ApiError = require("@error");
const redisCache = require('express-redis-cache')();

const client = redis.createClient();

function deleteEndpointCache(endpoint) {
  console.log('DELETE CACHE FROM', endpoint, 'IN PROGRESS')
  return redisCache.del(endpoint, (error, deleted) => {
    if (error) {
      throw new ApiError(error)
    }

    console.log(deleted);
  });
}

module.exports = {
  client,
  redisCache,

  deleteEndpointCache
};

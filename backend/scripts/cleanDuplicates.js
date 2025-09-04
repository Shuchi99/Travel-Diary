require('dotenv').config();
console.log('ELASTIC_NODE:', process.env.ELASTIC_NODE);
console.log('ELASTIC_API_KEY length:', process.env.ELASTIC_API_KEY?.length);
const { esClient } = require('../services/elasticsearchService');

(async () => {
  const result = await esClient.search({
    index: 'travel_locations',
    query: { match_all: {} },
    size: 1000
  });

  const seen = new Set();

  for (const doc of result.hits.hits) {
    const loc = doc._source.location.toLowerCase();

    if (seen.has(loc)) {
      // Delete duplicate
      console.log(`Deleting duplicate: ${loc}`);
      await esClient.delete({
        index: 'travel_locations',
        id: doc._id
      });
    } else {
      seen.add(loc);
    }
  }

  console.log("Cleanup done!");
})();

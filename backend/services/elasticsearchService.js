require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({
  node: process.env.ELASTIC_NODE,
  auth: {
    apiKey: process.env.ELASTIC_API_KEY,
  },
});

const indexLocation = async (location) => {
  try {
    const id = location.toLowerCase().replace(/\s+/g, '_');

    const exists = await esClient.exists({ index: 'travel_locations', id });

    if (!exists)
    {
      await esClient.index({
        index: 'travel_locations',
        id,
        document: { location },
      });
      // console.log("Elastic Search Index Created for Location: ",location);
  }
  // else
  // {
  //   console.log("Duplicate Index detected for location: ",location);
  // }
  } catch (err) {
    console.error('Elasticsearch indexing error:', err);
  }
};

module.exports = {
  esClient,
  indexLocation,
};

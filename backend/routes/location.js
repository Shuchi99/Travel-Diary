const express = require('express');
const router = express.Router();
const { esClient } = require('../services/elasticsearchService');

router.get('/suggest-locations', async (req, res) => {
  const prefix = req.query.q;

  if (!prefix) {
    return res.status(400).json({ error: 'Missing query param' });
  }

  try {
    const result = await esClient.search({
      index: 'travel_locations',
      suggest: {
        'location-suggest': {
          prefix,
          completion: {
            field: 'location',
            size: 5,
          },
        },
      },
    });

    const suggestData = result.body?.suggest || result.suggest;

    const suggestions =
      suggestData?.['location-suggest']?.[0]?.options.map(opt => opt.text) || [];

    res.json({ suggestions });
  } catch (err) {
    console.error('Elasticsearch suggest error:', err.meta?.body || err.message);
    res.status(500).json({ error: 'Suggestion query failed' });
  }
});

module.exports = router;

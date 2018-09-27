const express = require('express');
const getOverview = require('../data/spreadsheet').getOverview;
const router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  const members = await getOverview();

  res.render('index', {
    members,
    title: 'TB Point Viewer'
  });
});

module.exports = router;

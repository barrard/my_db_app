const express = require('express');
const router = express.Router();
const RM = require('../middleware/route_middleware.js')
/* GET home page. */
router.get('/', [RM.ensure_not_authenticated], function(req, res, next) {
  res.render('index', { 
    title: 'Landing Page',
    layout:"./layouts/landing.ejs"
    });
});

module.exports = router;

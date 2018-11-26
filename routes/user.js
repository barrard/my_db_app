var express = require('express');
var router = express.Router();
const RM = require('../middleware/route_middleware.js')
let User = require('../models/user.js')


/* GET home page. */
router.get('/', [RM.ensure_authenticated], async function (req, res, next) {
  const id = req.user_id
  let collections = await User.get_user_collections(id)
  logger.log(collections)
  res.render('user', { 
    collections,
    title: 'User',
    layout: "./layouts/main.ejs"
  });
});

module.exports = router;

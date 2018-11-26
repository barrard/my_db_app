const express = require('express');
const router = express.Router();
const RM = require('../middleware/route_middleware.js')

const Collection = require('../models/collections.js')


/* GET all use collections. */
router.get('/get_user_collections', [RM.ensure_authenticated], async function (req, res, next) {
  try {
    let user_id = req.user._id
    let collections = await Collection.get_user_collections({ user_id })
    res.send({ collections})

  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err) 
    res.send({err})   
  }
});

/* POST add a new collection */
router.post('/add_new_collection', [RM.ensure_authenticated], async function (req, res, next) {
  try {
    let user_id = req.user._id
    const {collection_name} = req.body
    let new_collection = await Collection.add_collection({ user_id, collection_name })
    res.send({new_collection})

  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    res.send({ err })
  }
});




module.exports = router;

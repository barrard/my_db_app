var express = require('express');
var router = express.Router();
const RM = require('../../middleware/route_middleware.js')
let User = require('../../models/user.js')
const Collection = require('../../models/collections.js')
// const Collection_model = require('../../models/collection_models.js')




router.use(RM.ensure_authenticated)

router.get('/', (req, res)=>{
  res.redirect('/user/profile')
})


/* GET model for collection. */
// router.get('/get_collection_model', [RM.ensure_user_collection], async function (req, res, next) {
//   try {
//     let { collection_id } = req.params
//     let collection_model = await Collection_model.get_collection_model({ collection_id })
//     res.send({ collection_model })

//   } catch (err) {
//     logger.log('err'.bgRed)
//     logger.log(err)
//     res.send({ err })
//   }
// });

/* POST add a new collection */
router.post('/update_collection_model', [RM.ensure_user_collection], async function (req, res, next) {
  try {
    const { new_model_property, new_model_property_type, collection_id } = req.body
    let saved_collection_model = await Collection.update_collection_model({ 
      new_model_property, new_model_property_type, collection_id
    })
    if (!saved_collection_model)throw 'Error trying to update the collection model'
    res.send({ saved_collection_model })

  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    res.send({ err })
  }
});

router.post('/delete_collection', [RM.ensure_user_collection], async function (req, res){
  try {
    let {collection_id} = req.body
    logger.log(`Delete collection ${collection_id}`)
    let delete_collection = await Collection.delete_collection({collection_id})
    if(!delete_collection) throw 'Error deleting collection'
    res.send({delete_collection})
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    res.send({err})
  }
})




/* GET all use collections. */
router.get('/get_user_collections',  async function (req, res, next) {
  try {
    let user_id = req.user._id
    let collections = await Collection.get_user_collections({ user_id })
    res.send({ collections })

  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    res.send({ err })
  }
});

/* POST add a new collection */
router.post('/add_new_collection',  async function (req, res, next) {
  try {
    let user_id = req.user._id
    const { collection_name, add_starter_model } = req.body
    if (!collection_name) throw 'Collection needs a name'
    let new_collection = await Collection.add_collection({ user_id, collection_name, add_starter_model })
    res.send({ new_collection })

  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    res.send({ err })
  }
});








/* GET user profile. */
router.get('/profile',  async function (req, res, next) {
  res.render('./user/profile', {
    title: 'Profile',
    layout: "./layouts/main.ejs"
  });
});

/* GET user collections. */
router.get('/collections',  async function (req, res, next) {
  const user_id = req.user._id
  logger.log(user_id)
  let collections = await Collection.get_user_collections({user_id})
  res.render('./user/collections', { 
    collections,
    title: 'Collections',
    layout: "./layouts/main.ejs"
  });
});

/* GET user collections. */
router.get('/collection_model',  async function (req, res, next) {
  const id = req.user_id
  let collections = await User.get_user_collections(id)
  logger.log(collections)
  res.render('./user/collections', {
    collections,
    title: 'Collections',
    layout: "./layouts/main.ejs"
  });
});

/* GET user collections. */
router.post('/update_email',  async function (req, res, next) {
  try {
    const { email } = req.body
    const user_id = req.user._id
    let user = await User.update_email({ user_id, email })
    res.send(true)
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    res.send({err})
  }
});

/* GET user collections. */
router.post('/update_password',  async function (req, res, next) {
  try {
    const { update_password, confirm_password } = req.body
    const user_id = req.user._id
    let user = await User.update_password({ user_id, update_password, confirm_password })
    res.send(true)
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    res.send({ err })
  }
});














module.exports = router;
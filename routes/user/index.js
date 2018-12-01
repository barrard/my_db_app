var express = require('express');
var router = express.Router();
const RM = require('../../middleware/route_middleware.js')
let User = require('../../models/user.js')
const Collection = require('../../models/collections.js')
const User_collection_data = require('../../models/user_collection_data.js')





router.use(RM.ensure_authenticated)

router.get('/', (req, res) => {
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


/* POST add obj to collection */
router.post('/edit_new_prop', [RM.ensure_user_collection], async function (req, res, next) {
  try {
    logger.log('edit_new_prop')
    const { old_prop_name, collection_id,
      old_prop_type,
      new_prop_name,
      new_prop_type } = req.body
    logger.log({
      old_prop_name,
      old_prop_type,
      new_prop_name,
      new_prop_type
    })
    let new_prop_obj = await Collection.edit_new_prop({
      collection_id,
      old_prop_name, old_prop_type,
      new_prop_name, new_prop_type
    })
    res.send({ new_prop_obj })
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    res.send({ err })
  }
});


/* POST add obj to collection */
router.get('/get_collection_documents', [RM.ensure_user_collection], async function (req, res, next) {
  try {
    let {collection_id} = req.query
    let collection_documents = await User_collection_data.get_collection_documents({collection_id})
    res.send({collection_documents})
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    res.send({ err })
  }
});


/* POST add obj to collection */
router.post('/submit_data_to_collection', [RM.ensure_user_collection], async function (req, res, next) {
  try {
    logger.log(req.body)
    //remove _csrf, collection_id, collection_name
    let data = { ...req.body }
    let user_id = req.user._id
    delete data._csrf
    delete data.collection_id
    delete data.collection_name

    if(!Object.keys(data).length)throw 'Data is empty'

    let { collection_id, collection_name } = req.body
    let new_user_collection_data = await User_collection_data.add_user_collection({ collection_id, collection_name, user_id, data })
    res.send({ new_user_collection_data })

  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    res.send({ err })
  }
});


/* POST add a new collection */
router.post('/delete_model_prop', [RM.ensure_user_collection], async function (req, res, next) {
  try {
    let { prop, collection_id } = req.body
    logger.log(prop, collection_id)
    let model = await Collection.delete_model_prop({ collection_id, prop })
    res.send({ model })
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    res.send({ err })
  }
});

/* POST add a new collection */
router.post('/update_collection_model', [RM.ensure_user_collection], async function (req, res, next) {
  try {
    const { new_model_property, new_model_property_type, collection_id } = req.body
    let saved_collection_model = await Collection.update_collection_model({
      new_model_property, new_model_property_type, collection_id
    })
    if (!saved_collection_model) throw 'Error trying to update the collection model'
    res.send({ saved_collection_model })

  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    res.send({ err })
  }
});

router.post('/delete_collection', [RM.ensure_user_collection], async function (req, res) {
  try {
    let { collection_id } = req.body
    logger.log(`Delete collection ${collection_id}`)
    let delete_collection = await Collection.delete_collection({ collection_id })
    if (!delete_collection) throw 'Error deleting collection'
    res.send({ delete_collection })
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    res.send({ err })
  }
})




/* GET all use collections. */
router.get('/get_user_collections', async function (req, res, next) {
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
router.post('/add_new_collection', async function (req, res, next) {
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
router.get('/profile', async function (req, res, next) {
  res.render('./user/profile', {
    title: 'Profile',
    layout: "./layouts/main.ejs"
  });
});

/* GET user collections. */
router.get('/collections', async function (req, res, next) {
  const user_id = req.user._id
  logger.log(user_id)
  let collections = await Collection.get_user_collections({ user_id })
  res.render('./user/collections', {
    collections,
    title: 'Collections',
    layout: "./layouts/main.ejs"
  });
});

/* GET user collections. */
router.get('/collection_model', async function (req, res, next) {
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
router.post('/update_email', async function (req, res, next) {
  try {
    const { email } = req.body
    const user_id = req.user._id
    let user = await User.update_email({ user_id, email })
    res.send(true)
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    res.send({ err })
  }
});

/* GET user collections. */
router.post('/update_password', async function (req, res, next) {
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

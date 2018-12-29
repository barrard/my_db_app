var express = require('express');
var router = express.Router();
const formidable = require('formidable');
const path = require('path')
const RM = require('../../middleware/route_middleware.js')
let User = require('../../models/user.js')
const Collection = require('../../models/collections.js')
const User_collection_data = require('../../models/user_collection_data.js')
const User_file_uploads = require('../../models/user_file_uploads.js')





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
router.post('/trash_document', [RM.ensure_user_document], async function(req, res, next){
  try {
    logger.log(req.body)
    let { document_id } = req.body
    logger.log('TEST')
    logger.log(document_id)
    let deleted_document = await User_collection_data.delete_user_collection_data({document_id})
    res.send({deleted_document})

  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    res.send({ err })
  }

});

router.post('/trash_document_file', [RM.ensure_user_document], async function(req, res, next){
  try {
    logger.log(req.body)
    let { document_id, file_name } = req.body
    logger.log('TEST')
    logger.log(document_id)
    let deleted_document_file = await User_collection_data.delete_user_collection_data_file({document_id, file_name})
    res.send({deleted_document_file})

  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    res.send({ err })
  }

});


router.post('/edit_document', [RM.ensure_user_document], async function(req, res, next){
  try {
    logger.log(req.body)
    //remove _csrf, collection_id, collection_name, uploaded_file_names
    let data = JSON.parse(req.body.data)
    logger.log(data)
    let { document_id} = req.body 
    // delete data._csrf
    // delete data.document_id
    // delete data.collection_name
    let collection_data = {data, document_id}
    if(!Object.keys(data).length)throw 'Data is empty'

    let new_user_collection_data = await User_collection_data.edit_user_collection_data(collection_data )
    logger.log(new_user_collection_data)
    res.send({new_user_collection_data})
    
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    res.send({ err })
  }
});


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
    let new_model_obj = await Collection.edit_new_prop({
      collection_id,
      old_prop_name, old_prop_type,
      new_prop_name, new_prop_type
    })
    res.send({ new_model_obj })
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
    //remove _csrf, collection_id, collection_name, uploaded_file_names
    let data = JSON.parse(req.body.data)
    let uploaded_file_names = JSON.parse(req.body.uploaded_file_names)
    logger.log(data)
    let { collection_id, collection_name} = req.body 
    let user_id = req.user._id
    // delete data._csrf
    // delete data.collection_id
    // delete data.collection_name
    let collection_data = {data, collection_id, collection_name, uploaded_file_names, user_id}
    if(!Object.keys(data).length)throw 'Data is empty'

    let new_user_collection_data = await User_collection_data.add_user_collection_data(collection_data )
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


/* POST add a new collection */
router.post('/upload_files', async function (req, res, next) {
  try {
    var user_id = req.user._id
    var file_name
    logger.log(req.body)
    const form = new formidable.IncomingForm();
    form.multiples = false;

    form.uploadDir = path.join(__dirname, '../../public/user_files')
      // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function (field, file) {
    logger.log('field - ' + field + ' : file - ' + JSON.stringify(file));
    let ext = file.name
    const index = ext.lastIndexOf('.')
        ext = ext.slice(index)
    logger.log('whats the upload file?')
    logger.log(file.path)
    file_name = file.path.split('/')
    file_name = file_name[file_name.length - 1]

    //need to add it to the collection!
    logger.log(file_name)
    User_file_uploads.add_user_file_upload({user_id, file_name})




    // resizeThisImage(file.path + ext)//TODO add Jimp
  });
    // log any errors that occur
    form.on('error', function (err) {
      logger.log('An error has occured: \n' + err);
    });
  
    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
      logger.log('end')
      res.send({file_name})
  
    });
  
    // parse the incoming request containing the form data
    form.parse(req);
    // logger.log(form)
    logger.log(req.file)
    logger.log(req.files)
  
    //

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

const mongoose = require('mongoose')
const MODEL_PROP_TYPES = [
  'Text', 'Long Text', 'True/False', 'Date', 'Number'
]

const collection_schema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  collection_name: {
    type: String,
    require: true,
    // unique: true
  },
  deleted: { type: Boolean, default: false },
  last_updated: { type: Date },
  model: [{}],

})

const Collection = mongoose.model('Collection', collection_schema)

module.exports = Collection

Collection.add_collection = add_collection
Collection.get_user_collections = get_user_collections
Collection.verify_owner_of_collection = verify_owner_of_collection
Collection.delete_collection = delete_collection
Collection.update_collection_model = update_collection_model

async function update_collection_model({ new_model_property, new_model_property_type, collection_id }) {
  try {
    logger.log(`Save Id ${collection_id} and Prop ${new_model_property} and data type${new_model_property_type}`)
    let valid = await validate_new_model_property({ new_model_property, new_model_property_type, collection_id })
    if (valid !== true) throw valid//if not true, this will be error message
    let data = { [new_model_property]: new_model_property_type}
    logger.log(collection_id)
    let saved_collection_model = await Collection.findOneAndUpdate({_id:collection_id}, {
      $push: { model: data }
    }, { new: true })
    if (!saved_collection_model) throw 'Error updating model'
    logger.log(saved_collection_model)
    return saved_collection_model.model
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    throw err
  }
}

async function validate_new_model_property({ new_model_property, new_model_property_type, collection_id }) {
  logger.log('Validate!'.red)
  logger.log({ new_model_property, new_model_property_type })
  var err_msg = ''
  //make sure they sent us a string
  if (!new_model_property) {
    err_msg += 'Property can\'t be blank <br>'
  }
  let collection = await Collection.findById(collection_id)
  // check if this property already exists
  let prop_index = collection.model.findIndex((data) => {
    for (let k in data) {
      return k.toLowerCase() === new_model_property.toLowerCase()
    }
  })
  //the index should be < 0 meaning we dont have it yet
  if (!(prop_index < 0)) {
    logger.log('DUPLICATE NAME'.red)
    err_msg += `This property "${new_model_property}" already exists on the model <br>`
  }
  //verify the data type is coming form our list
  let data_type_ok = MODEL_PROP_TYPES.indexOf(new_model_property_type)
  if (data_type_ok < 0) {
    err_msg += `Data type "${new_model_property_type}" is invalid`
  }
  //err_msg then return
  if (err_msg) return err_msg
  //else we return true and continue on with our lives :)
  return true

}



async function delete_collection({ collection_id }) {
  try {
    logger.log(collection_id)
    let collections = await Collection.findByIdAndUpdate(collection_id, {
      $set: { deleted: true }
    })
    // logger.log('collections')
    // logger.log(collections)
    if (!collections) throw 'Error deleting Collection'
    return true
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    throw 'Error deleting Collection'
  }
}

async function verify_owner_of_collection({ collection_id, user_id }) {
  try {
    let collections = await get_user_collections({ user_id })
    // logger.log(collections)
    let index_of_collection_id = collections.findIndex((col) => {
      return col._id == collection_id
    })
    // logger.log(index_of_collection_id)
    if (index_of_collection_id < 0) return false
    return true
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    throw err

  }
}


async function get_user_collections({ user_id }) {
  try {
    logger.log('get_collection')
    let collections = await Collection.find({ user_id, deleted: { $ne: true } })
    return collections

  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    throw err
  }
}

async function add_collection({ user_id, collection_name, add_starter_model }) {
  try {
    let col = await Collection.findOne({
      user_id, collection_name
    })
    if (col && col.deleted) {
      throw `You have a Collection saved in your deleted collections named ${collection_name}\n
                Would yo like to restore? <button>yes</button> `
    }
    if (col) throw `You aldready have a Collection named ${collection_name}`
    logger.log('add_collection')
    var model = []
    if (add_starter_model === "yes") {
      model = [
        { Name: "Text" },
        { Description: "Long Text" },
        { Created: "Date" },
        { Updated: "Date" },
      ]
    }
    let last_updated = Date.now()
    let new_collection = new Collection({
      user_id, collection_name, last_updated, model
    })
    let saved_collection = await new_collection.save()
    return saved_collection
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    throw err
  }
}
const mongoose = require('mongoose')

const collection_schema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  collection_name: {
    type: String,
    default: ''
  },
  last_updated:{type:Date}
})

const Collection = mongoose.model('Collection', collection_schema)

module.exports = Collection

Collection.add_collection = add_collection
Collection.get_user_collections = get_user_collections

async function get_user_collections({ user_id }) {
  try {
    logger.log('get_collection')
    let collections = await Collection.find({user_id})
    return collections

  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    throw err
  }
}

async function add_collection({user_id, collection_name}){
  try {
    logger.log('add_collection')
    let last_updated = Date.now()
    let new_collection = new Collection({
      user_id, collection_name, last_updated
    })
    let saved_collection = await new_collection.save()
    return saved_collection
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    throw err
  }
}
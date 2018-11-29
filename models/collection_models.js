const mongoose = require('mongoose')

const collection_models_schema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  model: [{}],

  collection_id: { type: mongoose.Schema.Types.ObjectId, ref: "Collection", require: true },

  last_updated: { type: Date }
})

const Collection_model = mongoose.model('Collection_model', collection_models_schema)
Collection_model.get_collection_model = get_collection_model

module.exports = Collection_model


async function get_collection_model({ collection_id }) {
  try {
    logger.log(`Get ${collection_id}`)
    let collection_model = await Collection_model.findById(collection_id)
    if (!collection_model) throw 'No Collection Model found'
    return collection_model
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    throw err
  }

}


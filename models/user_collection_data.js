const mongoose = require('mongoose')

const user_collection_data_schema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  data: {},
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  collection_id: { type: mongoose.Schema.Types.ObjectId, ref: "Collection", require: true },
  collection_name:String,
  last_updated: { type: Date }
})

const User_Collection_data = mongoose.model('user_Collection_data', user_collection_data_schema)
User_Collection_data.add_user_collection = add_user_collection

module.exports = User_Collection_data


async function add_user_collection({ collection_id, collection_name, data, user_id }) {
  try {
    logger.log('Make the data with this data')
    logger.log({ collection_id, collection_name, data, user_id})
    let new_user_data = new User_Collection_data({
      collection_id, collection_name, data, user_id
    })
    let saved_user_data = await new_user_data.save()
    if(!saved_user_data)throw 'Error saving user data'
    return saved_user_data
    
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    throw err
  }

}


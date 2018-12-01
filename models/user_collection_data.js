const mongoose = require('mongoose')
const Collections = require('./collections.js')

const user_collection_data_schema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  data: {type:{}, required:true},
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  collection_id: { type: mongoose.Schema.Types.ObjectId, ref: "Collection", require: true },
  collection_name:String,
  last_updated: {
    type: Date, default: Date.now
 }
})

const User_Collection_data = mongoose.model('user_collection_data', user_collection_data_schema)
User_Collection_data.add_user_collection = add_user_collection
User_Collection_data.get_collection_documents = get_collection_documents
User_Collection_data.verify_owner_of_document = verify_owner_of_document

module.exports = User_Collection_data

async function get_document({document_id}) {
  try {
    let document = await User_Collection_data.findById(document_id)
    if(!document) throw 'No document found'
    return document
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    throw err
  }
}

async function verify_owner_of_document({ document_id, user_id}){
  try {
    let document = await get_document({document_id})
    let collections = await Collections.get_user_collections({ user_id })
    // logger.log(collections)
    logger.log(document.collection_id)
    let index_of_document_id = collections.findIndex((col) => {
      logger.log(col._id)
      logger.log(document.collection_id)
      logger.log(col._id.equals( document.collection_id))
      return col._id.equals( document.collection_id)
    })
    logger.log(index_of_document_id)
    if (index_of_document_id < 0) return false
    return true
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    throw err

  }
}


async function get_collection_documents({ collection_id }) {
  try {
    let collection_data = await User_Collection_data.find({collection_id})
    if(!collection_data) throw 'Cannot find any colelction data'
    return collection_data
    
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    throw err
  }

}



async function add_user_collection({ collection_id, collection_name, data, user_id }) {
  try {
    logger.log('Make the data with this data')
    logger.log({ collection_id, collection_name, data, user_id})
    let verify = await verify_submited_document_is_comple({collection_id, data})
    if(!verify) throw 'Data verification failed'
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


async function verify_submited_document_is_comple({collection_id, data}){
  try {
    var model = await Collectons.get_model({ collection_id })
    logger.log(model)
    logger.log(data)
    let model_varified_data={}
    let err_msg = ''
    model.forEach(prop_val => {
      for(let prop in prop_val){
        logger.log(data[prop])
        if(data[prop]===undefined)err_msg +=`${prop} Needs to be defined <br>\n`
        model_varified_data[prop] = data[prop]
      }
    });
    logger.log(model_varified_data)
    logger.log(model_varified_data)
    logger.log(model_varified_data)
    if(err_msg) throw err_msg
    return model_varified_data
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    
  }
}
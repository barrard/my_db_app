const mongoose = require('mongoose')
const Collectons = require('./collections.js')

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

const User_Collection_data = mongoose.model('user_Collection_data', user_collection_data_schema)
User_Collection_data.add_user_collection = add_user_collection

module.exports = User_Collection_data


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
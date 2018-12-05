const mongoose = require('mongoose')
const Collections = require('./collections.js')

const user_file_uploads_model = mongoose.Schema({
  files: [{
    name:String,
    title:String,
    created: {
      type: Date,
      default: Date.now
    }
  }],

  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

})

const User_file_uploads = mongoose.model('User_file_uploads', user_file_uploads_model)

User_file_uploads.get_all_user_files= get_all_user_files
User_file_uploads.add_user_file_upload = add_user_file_upload
User_file_uploads.verify_owner_of_file = verify_owner_of_file

module.exports = User_file_uploads



async function verify_owner_of_file({ file_name, user_id}){
  try {
    let files = await get_all_user_files({user_id})
    console.log(files)

    let index_of_file_name = files.findIndex((file) => {

      return file.name ==  file_name
    })
    logger.log(index_of_file_name)
    if (index_of_file_name < 0) return false
    return true
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    throw err

  }
}


async function add_user_file_upload({ user_id, file_name }) {
  try {
    logger.log({user_id, file_name})
    let uploaded_files = await User_file_uploads.updateOne({user_id}, {
      $push:{files:{name:file_name, title:file_name}}
    }, {new:true, upsert:true})
    if(!uploaded_files)throw 'Error uplaoding new file'
    logger.log(uploaded_files)
    return uploaded_files.files
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    throw err
  }

}

async function get_all_user_files({user_id}){
  try {
    let files = await User_file_uploads.find({user_id})
    if(!files) throw 'No files found for this user'
    return files.files

  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
  }
}

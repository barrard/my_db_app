const User = require('../models/user.js')
const Collection = require('../models/collections.js')
const User_collection_data = require('../models/user_collection_data.js')

module.exports = {
  async ensure_user_document(req, res, next){
    // if(true) return next()
    try {
      var document_id = get_document_id_from_req(req)
      const user_id = req.user._id

      // logger.log({collection_id, user_id})
      //check this id beloings to a collection this user has
      let check = await User_collection_data.verify_owner_of_document({ document_id, user_id})
      if (!check) throw 'Not this user collection'
      // logger.log(check)
      next()

    } catch (err) {
      logger.log('err'.bgRed)
      logger.log(err)
      res.send({err:'Cannot edit this document'})

    }

  },
  ensure_authenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    logger.log('non-authenticated user being redirected'.bgWhite)
    res.redirect('/auth/login')

  },
  ensure_not_authenticated(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    logger.log('This person is logged in'.bgWhite)
    res.redirect('/user/collections')

  },
  async ensure_user_collection(req, res, next){
    try {
      var collection_id = get_collection_id_from_req(req)
      const user_id = req.user._id
      
      //check this id beloings to a collection this user has
      let check = await Collection.verify_owner_of_collection({ collection_id, user_id})
      if (!check) throw 'Not this user collection'
      // logger.log(check)
      next()
    } catch (err) {
      logger.log('err'.bgRed)
      logger.log(err)
      res.send({err:'Cannot use this collection'})
    }
  }
}



function get_collection_id_from_req(req){
    var collection_id = get_item_from_req(req, 'collection_id')

    if (!collection_id) throw 'ERROR no collection_id'

    return collection_id

}

function get_document_id_from_req(req){
    var document_id = get_item_from_req(req, 'document_id')

    if (!document_id) throw 'ERROR no document_id'
    return document_id
  
}

function get_item_from_req(req, item){
  var item_id;
  logger.log(item)
  let method = req.method
  if (method == "POST") {
    logger.log('POST')
    item_id = req.body[item]
  }
  if (method == "GET") {
    logger.log('GET')
    logger.log(req.query)
    item_id = req.query[item]
  }
  logger.log(item_id)

  if(!item_id) throw `Couldnt find ${item}`
  return item_id
}

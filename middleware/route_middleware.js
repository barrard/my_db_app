const User = require('../models/user.js')
const Collection = require('../models/collections.js')
const User_collection_data = require('../models/user_collection_data.js')

module.exports = {
  async ensure_user_document(req, res, next){
    // if(true) return next()
    try {
      let method = req.method
      logger.log(method)
      var document_id;
      const user_id = req.user._id
      if (method == "POST") {
        logger.log('POST')
        document_id = req.body.document_id
      }
      if (method == "GET") {
        logger.log('GET')
        logger.log(req.query)
        document_id = req.query.document_id
      }
      // logger.log({collection_id, user_id})
      if (!document_id) throw 'ERROR no document_id'
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
      let method = req.method
      logger.log(method)
      var collection_id;
      const user_id = req.user._id
      if (method == "POST") {
        logger.log('POST')
        collection_id = req.body.collection_id
      }
      if (method == "GET") {
        logger.log('GET')
        logger.log(req.query)
        collection_id = req.query.collection_id
      }
      // logger.log({collection_id, user_id})
      if (!collection_id) throw 'ERROR'
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

const User = require('../models/user.js')
const Collection = require('../models/collections.js')

module.exports = {
  ensure_authenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    logger.log('non-authenticated user being redirected'.bgWhite)
    res.redirect('/auth/login')

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
      logger.log(collection_id)
      if (!collection_id) throw 'ERROR'
      logger.log('TODO set this up')
      //check this id beloings to a collection this user has
      let check = await Collection.verify_owner_of_collection({ collection_id, user_id})
      if (!check) throw 'Not this user collection'
      logger.log(check)
      next()
    } catch (err) {
      logger.log('err'.bgRed)
      logger.log(err)
      res.send({err:'Cannot use this collection'})
    }
  }
}

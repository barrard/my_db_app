var express = require('express');
var router = express.Router();
const RM = require('../../middleware/route_middleware.js')
const passport = require('passport')
// const path = require('path')
// const $ = path.join('',__dirname )
// logger.log($)



/* GET */
router.get('/login', [RM.ensure_not_authenticated], (req, res) => {
  res.render('login', {
    title:'Login'
  })

})
router.get('/register', [RM.ensure_not_authenticated], (req, res) => {
  res.render('register', {
    title: 'Register'

  })

})
router.get('/logout', RM.ensure_authenticated, (req, res) => {
  req.logOut();
  req.session.messages.push({ "info": "You are now logged out" })
  res.redirect('/')
})

/* POST */
router.post('/register', [RM.ensure_not_authenticated], async (req, res) => {
  require('./register.js')(req, res)
})


router.post('/login',
  [RM.ensure_not_authenticated,passport.authenticate('local', {
    failureRedirect: '/auth/login',
  })],
  (req, res) => {
    require('./login.js')(req, res)
  });



module.exports = router;

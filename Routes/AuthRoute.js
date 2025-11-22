const { Signup, Login,Logout } = require('../Controllers/AuthController')
const router = require('express').Router()
const { userVerification } = require("../Middlewares/AuthMiddleware");

router.post('/signup', Signup)
router.post('/login', Login)
router.get('/verify',userVerification);
router.post('/logout',Logout);
module.exports = router
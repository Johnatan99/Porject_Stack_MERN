const express = require('express')
const {registerController, loginController, updateUserController, requireSingIn} = require("../controllers/userController")
//Router object
const router = express.Router();

//Routes
//Register | Post
router.post('/register', registerController);

//Login || POST
router.post('/login', loginController);

//Update || Put
router.put('/update-user', requireSingIn, updateUserController);

//Export
module.exports = router;
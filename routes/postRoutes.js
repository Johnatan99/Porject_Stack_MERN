const express = require('express')
const {requireSingIn} = require("../controllers/userController");
const {
    createPostController,
    getAllPostsController,
    getUserPostController,
    deletePostController,
    updatePostController
} = require('../controllers/postController');

//Router object
const router = express.Router();

//Create post || Post
router.post('/create-post', requireSingIn, createPostController)

//Get All Posts:
router.get('/get-all-post', getAllPostsController)

//Get user Posts:
router.get('/get-user-post', requireSingIn, getUserPostController);

//Delete post:
router.delete('/delete-post/:id', requireSingIn, deletePostController);

//Update post:
router.put('/update-post/:id', requireSingIn, updatePostController)

//Export
module.exports = router;
const express = require("express");
const router = express();
const userAuth = require('../controller/auth')
const postData = require('../controller/post')
const middlewares = require('../middleware/index')


// TASK: -2 Create APIs for login and registration
router.post('/user', middlewares.validateAuth.validateAuth, userAuth.createUser);
router.post('/login', userAuth.login);

// Task 3: Create the CRUD of Post for the only authenticated user.
router.post('/post', middlewares.auth.token, middlewares.validatorPost.validatePost, postData.createPost);
router.get('/post', middlewares.auth.token, postData.findAllPost);
router.put('/post/:id', middlewares.auth.token, middlewares.validatorPost.validatePost, postData.updateById);
router.delete('/post/:id', middlewares.auth.token, postData.deleteById);

// Task 4: Create an API to retrieve posts using latitude and longitude.
router.get('/getPostByLocation', postData.getPostByLocation);

// Task 5: Show the count of active and inactive post in the dashboard.
router.get('/dashboard', postData.dashboard);

module.exports = router;
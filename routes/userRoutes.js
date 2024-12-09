const express = require('express');
const usersController = require('../controllers/usersController');
const JWTVerifier = require('../middleware/JWTVerifier');
const router = express.Router();

router.use(JWTVerifier); // middleware

router
    .route("/")
    .get(usersController.getAllUsers)
    .post(usersController.createUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser);

module.exports = router;
const express = require("express");
const ticketController = require('../controllers/ticketController');
const router = express.Router();

router
    .route("/")
    .get(ticketController.getAllUsers)
    .post(ticketController.createUser)
    .patch(ticketController.updateUser)
    .delete(ticketController.deleteUser);

module.exports = router;
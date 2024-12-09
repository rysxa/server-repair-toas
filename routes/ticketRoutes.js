const express = require("express");
const ticketController = require('../controllers/ticketController');
const JWTVerifier = require("../middleware/JWTVerifier");
const router = express.Router();

router.use(JWTVerifier); // middleware

router
    .route("/")
    .get(ticketController.getAllTickets)
    .post(ticketController.createTicket)
    .patch(ticketController.updateTicket)
    .delete(ticketController.deleteTicket);

module.exports = router;
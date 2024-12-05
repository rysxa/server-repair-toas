const express = require("express");
const ticketController = require('../controllers/ticketController');
const router = express.Router();

router
    .route("/")
    .get(ticketController.getAllTickets)
    .post(ticketController.createTicket)
    .patch(ticketController.updateTicket)
    .delete(ticketController.deleteTicket);

module.exports = router;
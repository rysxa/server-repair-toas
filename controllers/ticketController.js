const User = require("../models/User");
const Ticket = require("../models/Ticket");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllTickets = asyncHandler(async (req, res) => {
    try {
        // query untuk ambil data ticket
        const tickets = await Ticket.find().lean();

        // validasi jika tidak ada ticket
        if (!tickets?.length) {
            return res.status(404).json({ message: "Tidak ada ticket yang ditemukan" });
        }

        const ticketWithDataUser = await Promise.all(
            tickets.map(async (ticket) => {
                const user = await User.findById(ticket.user).lean().exec();

                return { ...ticket, username: user.username };
            })
        )

        // Return tickets if found
        res.status(200).json({
            data: ticketWithDataUser,
            message: "Berhasil memperoleh data ticket!"
        });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data ticket" });
    }
});

const createTicket = asyncHandler(async (req, res) => {
    const { title, desc, user } = req.body;

    if (!title || !desc || !user) {
        return res.status(400).json({ message: "Semua atribut harus terisi!" });
    }

    // validasi duplicate
    const duplicate = await Ticket.findOne({ title }).lean().exec();

    if (duplicate) {
        return res.status(400).json({ message: "Ticket sudah ada." });
    }

    const ticket = await Ticket.create({ title, desc, user });

    if (ticket) {
        res.status(201).json({ message: `Ticket: ${title} telah dibuat!` });
    } else {
        res.status(400).json({ message: "Gagal membuat ticket baru." });
    }
});

const updateTicket = asyncHandler(async (req, res) => {
    const { id, title, desc, user, isFixed } = req.body;

    if (!id || !title || !desc || !user || !isFixed) {
        return res.status(400).json({ message: "Semua atribut harus terisi!" });
    }

    // validasi existing data
    const ticket = await Ticket.findById(id).exec();

    if (!ticket) {
        return res.status(400).json({ message: "Ticket tidak ditemukan" });
    }

    // validasi duplicate title
    const duplicate = await Ticket.findOne({ title }).lean().exec();

    // memperbolehkan admin untuk meng-update title pada ticket dengan id sama.
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "Ticket sudah ada" });
    }

    ticket.title = title;
    ticket.desc = desc;
    ticket.user = user;
    ticket.isFixed = isFixed;

    const updatedTicket = await ticket.save();

    res.json({ message: `Ticket: ${updatedTicket.id} diperbarui.` });
});


const deleteTicket = asyncHandler(async (req, res) => {
    const { id } = req.body;

    // validasi kelengkapan data
    if (!id) {
        return res.status(400).json({ message: "ID diperlukan" });
    }

    // check ticket exist
    const ticket = await Ticket.findById(id).exec();

    if (!ticket) {
        return res.status(400).json({ message: "Ticket tidak ditemukan" });
    }

    const result = await ticket.deleteOne();

    res.json({ message: `Ticket dengan ${result.id} berhasil dihapus!` });
});

module.exports = {
    getAllTickets,
    createTicket,
    updateTicket,
    deleteTicket,
}
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const URI = process.env.MONGO_URL;
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Mongoose Seat Schema
const seatSchema = new mongoose.Schema({
    row: Number,
    seatNumber: Number,
    isBooked: { type: Boolean, default: false },
});

const Seat = mongoose.model("Seat", seatSchema);

// Initialize seats in the database, I triggered this manually to initialize the DB
app.get("/initialize", async (req, res) => {
    await Seat.deleteMany(); // Clear any existing seats
    const seats = [];
    for (let row = 1; row <= 12; row++) {
        const maxSeats = row === 12 ? 3 : 7; // Last row has only 3 seats
        for (let seatNumber = 1; seatNumber <= maxSeats; seatNumber++) {
            seats.push({ row, seatNumber });
        }
    }
    await Seat.insertMany(seats);
    res.send("Seats initialized!");
});

// Get all seats from the database
app.get("/seats", async (req, res) => {
    const seats = await Seat.find().sort({ row: 1, seatNumber: 1 });
    res.json(seats);
});

// Reserve seats
app.post("/reserve", async (req, res) => {
    const { numberOfSeats } = req.body;

    if (!numberOfSeats || numberOfSeats < 1 || numberOfSeats > 7) {
        return res.status(400).json("Invalid number of seats. Must be between 1 and 7.");
    }

    // Find available seats from the database
    const seats = await Seat.find({ isBooked: false }).sort({ row: 1, seatNumber: 1 });

    if (seats.length < numberOfSeats) {
        return res.status(400).json("Not enough available seats.");
    }

    let bookedSeats = [];

    // Try booking in one row first

    // Group available seats by rows
    const rows = {};
    seats.forEach((seat) => {
        // Initialize row if it doesn't exist
        if (!rows[seat.row]) {
            rows[seat.row] = [];
        }
        // Add seat to row
        rows[seat.row].push(seat);
    });

    for (const row in rows) {
        if (rows[row].length >= numberOfSeats) {
            // If row has enough seats, book them. Starting from the first available seat
            bookedSeats = rows[row].slice(0, numberOfSeats);
            break;
        }
    }

    // If no single row has enough seats, book the nearest ones
    if (bookedSeats.length === 0) {
        // Booking the nearest available seats as the data is already sorted
        bookedSeats = seats.slice(0, numberOfSeats);
    }

    // Update the database with the booked seats
    const bookedIds = bookedSeats.map((seat) => seat._id);
    await Seat.updateMany({ _id: { $in: bookedIds } }, { $set: { isBooked: true } });

    res.status(200).json({
        message: "Seats reserved successfully.",
        bookedSeats: bookedSeats.map((seat) => `Row ${seat.row} - Seat ${seat.seatNumber}`),
    });
});

// Reset all seat bookings
app.post("/reset", async (req, res) => {
    try {
        await Seat.updateMany({}, { $set: { isBooked: false } });
        res.json({ message: "All bookings have been reset." });
    } catch (error) {
        res.status(500).send("Error resetting seat bookings.");
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;

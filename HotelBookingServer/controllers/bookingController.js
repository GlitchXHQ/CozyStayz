// controllers/bookingController.js
const Hotel = require("../models/Hotel")
const Room =require("../models/Room")
const  Booking =require( "../models/Booking" )// use import consistently

// Helper: check overlapping bookings for a given room
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    // convert to Date objects to be safe
    const ci = new Date(checkInDate)
    const co = new Date(checkOutDate)
    if (isNaN(ci.getTime()) || isNaN(co.getTime())) return false

    // Ensure checkOut is after checkIn
    if (co <= ci) return false

    const bookings = await Booking.find({
      room,
      // overlap condition: existing.checkIn < requested.checkOut AND existing.checkOut > requested.checkIn
      checkInDate: { $lt: co },
      checkOutDate: { $gt: ci },
    })

    return bookings.length === 0
  } catch (err) {
    console.error("checkAvailability error:", err)
    throw err
  }
}

// API: check availability endpoint
const checkAvailabilityAPI = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, room } = req.body
    const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room })

    return res.status(200).json({
      success: true,
      isAvailable,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: err.message })
  }
}

// Create booking
const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body
    const user = req.user && req.user._id
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" })

    // validate room & dates
    if (!room || !checkInDate || !checkOutDate) {
      return res.status(400).json({ success: false, message: "Missing required fields" })
    }

    const isAvailable = await checkAvailability({ room, checkInDate, checkOutDate })
    if (!isAvailable) {
      return res.status(409).json({ success: false, message: "Room not available for selected dates" })
    }

    const roomData = await Room.findById(room).populate("hotel")
    if (!roomData) {
      return res.status(404).json({ success: false, message: "Room not found" })
    }

    const ci = new Date(checkInDate)
    const co = new Date(checkOutDate)
    const msPerDay = 1000 * 60 * 60 * 24
    // nights should be integer number of nights; require co > ci
    const nights = Math.ceil((co.getTime() - ci.getTime()) / msPerDay)
    if (nights <= 0) {
      return res.status(400).json({ success: false, message: "checkOutDate must be after checkInDate" })
    }

    let totalPrice = (roomData.pricePerNight || 0) * nights

    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: Number(guests) || 1,
      checkInDate: ci,
      checkOutDate: co,
      totalPrice,
    })

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: err.message })
  }
}

// Get bookings for current user
const getUserBookings = async (req, res) => {
  try {
    const user = req.user && req.user._id
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" })

    const bookings = await Booking.find({ user }).populate("room hotel").sort({ createdAt: -1 })

    return res.status(200).json({ success: true, bookings })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: err.message })
  }
}

// Get bookings for hotel owned by current user (hotel owner dashboard)
const getHotelBookings = async (req, res) => {
  try {
    // assuming req.user._id is the authenticated user's id (hotel owner)
    const ownerId = req.user && req.user._id
    if (!ownerId) return res.status(401).json({ success: false, message: "Unauthorized" })

    const hotel = await Hotel.findOne({ owner: ownerId })
    if (!hotel) {
      return res.status(404).json({ success: false, message: "No hotel found for this owner" })
    }

    const bookings = await Booking.find({ hotel: hotel._id }).populate("room hotel user").sort({ createdAt: -1 })
    const totalBookings = bookings.length
    const totalRevenue = bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0)

    return res.status(200).json({
      success: true,
      dashBoardData: {
        totalBookings,
        totalRevenue,
        bookings,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: err.message })
  }
}


module.exports={getHotelBookings,getUserBookings,createBooking,checkAvailability,checkAvailabilityAPI}
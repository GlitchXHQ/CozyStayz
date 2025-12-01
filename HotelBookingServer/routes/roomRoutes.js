const express = require('express')
const upload = require('../middleware/uploadMiddleware')
const protect = require('../middleware/authMiddleware')
const { getRooms, getOwnerRooms, toggleRoomAvailability, createRoom } = require('../controllers/roomController')

const roomRouter = express.Router()

roomRouter.post('/', protect, upload.array('images', 4), createRoom)
roomRouter.get('/', getRooms)
roomRouter.get('/owner', protect, getOwnerRooms)
roomRouter.put('/:id/availability', protect, toggleRoomAvailability)

module.exports = roomRouter

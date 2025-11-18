import React from 'react'
import NavBar from './components/NavBar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import AllRooms from './pages/AllRooms'
import RoomDetails from './pages/RoomDetails'
import MyBookings from './pages/MyBookings'
import About from './pages/About'
import HotelRegistration from './components/HotelRegistration'
import Layout from './pages/hotelOwner/Layout'
import DashBoard from './pages/hotelOwner/DashBoard'
import AddRoom from "./pages/hotelOwner/AddRoom"
import ListRoom from './pages/hotelOwner/ListRoom'
import Navbar from './components/hotelOwner/NavBar'

const App = () => {

  const ownerPath=useLocation().pathname.includes('owner')

  return (
    <div>
      {!ownerPath && <NavBar/>}
      {ownerPath && <Navbar/>}
      {!ownerPath && <HotelRegistration/>}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/About' element={<About/>}/>          
          <Route path='/room' element={<AllRooms/>}/>
          <Route path='/room/:id' element={<RoomDetails/>}/>
          <Route path='/my-bookings' element={<MyBookings/>}/>
          <Route path='/owner' element={<Layout/>}>
            <Route index element={<DashBoard/>}/>
            <Route path='add-room' element={<AddRoom/>}/>
            <Route path='list-room' element={<ListRoom/>}/>
          </Route>
        </Routes>
      </div>
      <Footer/>
    </div>
  )
}

export default App
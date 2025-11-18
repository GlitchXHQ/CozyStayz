import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets, dashboardDummyData } from '../../assets/assets'

const DashBoard = () => {
  const[dashBoardData,setDashBoardData]=useState(dashboardDummyData)

  return (
    <div>
      <Title align="left" font="outfit" title="Dashboard"
      subTitle="Monitor Your Room Listings, track Bookings and analyze revenue-all in one place. Stay updated with real-time insights to ensure smooth operations"
      />

      <div className='flex gap-4 my-8'>
        <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
          <img src={assets.totalBookingIcon} alt="Booking-Icon" className='max:sm-hidden h-10'/>
          <div className='flex flex-col sm:ml-4 font-medium'>
            <p className='text-blue-500 text-lg'>Total Booking</p>
            <p className='text-neutral-400 text-base'>{dashBoardData.totalBookings}</p>
          </div>
        </div>

        <div className='flex gap-4 my-8'>
        <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
          <img src={assets.totalRevenueIcon} alt="Revenue-Icon" className='max:sm-hidden h-10'/>
          <div className='flex flex-col sm:ml-4 font-medium'>
            <p className='text-blue-500 text-lg'>Total Revenue</p>
            <p className='text-neutral-400 text-base'>${dashBoardData.totalRevenue}</p>
          </div>
        </div>
      </div>
    </div>

    <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Bookings</h2>
    <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
      <table className='w-full'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Name</th>
            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total Amount</th>
            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Payment Status</th>
          </tr>
        </thead>
        <tbody className='text-sm'>
          {dashBoardData.bookings.map((item,index)=>(
            <tr key={index}>
              <td
              className='py-3 px-4 text-gray-700 border-t border-gray-300'>{item.user.username}</td>
              <td
              className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>{item.room.roomType}</td>
              <td
              className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>${item.totalPrice}</td>
              
              <td className='py-3 px-4 border-t border-gray-300 flex pl-10 md:pl-20'>
                <button
                className={`py-1 px-3 text-sm rounded-full max-auto ${item.isPaid? "bg-green-500 text-green-800"
                  :"bg-yellow-500 text-yellow-800"
                }`}>{item.isPaid? "Completed":"Pending"}</button>
              </td>
            </tr> 
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )
}

export default DashBoard
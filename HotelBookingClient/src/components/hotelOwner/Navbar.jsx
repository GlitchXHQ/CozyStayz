import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { UserButton } from '@clerk/clerk-react'

const Navbar = () => {
  return (
    <div className='flex items-center justify-between px-4 md:px-8
    border-b border-gray-300 py-3 bg-white transition-all
    duration-300'>
        <Link to={"/"}>
            <div className='flex items-center gap-2 font-bold text-xl cursor-pointer'>
              <img src={assets.guestsIcon} alt="logo" className='h-7' />
              <h2>CozyStayz</h2>
            </div>
        </Link>
        <UserButton/>
    </div>
  )
}

export default Navbar
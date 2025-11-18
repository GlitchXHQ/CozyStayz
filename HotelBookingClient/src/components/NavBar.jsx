import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { CiMenuBurger } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

const links = [
  { path: '/', location: "Home" },
  { path: '/room', location: "Hotels" },
  { path: '/About', location: "About" },
  { path: '/Experience', location: "Experience" },
];

const BookIcon = ()=>(
    <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
</svg>
)

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { openSignIn } = useClerk()
  const {user}=useUser()
  const navigate=useNavigate()
  const location=useLocation()

  const isHome=location.pathname==='/';

  useEffect(() => {
    if(location.pathname!=='/')
    {
        setScrolled(true)
        return
    }
    else{
        setScrolled(false)
    }
    setScrolled(prev=>location.pathname!=='/'?true:prev)

    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
      <div
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between 
        lg:px-20 sm:px-10 py-4 transition-all duration-300 ease-in-out
        ${scrolled ? "bg-white shadow-md" : "bg-transparent"}
        ${isHome ? (scrolled ? "text-black" : "text-white") : "text-black"}
        `}
      >


      {/* Logo */}
      <Link to={"/"}>
        <div className='flex items-center gap-2 font-bold text-xl cursor-pointer'>
          <img src={assets.guestsIcon} alt="logo" className='h-7' />
          <h2>CozyStayz</h2>
        </div>
      </Link>

      {/* Desktop Menu */}
      <div className='hidden lg:flex items-center gap-10 text-lg font-medium'>
        {links.map((val, key) => (
          <Link key={key} to={val.path}>
            <button className='cursor-pointer hover:underline'>{val.location}</button>
          </Link>
        ))}
      </div>

      {/* Desktop Login */}
      {user?
            (
                <div className='hidden lg:flex items-center gap-5 text-lg'>
                 <UserButton>
                    <UserButton.MenuItems>
                        <UserButton.Action label='My Bookings' labelIcon={<BookIcon/>} onClick={()=>navigate('/my-bookings')}/>
                    </UserButton.MenuItems>    
                </UserButton>
                </div>
            ):(
                <div className='hidden lg:flex items-center gap-5 text-lg'>
                <button onClick={openSignIn} className='border p-2 rounded-xl bg-black text-white cursor-pointer'>
                Login
                </button>
            </div>
            )}

      {/* Mobile Menu Icon */}
      <div className='lg:hidden flex flex-row items-center gap-3'>
        <div>
            {user?
            (
                <div>
                 <UserButton>
                    <UserButton.MenuItems>
                        <UserButton.Action label='My Bookings' labelIcon={<BookIcon/>} onClick={()=>navigate('/my-bookings')}/>
                    </UserButton.MenuItems>    
                </UserButton>
                </div>
            ):(
                <div className='hidden lg:flex items-center text-lg'>
                <button onClick={openSignIn} className='border p-2 rounded-xl bg-black text-white cursor-pointer'>
                Login
                </button>
            </div>
            )}
        </div>
        <CiMenuBurger onClick={() => setOpen(!open)} className='text-2xl cursor-pointer' />
        {open && (
          <div className={`fixed top-0 left-0 w-full h-full bg-white text-black flex flex-col items-center justify-center gap-10 text-xl font-semibold 
            transform transition-transform duration-500 ease-in-out 
            ${open ? "translate-x-0" : "-translate-x-full"} z-40`}>
            
            <IoIosClose onClick={() => setOpen(false)} className="absolute top-10 right-10 text-4xl cursor-pointer" />
            {links.map((val, key) => (
              <Link key={key} to={val.path} onClick={() => setOpen(false)}>
                <button>{val.location}</button>
              </Link>
            ))}

            

          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;

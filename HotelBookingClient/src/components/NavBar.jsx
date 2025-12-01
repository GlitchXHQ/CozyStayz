import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CiMenuBurger } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import { UserButton } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const links = [
  { path: "/", name: "Home" },
  { path: "/room", name: "Hotels" },
  { path: "/About", name: "About" },
  { path: "/Experience", name: "Experience" },
];

const BookIcon = () => (
  <svg className="w-4 h-4 text-gray-700" aria-hidden="true" fill="none" viewBox="0 0 24 24">
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
    />
  </svg>
);

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === "/";

  const { user, navigate, isOwner, setShowHotelReg, openSignIn } = useAppContext();

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <header
        className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-300 
        ${scrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-transparent"} 
        ${isHome ? (scrolled ? "text-black" : "text-white") : "text-black"} `}
      >
        <div className="flex items-center justify-between lg:px-20 sm:px-10 px-6 py-4">

          {/* Logo */}
          <Link to="/">
            <div className="flex items-center gap-2 font-bold text-xl cursor-pointer">
              <img src={assets.guestsIcon} alt="logo" className="h-7" />
              CozyStayz
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-10 text-lg font-medium">
            {links.map(({ path, name }) => (
              <Link key={path} to={path}>
                <span
                  className={`cursor-pointer hover:underline underline-offset-4 ${
                    location.pathname === path && "font-semibold underline"
                  }`}
                >
                  {name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-6">
            {user && (
              <button
                className="border px-4 py-1 text-sm font-light rounded-full hover:bg-gray-100 transition"
                onClick={() => (isOwner ? navigate("/owner") : setShowHotelReg(true))}
              >
                {isOwner ? "Dashboard" : "List Your Hotel"}
              </button>
            )}

            {user ? (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="My Bookings"
                    labelIcon={<BookIcon />}
                    onClick={() => navigate("/my-bookings")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <button
                onClick={openSignIn}
                className="border px-4 py-1 rounded-xl bg-black text-white hover:bg-gray-900 transition"
              >
                Login
              </button>
            )}
          </div>

          {/* MOBILE: burger icon only */}
          <div className="lg:hidden flex items-center">
            <CiMenuBurger onClick={() => setOpen(true)} className="text-3xl cursor-pointer" />
          </div>
        </div>
      </header>

      {/* MOBILE FULLSCREEN MENU */}
      {open && (
        <div className="fixed inset-0 bg-white text-black z-[99999] flex flex-col items-center justify-center gap-8 text-2xl font-semibold">
          <IoIosClose
            onClick={() => setOpen(false)}
            className="absolute top-7 right-7 text-5xl cursor-pointer"
          />

          {links.map(({ path, name }) => (
            <Link key={path} to={path} onClick={() => setOpen(false)}>
              <button className="hover:underline">{name}</button>
            </Link>
          ))}

          {/* List Your Hotel / Dashboard */}
          {user && (
            <button
              className="border px-6 py-2 rounded-full text-lg hover:bg-gray-100 transition"
              onClick={() => {
                setOpen(false);
                isOwner ? navigate("/owner") : setShowHotelReg(true);
              }}
            >
              {isOwner ? "Dashboard" : "List Your Hotel"}
            </button>
          )}

          {/* Login / User */}
          {user ? (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="My Bookings"
                  labelIcon={<BookIcon />}
                  onClick={() => {
                    setOpen(false);
                    navigate("/my-bookings");
                  }}
                />
              </UserButton.MenuItems>
            </UserButton>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
                openSignIn();
              }}
              className="border px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-900 transition"
            >
              Login
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default NavBar;

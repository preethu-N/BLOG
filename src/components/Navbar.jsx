import React from "react";
import { Link } from "react-router-dom";
import img1 from "../images/download.png";

const Navbar = ({ isLoggedIn, handleLogout }) => {
  return (
    <nav className="w-full bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0">
          <img
            src={img1}
            alt="EchoBlog Logo"
            className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
          />

          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
              Echo<span className="text-[#5850ec]">Blog</span>
            </h1>

            <p className="text-[9px] sm:text-xs text-gray-500 font-semibold tracking-wider uppercase mt-1">
              Share Your Stories
            </p>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
          {isLoggedIn && (
            <Link
              to="/create-post"
              className="text-[#5850ec] hover:text-indigo-800 font-semibold px-2 sm:px-4 py-2 text-sm sm:text-base transition"
            >
              New Post
            </Link>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-base transition cursor-pointer"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/sign"
              className="bg-[#5850ec] hover:bg-indigo-700 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-base transition"
            >
              Sign In
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
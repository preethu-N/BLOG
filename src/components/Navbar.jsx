import React from "react";
import { Link } from "react-router-dom";
import img1 from "../images/download.png";

const Navbar = ({ isLoggedIn, handleLogout }) => {
  return (
    <nav className="w-full bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <img
            src={img1}
            alt="EchoBlog Logo"
            className="w-14 h-14 object-contain"
          />

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Echo<span className="text-[#5850ec]">Blog</span>
            </h1>

            <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">
              Share Your Stories
            </p>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {isLoggedIn && (
            <Link
              to="/create-post"
              className="text-[#5850ec] hover:text-indigo-800 font-semibold px-4 py-2 transition"
            >
              New Post
            </Link>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold transition cursor-pointer"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/sign"
              className="bg-[#5850ec] hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition"
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
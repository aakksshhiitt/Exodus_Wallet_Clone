import React from "react";
import { NavLink } from "react-router-dom";
import { FaSearch } from "react-icons/fa"; // install with: npm install react-icons
import "./nav.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand">💠 Exodus Clone</div>

        {/* Links */}
        <div className="navbar-links">
          <NavLink to="/wallet" className="nav-item">
            Wallet
          </NavLink>
          <NavLink to="/history" className="nav-item">
            History
          </NavLink>
          <NavLink to="/willdecidelater" className="nav-item">
            Will Decide Later
          </NavLink>
        </div>

        {/* Search */}
        <div className="navbar-search">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
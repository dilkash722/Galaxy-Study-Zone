"use client";

import { useState, useEffect } from "react";
import { isLoggedIn, loginAdmin, logoutAdmin } from "../lib/auth";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  useEffect(() => setLoggedIn(isLoggedIn()), []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLoginSubmit = () => {
    if (credentials.username === "dilkash" && credentials.password === "1524") {
      loginAdmin();
      setLoggedIn(true);
      setShowLoginModal(false);
      setShowSuccessPopup(true);
      setCredentials({ username: "", password: "" });
      setTimeout(() => setShowSuccessPopup(false), 2000);
    } else {
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 2000);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setLoggedIn(false);
  };

  const publicLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "View Students", href: "/view-students" },
  ];

  const privateLinks = [
    { name: "Admission", href: "/admission" },
    { name: "Payment", href: "/payment" },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 fixed w-full z-50 shadow-md text-white overflow-x-hidden">
      <div className="w-full flex justify-between items-center h-16 px-4 md:px-8">
        {/* Logo */}
        <div className="text-2xl font-bold">Galaxy Study Zone</div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          {publicLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-yellow-300 transition-colors font-medium"
            >
              {link.name}
            </a>
          ))}

          {loggedIn &&
            privateLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-yellow-300 transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}

          {!loggedIn ? (
            <button
              onClick={() => setShowLoginModal(true)}
              className="ml-4 px-3 py-1.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 shadow text-white font-semibold transition"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="ml-4 px-3 py-1.5 bg-gradient-to-r from-red-400 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 shadow text-white font-semibold transition"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white text-2xl focus:outline-none"
          >
            {menuOpen ? "\u2715" : "\u2630"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-2 pt-2 pb-4 space-y-1 shadow-lg">
          {publicLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded hover:bg-blue-700 transition-colors font-medium text-white"
            >
              {link.name}
            </a>
          ))}
          {loggedIn &&
            privateLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded hover:bg-blue-700 transition-colors font-medium text-white"
              >
                {link.name}
              </a>
            ))}

          {!loggedIn ? (
            <button
              onClick={() => {
                setShowLoginModal(true);
                setMenuOpen(false);
              }}
              className="w-full px-3 py-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 shadow text-white font-semibold transition"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 bg-gradient-to-r from-red-400 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 shadow text-white font-semibold transition"
            >
              Logout
            </button>
          )}
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-gray-100 p-8 rounded-2xl shadow-2xl w-96 relative animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 text-center">
              Admin Login
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLoginSubmit}
                className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 shadow transition"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-4 flex flex-col items-center space-y-3 w-80">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 text-white text-2xl">
              &#10003;
            </div>
            <span className="text-gray-900 font-semibold text-center">
              Login successfully!
            </span>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-4 flex flex-col items-center space-y-3 w-80">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500 text-white text-2xl">
              &#10005;
            </div>
            <span className="text-gray-900 font-semibold text-center">
              Invalid username or password
            </span>
          </div>
        </div>
      )}
    </nav>
  );
}

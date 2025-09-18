// components/Navbar.jsx
"use client";

import { useState, useEffect } from "react";
import { isLoggedIn, loginAdmin, logoutAdmin } from "../lib/auth";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  useEffect(() => {
    const ok = isLoggedIn();
    setLoggedIn(ok);
    // if not logged in, force show modal on load
    if (!ok) setShowLoginModal(true);
  }, []);

  const handleLoginSubmit = async () => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (data.ok) {
        loginAdmin(data.token);
        setLoggedIn(true);
        setShowLoginModal(false);
        setShowSuccessPopup(true);
        setCredentials({ username: "", password: "" });
        setTimeout(() => setShowSuccessPopup(false), 1500);
      } else {
        setShowErrorPopup(true);
        setTimeout(() => setShowErrorPopup(false), 1500);
      }
    } catch (err) {
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 1500);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setLoggedIn(false);
    setShowLoginModal(true);
    // redirect to home/root so protected pages are closed
    router.push("/");
  };

  const privateLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Admission", href: "/admission" },
    { name: "Payment", href: "/payment" },
  ];

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 fixed w-full z-50 shadow-lg text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-20">
        {/* Logo + Tagline */}
        <div className="flex flex-col">
          <span className="text-2xl font-bold tracking-wide">
            Galaxy Study Zone
          </span>
          <span className="text-sm italic text-yellow-200">
            “Jahan Har Bachha Ek Taara Hai”
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          {loggedIn &&
            privateLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-yellow-300 transition-colors font-medium text-lg"
              >
                {link.name}
              </a>
            ))}

          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 bg-red-500 rounded-xl hover:bg-red-600 shadow transition font-semibold"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="ml-4 px-4 py-2 bg-blue-500 rounded-xl hover:bg-blue-600 shadow transition font-semibold"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-3xl focus:outline-none"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          {loggedIn &&
            privateLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-white font-medium"
              >
                {link.name}
              </a>
            ))}

          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 bg-red-500 rounded-xl hover:bg-red-600 shadow text-white font-semibold transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                setShowLoginModal(true);
                setMenuOpen(false);
              }}
              className="w-full px-3 py-2 bg-blue-500 rounded-xl hover:bg-blue-600 shadow text-white font-semibold transition"
            >
              Login
            </button>
          )}
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-96">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
              Admin Login
            </h2>

            <div className="space-y-4">
              <div>
                <label className="font-medium text-gray-700 mb-1 block">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700 mb-1 block">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLoginSubmit}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-600"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success / Error Popups */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg px-6 py-4 flex flex-col items-center w-80">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 text-white text-2xl">
              &#10003;
            </div>
            <span className="text-gray-900 font-semibold text-center">
              Login successfully!
            </span>
          </div>
        </div>
      )}
      {showErrorPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg px-6 py-4 flex flex-col items-center w-80">
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

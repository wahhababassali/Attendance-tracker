import React from 'react';
import './App.css';
import Home from './home.jsx';

function App() {

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-linear-to-r from-indigo-600 to-blue-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              {/* sidebar toggle removed */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Attendance Tracker</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <i className="fas fa-school text-indigo-100 text-lg"></i>
                    <p className="text-indigo-100 text-sm font-medium">Manage attendance with ease</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* User Profile Icon */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-white hover:bg-white/20 rounded-lg transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-white font-bold">
                AD
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Main Page Content (full width) */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Home />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600 text-sm">
          <p>© 2025 Attendance Tracker. All rights reserved. Built with ❤️</p>
          {/* cspell:disable */}
          <p className="mt-2 text-xs text-gray-500">
            Site created by <strong>ABDULAI A. WAHHAB</strong> | 
            <a href="mailto:wahhababassali246@gmail.com" className="text-indigo-600 hover:text-indigo-700 ml-1">wahhababassali246@gmail.com</a>
          </p>
          {/* cspell:enable */}
        </div>
      </footer>
    </div>
  );
}

export default App;
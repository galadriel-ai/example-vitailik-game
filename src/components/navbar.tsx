import React from 'react';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className="text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-end">
          {/* Navigation Links */}
          <Link href="https://galadriel.com" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">about</Link>
          <Link href="/highscores" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">scoreboard</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
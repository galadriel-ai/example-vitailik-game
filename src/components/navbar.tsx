import React from 'react';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className="text-white my-5 font-PPMondwest text-xl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-end">
          <Link href="/" className="px-3 py-2 rounded-md font-medium hover:bg-gray-700">home</Link>
          <Link href="https://discord.gg/4UuffUbkjb" target="_blank" className="px-3 py-2 rounded-md font-medium hover:bg-gray-700">discord / faucet</Link>
          <Link href="/scoreboard" className="px-3 py-2 rounded-md font-medium hover:bg-gray-700">scoreboard</Link>
          <Link href="https://galadriel.com" target='_blank' className="px-3 py-2 rounded-md font-medium hover:bg-gray-700">about</Link>
          <Link href="https://twitter.com/Galadriel_AI" target='_blank' className="px-3 py-2 rounded-md font-medium hover:bg-gray-700">x</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
'use client';

import Link from 'next/link';

const Navigation = () => {

  return (
    <nav className="backdrop-blur-sm p-4">
      <div className="max-w-7xl mx-auto flex justify-between backdrop-blur-sm items-center">
        <ul className="flex space-x-4 items-center">
          <li><Link href="/plant-identifier" className="hover:text-[dad7cd] transition font-thin">
          <button className="bg-[#52B788] text-white px-4 py-1 rounded hover:bg-[#3E8E69] transition font-thin flex items-center">Start for free</button>
          </Link></li>
          <li><Link href="/everything-check" className="hover:text-[dad7cd] transition font-thin">
          <button className="bg-[#52B788] text-white px-4 py-1 rounded hover:bg-[#3E8E69] transition font-thin flex items-center">Master AI</button>
          </Link></li>
          <li><Link href="/" className="hover:text-[dad7cd] transition font-thin"></Link></li>
          <li><Link href="/about" className="hover:text-[dad7cd] transition font-thin flex items-center">About</Link></li>
          <li><Link href="/contact" className="hover:text-[dad7cd] transition font-thin">Contact</Link></li>
          <li><Link href="/help" className="hover:text-[dad7cd] transition font-thin">Help</Link></li>
          <li><Link href="/login" className="hover:text-[dad7cd] transition font-thin">login</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;

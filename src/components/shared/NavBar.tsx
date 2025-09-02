"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Home, BookOpen } from "lucide-react";

interface NavLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links: NavLink[] = [
    { name: "Home", href: "/", icon: <Home className='h-5 w-5' /> },
    {
      name: "Courses",
      href: "/courses",
      icon: <BookOpen className='h-5 w-5' />,
    },
  ];

  return (
    <nav className='bg-white shadow-md sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link
              href='/'
              className='text-2xl font-bold bg-gradient-to-r from-[#00564A] to-[#00A892] bg-clip-text text-transparent'>
              Datapollex LMS
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className='hidden md:flex items-center space-x-4'>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='flex items-center space-x-2 text-gray-700 hover:text-[#00A892] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200'>
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          <div className='flex items-center justify-center gap-2.5'>
            <Link
              href='/login'
              className='px-4  text-center py-2  bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] text-white rounded-full text-sm font-medium'>
              Login
            </Link>
            <Link
              href='/register'
              className='px-4  text-center py-2  bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] text-white rounded-full text-sm font-medium'>
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden flex items-center'>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='text-gray-700 hover:text-blue-600 focus:outline-none'>
              {isMobileMenuOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden bg-white shadow-md'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 animate-slide-down'>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='flex items-center space-x-2 text-gray-700 hover:text-blue-600  px-3 py-2 rounded-md text-base font-medium'
                onClick={() => setIsMobileMenuOpen(false)}>
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

"use client";
import Link from "next/link";
import { BookOpen, Home, Mail, Phone } from "lucide-react";

const Footer = () => {
  const links = [
    { name: "Home", href: "/", icon: <Home className='h-5 w-5' /> },
    {
      name: "Courses",
      href: "/courses",
      icon: <BookOpen className='h-5 w-5' />,
    },
  ];

  return (
    <footer className='bg-white shadow-inner'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Brand Section */}
          <div className='flex flex-col items-center md:items-start'>
            <Link
              href='/'
              className='text-2xl font-bold bg-gradient-to-r from-[#00564A] to-[#00A892] bg-clip-text text-transparent mb-4'>
              Datapollex LMS
            </Link>
            <p className='text-gray-600 text-sm text-center md:text-left'>
              Empowering learning with innovative solutions and engaging
              courses.
            </p>
          </div>

          {/* Navigation Links */}
          <div className='flex flex-col items-center md:items-start'>
            <h3 className='text-lg font-semibold text-gray-700 mb-4'>
              Quick Links
            </h3>
            <div className='flex flex-col space-y-2'>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className='flex items-center space-x-2 text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200'>
                  {/* {link.icon} */}
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className='flex flex-col items-center md:items-start'>
            <h3 className='text-lg font-semibold text-gray-700 mb-4'>
              Contact Us
            </h3>
            <div className='flex flex-col space-y-2 text-gray-600 text-sm'>
              <a
                href='mailto:support@datapollex.com'
                className='flex items-center space-x-2 hover:text-blue-600 transition-colors duration-200'>
                <Mail className='h-5 w-5' />
                <span>support@datapollex.com</span>
              </a>
              <a
                href='tel:+1234567890'
                className='flex items-center space-x-2 hover:text-blue-600 transition-colors duration-200'>
                <Phone className='h-5 w-5' />
                <span>+1 (234) 567-890</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm'>
          <p>
            &copy; {new Date().getFullYear()} Datapollex LMS. All rights
            reserved.
          </p>
          <div className='flex space-x-4 mt-4 md:mt-0'>
            <Link
              href='/privacy'
              className='hover:text-blue-600 transition-colors duration-200'>
              Privacy Policy
            </Link>
            <Link
              href='/terms'
              className='hover:text-blue-600 transition-colors duration-200'>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

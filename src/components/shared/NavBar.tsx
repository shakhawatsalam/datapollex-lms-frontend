"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  Menu,
  X,
  Home,
  BookOpen,
  User,
  LogOut,
  PlusCircle,
} from "lucide-react";
import {
  selectIsAuthenticated,
  selectCurrentUser,
  selectAuthLoading,
  logout,
} from "@/redux/features/auth/authSlice";
import {
  useGetProfileQuery,
  useLogoutUserMutation,
} from "@/redux/features/auth/authApi";
import { clearToken } from "@/utils/tokenStorage";

interface NavLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null); // State for token
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux state
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const isAuthLoading = useSelector(selectAuthLoading);
  // Get token on client-side mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("accessToken"));
    }
  }, []);
  console.log(user);
  // API hooks
  const [logoutUser] = useLogoutUserMutation();
  const {
    data: userData,
    isLoading: isProfileLoading,
    error,
  } = useGetProfileQuery(undefined, {
    skip: !token || !!user, // Use token state instead of localStorage
  });

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch user profile:", error);
      clearToken();
      dispatch(logout());
      router.push("/login");
    }
  }, [error, router, dispatch]);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    clearToken();
    dispatch(logout());
    router.push("/login");
    setIsMobileMenuOpen(false);
  };

  const commonLinks: NavLink[] = [
    { name: "Home", href: "/", icon: <Home className='h-5 w-5' /> },
    {
      name: "Courses",
      href: "#",
      icon: <BookOpen className='h-5 w-5' />,
    },
  ];

  const userLinks: NavLink[] = [
    ...commonLinks,
    {
      name: "My Courses",
      href: "/my-courses",
      icon: <BookOpen className='h-5 w-5' />,
    },
  ];

  const adminLinks: NavLink[] = [
    ...commonLinks,
    {
      name: "Manage Courses",
      href: "/dashboard/all-courses",
      icon: <PlusCircle className='h-5 w-5' />,
    },
    {
      name: "My Courses",
      href: "/my-courses",
      icon: <BookOpen className='h-5 w-5' />,
    },
  ];

  const authLinks: NavLink[] = [
    { name: "Login", href: "/login", icon: <User className='h-5 w-5' /> },
    { name: "Register", href: "/register", icon: <User className='h-5 w-5' /> },
  ];

  // Determine which links to show based on user role
  const links =
    isAuthenticated && user?.role === "admin"
      ? adminLinks
      : isAuthenticated
      ? userLinks
      : commonLinks;

  // Show loading state while initializing auth
  const isLoading = isAuthLoading || isProfileLoading;

  // Get current user data (prefer Redux state over API response)
  const currentUser = user || userData?.data?.user;

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
            {isLoading ? (
              <div className='flex items-center space-x-2'>
                <div className='animate-pulse bg-gray-300 h-4 w-16 rounded'></div>
                <div className='animate-pulse bg-gray-300 h-8 w-20 rounded'></div>
              </div>
            ) : (
              <>
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className='flex items-center space-x-2 text-gray-700 hover:text-[#00A892] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200'>
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}
                {isAuthenticated && currentUser ? (
                  <div className='flex items-center justify-center gap-2.5'>
                    <Link
                      href='#'
                      className='flex items-center space-x-2 text-gray-700 hover:text-[#00A892] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200'>
                      <User className='h-5 w-5' />
                      <span>{currentUser.name || "Profile"}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='px-4 text-center py-2 bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] text-white rounded-full text-sm font-medium hover:from-[#2D7F74] hover:to-[#3DB6A6] transition-all duration-200'>
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className='flex items-center justify-center gap-2.5'>
                    {authLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className='px-4 text-center py-2 bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] text-white rounded-full text-sm font-medium hover:from-[#2D7F74] hover:to-[#3DB6A6] transition-all duration-200'>
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden flex items-center'>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='text-gray-700 hover:text-[#00A892] focus:outline-none transition-colors duration-200'>
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
            {isLoading ? (
              <div className='px-3 py-2 space-y-2'>
                <div className='animate-pulse bg-gray-300 h-4 w-24 rounded'></div>
                <div className='animate-pulse bg-gray-300 h-8 w-20 rounded'></div>
              </div>
            ) : (
              <>
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className='flex items-center space-x-2 text-gray-700 hover:text-[#00A892] px-3 py-2 rounded-md text-base font-medium transition-colors duration-200'
                    onClick={() => setIsMobileMenuOpen(false)}>
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}
                {isAuthenticated && currentUser ? (
                  <>
                    <Link
                      href='/profile'
                      className='flex items-center space-x-2 text-gray-700 hover:text-[#00A892] px-3 py-2 rounded-md text-base font-medium transition-colors duration-200'
                      onClick={() => setIsMobileMenuOpen(false)}>
                      <User className='h-5 w-5' />
                      <span>{currentUser.name || "Profile"}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='flex items-center space-x-2 text-gray-700 hover:text-[#00A892] px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200'>
                      <LogOut className='h-5 w-5' />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  authLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className='flex items-center space-x-2 text-gray-700 hover:text-[#00A892] px-3 py-2 rounded-md text-base font-medium transition-colors duration-200'
                      onClick={() => setIsMobileMenuOpen(false)}>
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface HeaderProps {
  showNavigation?: boolean;
  showLoginWhenNotAuth?: boolean;
}

export const Header = ({
  showNavigation = true,
  showLoginWhenNotAuth = false,
}: HeaderProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">
                ProtoSpirit
              </div>
            </Link>
          </div>

          {/* Navigation */}
          {showNavigation && isAuthenticated && (
            <nav className="hidden space-x-6 md:flex">
              <Link
                to="/create"
                className="flex transform items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>Create App</span>
              </Link>
              <Link
                to="/projects"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Projects
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Admin
                </Link>
              )}
            </nav>
          )}

          {/* User menu or Login */}
          <div className="relative">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center rounded-md p-2 text-sm text-gray-700 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-medium text-white">
                    {user?.displayName?.charAt(0)?.toUpperCase() ||
                      user?.username?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </div>
                  <span className="hidden md:block">
                    {user?.displayName || user?.username}
                  </span>
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                    <div className="border-b border-gray-100 px-4 py-2 text-sm text-gray-500">
                      <div className="font-medium">
                        {user?.displayName || user?.username}
                      </div>
                      <div className="text-xs">{user?.email}</div>
                      <div className="text-xs capitalize">{user?.role}</div>
                    </div>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </>
            ) : (
              showLoginWhenNotAuth && (
                <Link
                  to="/login"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Sign In
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          {((showNavigation && isAuthenticated) ||
            (!isAuthenticated && showLoginWhenNotAuth)) && (
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-md p-2 text-gray-700 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-2 border-t border-gray-200 px-2 pt-2 pb-3 sm:px-3">
              {isAuthenticated ? (
                <>
                  {showNavigation && (
                    <>
                      <Link
                        to="/create"
                        className="flex items-center space-x-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-base font-semibold text-white shadow-md hover:from-blue-700 hover:to-purple-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span>Create App</span>
                      </Link>
                      <Link
                        to="/projects"
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Projects
                      </Link>
                      {user?.role === "admin" && (
                        <Link
                          to="/admin"
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin
                        </Link>
                      )}
                    </>
                  )}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="px-3 py-2 text-sm text-gray-500">
                      <div className="font-medium">
                        {user?.displayName || user?.username}
                      </div>
                      <div className="text-xs">{user?.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                showLoginWhenNotAuth && (
                  <Link
                    to="/login"
                    className="block rounded-lg bg-blue-600 px-4 py-3 text-center text-base font-semibold text-white hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

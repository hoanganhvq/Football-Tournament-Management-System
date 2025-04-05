import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Logo from './logo';
import { useAuth } from '../AuthContext';
import { toast } from 'react-toastify';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth(); // Use isAuthenticated to check login status
  const [userName, setUserName] = useState(null);
  const [activeItem, setActiveItem] = useState('Home');
  const [userProfilePic,setUserProfilePic] = useState(null);
  // Fetch user data from localStorage on mount and when auth changes
  useEffect(() => {
    const user = localStorage.getItem('user');
    console.log('user',JSON.parse(user));
    if (user && isAuthenticated) {
      setUserName(JSON.parse(user).name);
      setUserProfilePic(JSON.parse(user).profilePic);
    } else {
      setUserName(null);
      setUserProfilePic(null);
    }
  }, [isAuthenticated]); // Re-run when authentication status changes

  const navigationItems = [
    { name: 'Home', href: '/Home' },
    { name: 'Tournament', href: '/tournaments' },
    { name: 'Team', href: '/clubs' },
  ];

  const handleClick = (itemName) => {
    setActiveItem(itemName);
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    // Update AuthContext
    logout();

    // Show success toast
    toast.success('You have been logged out successfully!', {
      autoClose: 1500,
    });
    
    alert("You sign out successfully!");
    // Redirect to sign-in page after toast
    navigate('/sign-in');
  
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button
                  className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  aria-label={open ? 'Close main menu' : 'Open main menu'}
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div className="flex-shrink-0">
                  <Link to="/Home" aria-label="Home page">
                    <Logo />
                  </Link>
                </div>
                <div className="flex items-center justify-end flex-1">
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4 items-center">
                      {navigationItems.map((item) => (
                        <div key={item.name} className="flex items-center">
                          {item.name === 'Tournament' || item.name === 'Team' ? (
                            <Menu as="div" className="relative">
                              <Menu.Button
                                className={classNames(
                                  activeItem === item.name
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                  'rounded-md px-3 py-2 text-sm font-medium'
                                )}
                              >
                                {item.name}
                              </Menu.Button>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <Menu.Items className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-gray-700 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <Link
                                        to={item.href}
                                        className={classNames(
                                             '',
                                          'block px-4 py-2 text-sm text-white'
                                        )}
                                        onClick={() => handleClick(item.name)}
                                      >
                                        {item.name}
                                      </Link>
                                    )}
                                  </Menu.Item>
                                  {item.name === 'Tournament' && (
                                    <>
                                      <Menu.Item>
                                        {({  }) => (
                                          <Link
                                            to="/new-tournament"
                                            className={classNames(
                                              '',
                                              'block px-4 py-2 text-sm text-white'
                                            )}
                                          >
                                            Create Tournament
                                          </Link>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <Link
                                            to="/tournaments-list"
                                            className={classNames(
                                              active ? 'bg-gray-600' : '',
                                              'block px-4 py-2 text-sm text-white'
                                            )}
                                          >
                                            Manage Tournament
                                          </Link>
                                        )}
                                      </Menu.Item>
                                    </>
                                  )}
                                  {item.name === 'Team' && (
                                    <>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <Link
                                            to="/new-club"
                                            className={classNames(
                                              active ? 'bg-gray-600' : '',
                                              'block px-4 py-2 text-sm text-white'
                                            )}
                                          >
                                            Create Team
                                          </Link>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <Link
                                            to="/manage-clubs"
                                            className={classNames(
                                              active ? 'bg-gray-600' : '',
                                              'block px-4 py-2 text-sm text-white'
                                            )}
                                          >
                                            Manage Team
                                          </Link>
                                        )}
                                      </Menu.Item>
                                    </>
                                  )}
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          ) : (
                            <Link
                              onClick={() => handleClick(item.name)}
                              to={item.href}
                              className={classNames(
                                activeItem === item.name
                                  ? 'bg-gray-900 text-white'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'rounded-md px-3 py-2 text-sm font-medium'
                              )}
                            >
                              {item.name}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* User Profile Section */}
                  {isAuthenticated && userName ? (
                    <div className="hidden sm:ml-6 sm:block">
                      <div className="flex items-center">
                        <Menu as="div" className="relative ml-3">
                          <div>
                            <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                              <span className="absolute -inset-1.5" />
                              <span className="sr-only">Open user menu</span>
                              <img
                                className="h-8 w-8 rounded-full"
                                src={userProfilePic}
                                alt="User profile"
                              />
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-700 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    to="/me"
                                    className={classNames(
                                      active ? 'bg-gray-600' : '',
                                      'block px-4 py-2 text-sm text-white'
                                    )}
                                  >
                                    Your Profile
                                  </Link>
                                )}
                              </Menu.Item>
                        
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={handleLogout}
                                    className={classNames(
                                      active ? 'bg-gray-600' : '',
                                      'block w-full text-left px-4 py-2 text-sm text-white'
                                    )}
                                  >
                                    Sign out
                                  </button>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                        <span className="text-white ml-2">{userName}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="hidden sm:ml-6 sm:block">
                      <Link
                        to="/sign-in"
                        className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                      >
                        Sign In
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigationItems.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    onClick={() => handleClick(item.name)}
                    className={classNames(
                      activeItem === item.name
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
                {isAuthenticated && userName ? (
                  <Disclosure.Button
                    as="button"
                    onClick={handleLogout}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium w-full text-left"
                  >
                    Sign Out
                  </Disclosure.Button>
                ) : (
                  <Disclosure.Button
                    as={Link}
                    to="/sign-in"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                  >
                    Sign In
                  </Disclosure.Button>
                )}
              </div>
            </Disclosure.Panel>
          </div>
        </>
      )}
    </Disclosure>
  );
}
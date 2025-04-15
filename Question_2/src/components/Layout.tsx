import { Link, Outlet, useLocation } from 'react-router-dom'
import { FaUsers, FaFire, FaStream, FaComments } from 'react-icons/fa'

const Layout = () => {
    const location = useLocation()
    const { pathname } = location

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            {/* Completely redesigned header */}
            <header className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white shadow-lg">
                <div className="container mx-auto px-6">
                    {/* Top bar with logo */}
                    <div className="flex justify-center py-6 border-b border-purple-800">
                        <div className="flex items-center">
                            <div className="bg-purple-700 p-3 rounded-full mr-4">
                                <FaComments className="text-white text-2xl" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">
                                    <span className="text-white">Pulse</span>
                                    <span className="text-purple-400">
                                        Post
                                    </span>
                                </h1>
                                <p className="text-xs text-gray-300">
                                    Social Media Analytics Platform
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation tabs with improved padding */}
                    <nav className="flex justify-center my-4">
                        <div className="inline-flex rounded-lg overflow-hidden">
                            <Link
                                to="/"
                                className={`px-8 py-4 font-medium ${
                                    pathname === '/'
                                        ? 'bg-purple-700 text-white'
                                        : 'bg-gray-800 text-gray-300'
                                }`}
                            >
                                <div className="flex items-center justify-center">
                                    <FaUsers className="mr-2" />
                                    <span>Top Users</span>
                                </div>
                            </Link>
                            <Link
                                to="/trending"
                                className={`px-8 py-4 font-medium ${
                                    pathname === '/trending'
                                        ? 'bg-purple-700 text-white'
                                        : 'bg-gray-800 text-gray-300'
                                }`}
                            >
                                <div className="flex items-center justify-center">
                                    <FaFire className="mr-2" />
                                    <span>Trending</span>
                                </div>
                            </Link>
                            <Link
                                to="/feed"
                                className={`px-8 py-4 font-medium ${
                                    pathname === '/feed'
                                        ? 'bg-purple-700 text-white'
                                        : 'bg-gray-800 text-gray-300'
                                }`}
                            >
                                <div className="flex items-center justify-center">
                                    <FaStream className="mr-2" />
                                    <span>Feed</span>
                                </div>
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Main content */}
            <main className="container mx-auto p-4 flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-800 text-gray-300 text-center p-4">
                <div className="container mx-auto">
                    <p className="flex items-center justify-center">
                        <span className="text-purple-400 mr-2">©</span>
                        {new Date().getFullYear()} PulsePost Dashboard
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Layout

import React, { useEffect, useState } from 'react'
import { fetchTrendingPosts } from '../services/api'
import { Post } from '../types'
import PostCard from '../components/PostCard'
import { FaChartLine, FaSync } from 'react-icons/fa'
import Loading from '../components/Loading'
import { socket } from '../services/api'

const TrendingPosts: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

    const loadTrendingPosts = async () => {
        try {
            setLoading(true)
            const data = await fetchTrendingPosts()
            setPosts(data)
            setLastUpdate(new Date())
            setError(null)
        } catch (err) {
            setError('Failed to load trending posts. Please try again later.')
            console.error('Error fetching trending posts:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTrendingPosts()

        // Listen for data updates from the server
        socket.on('dataUpdated', () => {
            console.log(
                'Received data update notification, refreshing trending posts'
            )
            loadTrendingPosts()
        })

        // Refresh data every 30 seconds
        const intervalId = setInterval(() => {
            loadTrendingPosts()
        }, 30000)

        return () => {
            socket.off('dataUpdated')
            clearInterval(intervalId)
        }
    }, [])

    const handleManualRefresh = () => {
        loadTrendingPosts()
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md">
                <div className="flex items-center">
                    <FaChartLine className="text-purple-400 text-3xl mr-3" />
                    <h2 className="text-2xl font-bold text-white">
                        Trending Posts
                    </h2>
                </div>

                <div className="flex items-center">
                    {lastUpdate && (
                        <span className="text-sm text-gray-400 mr-3">
                            Last updated: {lastUpdate.toLocaleTimeString()}
                        </span>
                    )}
                    <button
                        onClick={handleManualRefresh}
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md flex items-center transition-colors disabled:opacity-50 shadow-md shadow-purple-700/20"
                    >
                        <FaSync
                            className={`mr-2 ${loading ? 'animate-spin' : ''}`}
                        />
                        Refresh
                    </button>
                </div>
            </div>

            {loading && posts.length === 0 ? (
                <Loading
                    message="Loading trending posts..."
                    color="purple-500"
                />
            ) : error ? (
                <div
                    className="bg-red-900/30 border border-red-600 text-red-300 px-4 py-3 rounded-lg relative"
                    role="alert"
                >
                    <span className="block sm:inline">{error}</span>
                </div>
            ) : posts.length === 0 ? (
                <div
                    className="bg-yellow-900/30 border border-yellow-600 text-yellow-300 px-4 py-3 rounded-lg relative"
                    role="alert"
                >
                    <span className="block sm:inline">
                        No trending posts found.
                    </span>
                </div>
            ) : (
                <div>
                    <div className="p-3 bg-gray-800/50 border border-purple-800/30 rounded-lg mb-4 shadow-inner">
                        <p className="text-purple-300 text-sm">
                            Showing {posts.length} post
                            {posts.length > 1 ? 's' : ''} with the highest
                            number of comments.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                isTrending={true}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default TrendingPosts

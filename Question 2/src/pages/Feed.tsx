import React, { useEffect, useState } from 'react'
import { fetchFeed } from '../services/api'
import { Post } from '../types'
import PostCard from '../components/PostCard'
import { FaStream, FaBell, FaSync } from 'react-icons/fa'
import { socket } from '../services/api'
import Loading from '../components/Loading'

const Feed: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [newPostsCount, setNewPostsCount] = useState<number>(0)
    const [newPosts, setNewPosts] = useState<Post[]>([])
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

    const loadFeed = async () => {
        try {
            setLoading(true)
            const data = await fetchFeed()
            setPosts(data)
            setLastUpdate(new Date())
            setError(null)
        } catch (err) {
            setError('Failed to load feed. Please try again later.')
            console.error('Error fetching feed:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadFeed()

        // Setup socket event listeners
        socket.on('newPost', (post: Post) => {
            setNewPosts((prev) => [post, ...prev])
            setNewPostsCount((prev) => prev + 1)
        })

        socket.on('dataUpdated', () => {
            console.log(
                'Received data update notification, checking for new posts'
            )
            // Instead of immediately refreshing, check if we have pending new posts to show
            // If not, refresh the feed to get any posts we might have missed
            if (newPostsCount === 0) {
                loadFeed()
            }
        })

        // Refresh data every 30 seconds if no new posts notification
        const intervalId = setInterval(() => {
            if (newPostsCount === 0) {
                loadFeed()
            }
        }, 30000)

        return () => {
            // Cleanup socket listeners on component unmount
            socket.off('newPost')
            socket.off('dataUpdated')
            clearInterval(intervalId)
        }
    }, [newPostsCount])

    const showNewPosts = () => {
        setPosts((prev) => [...newPosts, ...prev])
        setNewPosts([])
        setNewPostsCount(0)
        setLastUpdate(new Date())
    }

    const handleManualRefresh = () => {
        // If we have new posts pending, show them first
        if (newPostsCount > 0) {
            showNewPosts()
        } else {
            loadFeed()
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md">
                <div className="flex items-center">
                    <FaStream className="text-purple-400 text-3xl mr-3" />
                    <h2 className="text-2xl font-bold text-white">Feed</h2>
                </div>

                <div className="flex items-center">
                    {newPostsCount > 0 ? (
                        <button
                            onClick={showNewPosts}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full flex items-center transition-colors mr-3 shadow-md shadow-purple-700/20"
                        >
                            <FaBell className="mr-2 animate-pulse" />
                            {newPostsCount} new post
                            {newPostsCount > 1 ? 's' : ''}
                        </button>
                    ) : (
                        lastUpdate && (
                            <span className="text-sm text-gray-400 mr-3">
                                Last updated: {lastUpdate.toLocaleTimeString()}
                            </span>
                        )
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
                <Loading message="Loading your feed..." color="purple-500" />
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
                        No posts found in your feed.
                    </span>
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Feed

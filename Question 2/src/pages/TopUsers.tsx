import React, { useEffect, useState } from 'react'
import { fetchTopUsers } from '../services/api'
import { User } from '../types'
import UserCard from '../components/UserCard'
import { FaTrophy, FaSync } from 'react-icons/fa'
import Loading from '../components/Loading'
import { socket } from '../services/api'

const TopUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

    const loadUsers = async () => {
        try {
            setLoading(true)
            const data = await fetchTopUsers()
            setUsers(data)
            setLastUpdate(new Date())
            setError(null)
        } catch (err) {
            setError('Failed to load top users. Please try again later.')
            console.error('Error fetching top users:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUsers()

        // Listen for data updates from the server
        socket.on('dataUpdated', () => {
            console.log(
                'Received data update notification, refreshing top users'
            )
            loadUsers()
        })

        // Refresh data every 30 seconds
        const intervalId = setInterval(() => {
            loadUsers()
        }, 30000)

        return () => {
            socket.off('dataUpdated')
            clearInterval(intervalId)
        }
    }, [])

    const handleManualRefresh = () => {
        loadUsers()
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md">
                <div className="flex items-center">
                    <FaTrophy className="text-yellow-400 text-3xl mr-3" />
                    <h2 className="text-2xl font-bold text-white">Top Users</h2>
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

            {loading && users.length === 0 ? (
                <Loading message="Loading top users..." color="purple-500" />
            ) : error ? (
                <div
                    className="bg-red-900/30 border border-red-600 text-red-300 px-4 py-3 rounded-lg relative"
                    role="alert"
                >
                    <span className="block sm:inline">{error}</span>
                </div>
            ) : users.length === 0 ? (
                <div
                    className="bg-yellow-900/30 border border-yellow-600 text-yellow-300 px-4 py-3 rounded-lg relative"
                    role="alert"
                >
                    <span className="block sm:inline">No top users found.</span>
                </div>
            ) : (
                <div className="space-y-4">
                    {users.map((user, index) => (
                        <UserCard key={user.id} user={user} rank={index + 1} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default TopUsers

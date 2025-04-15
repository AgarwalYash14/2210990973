import React from 'react'
import { User } from '../types'

interface UserCardProps {
    user: User
    rank: number
}

const UserCard: React.FC<UserCardProps> = ({ user, rank }) => {
    // Define color classes based on rank
    const getRankColors = () => {
        if (rank === 1)
            return 'text-yellow-400 border-yellow-400 bg-yellow-900/20'
        if (rank === 2) return 'text-gray-300 border-gray-300 bg-gray-700/20'
        if (rank === 3) return 'text-amber-600 border-amber-600 bg-amber-900/20'
        return 'text-purple-400 border-purple-500 bg-purple-900/20'
    }

    // Apply special effects for top 3 ranks
    const isTopThree = rank <= 3

    return (
        <div
            className={`bg-gray-800 rounded-lg shadow-md border border-gray-700 p-4 flex items-center 
            transition-all hover-scale shadow-purple ${
                isTopThree ? 'card-border-glow' : ''
            }`}
        >
            <div
                className={`text-3xl font-bold ${getRankColors()} w-12 h-12 flex items-center justify-center rounded-full border-2 mr-4 ${
                    isTopThree ? 'glow-effect' : ''
                }`}
            >
                {rank}
            </div>
            <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-purple-500 mr-4 shadow-md shadow-purple-700/30">
                <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-lg text-white text-shadow">
                    {user.name}
                </h3>
                <p className="text-gray-400">@{user.username}</p>
                <div className="mt-2 bg-purple-900/30 text-purple-300 border border-purple-700/50 inline-block px-3 py-1 rounded-full text-sm">
                    {user.postCount} {user.postCount === 1 ? 'post' : 'posts'}
                </div>
            </div>
        </div>
    )
}

export default UserCard

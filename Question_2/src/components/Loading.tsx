import React from 'react'
import { FaSpinner } from 'react-icons/fa'

interface LoadingProps {
    message?: string
    color?: string
}

const Loading: React.FC<LoadingProps> = ({
    message = 'Loading...',
    color = 'purple-500',
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
                <FaSpinner
                    className={`text-${color} text-4xl animate-spin mb-3`}
                />
                <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 animate-pulse"></div>
            </div>
            <p className="text-gray-400">{message}</p>
        </div>
    )
}

export default Loading

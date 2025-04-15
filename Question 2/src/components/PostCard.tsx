import React, { useState } from 'react'
import { FaComment, FaHeart, FaFire, FaShare } from 'react-icons/fa'
import { Post } from '../types'

interface PostCardProps {
    post: Post
    isTrending?: boolean
}

const PostCard: React.FC<PostCardProps> = ({ post, isTrending = false }) => {
    const [showComments, setShowComments] = useState(false)

    // Format the date
    const formattedDate = new Date(post.createdAt).toLocaleString()

    return (
        <div
            className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-4 border border-gray-700 
            hover-scale shadow-purple ${isTrending ? 'card-border-glow' : ''}`}
        >
            {/* Post Header */}
            <div className="flex items-center p-4 border-b border-gray-700">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-3 border-2 border-purple-500 shadow-md">
                    <img
                        src={post.userAvatar}
                        alt={post.username}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-white text-shadow">
                        {post.username}
                    </h3>
                    <p className="text-xs text-gray-400">{formattedDate}</p>
                </div>
                {isTrending && (
                    <div className="bg-purple-900/30 text-purple-300 border border-purple-600 px-3 py-1 rounded-full text-sm font-semibold flex items-center glow-effect">
                        <FaFire className="mr-1 text-amber-400 gentle-pulse" />{' '}
                        Trending
                    </div>
                )}
            </div>

            {/* Post Stats */}
            <div className="border-t border-b border-gray-700 px-4 py-2 flex text-gray-400 text-sm bg-gray-850">
                <div className="flex items-center mr-6 hover:text-pink-400 transition-colors cursor-pointer">
                    <FaHeart className="mr-1 text-pink-500" />
                    <span>{Math.floor(Math.random() * 100)} likes</span>
                </div>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center hover:text-purple-400 transition-colors"
                >
                    <FaComment className="mr-1" />
                    <span>{post.commentCount} comments</span>
                </button>
                <div className="flex items-center ml-auto hover:text-purple-400 transition-colors cursor-pointer">
                    <FaShare className="mr-1" />
                    <span>Share</span>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="p-4 bg-gray-850 border-b border-gray-700 shadow-inner-dark">
                    <h4 className="font-medium mb-2 text-gray-300">Comments</h4>
                    {post.comments && post.comments.length > 0 ? (
                        <div className="space-y-3">
                            {post.comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="flex p-3 rounded bg-gray-800 border border-gray-700 hover-scale"
                                >
                                    <div className="h-8 w-8 rounded-full overflow-hidden mr-2 border border-purple-500">
                                        <img
                                            src={comment.userAvatar}
                                            alt={comment.username}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-baseline">
                                            <span className="font-medium mr-2 text-white">
                                                {comment.username}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(
                                                    comment.createdAt
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-300">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">
                            No comments yet.
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

export default PostCard

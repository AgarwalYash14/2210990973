const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const NodeCache = require('node-cache')
const axios = require('axios')
const http = require('http')
const socketIo = require('socket.io')

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
})

const port = process.env.PORT || 3001
const BASE_URL = process.env.BASE_URL
const AUTH_TOKEN = process.env.AUTH_TOKEN
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 })

app.use(cors())
app.use(express.json())

let allUsers = []
let userPosts = {}
let postComments = {}
let lastFetchTime = null

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
    },
})

async function fetchData() {
    console.log('Fetching data from test server...')

    try {
        const usersResponse = await apiClient.get('/users')

        if (usersResponse.data && usersResponse.data.users) {
            const usersData = usersResponse.data.users
            allUsers = Object.entries(usersData).map(([id, name]) => ({
                id: id,
                name: String(name),
                username: String(name).toLowerCase().replace(/\s+/g, '.'),
                avatar: '',
            }))
        } else {
            throw new Error('Unexpected users data format')
        }

        userPosts = {}
        for (const user of allUsers) {
            try {
                const postsResponse = await apiClient.get(
                    `/users/${user.id}/posts`
                )

                userPosts[user.id] = []

                if (postsResponse.data && postsResponse.data.posts) {
                    const postsData = postsResponse.data.posts

                    if (Array.isArray(postsData)) {
                        userPosts[user.id] = postsData.map((post) => ({
                            id: post.id || '',
                            userid: post.userid || user.id,
                            content: post.content || '',
                        }))
                    } else if (
                        typeof postsData === 'object' &&
                        postsData !== null
                    ) {
                        userPosts[user.id] = Object.entries(postsData).map(
                            ([postId, postData]) => {
                                if (
                                    typeof postData === 'object' &&
                                    postData !== null
                                ) {
                                    return {
                                        id: postId,
                                        userid: postData.userid || user.id,
                                        content: postData.content || '',
                                    }
                                } else if (typeof postData === 'string') {
                                    return {
                                        id: postId,
                                        userid: user.id,
                                        content: postData,
                                    }
                                }
                                return {
                                    id: postId,
                                    userid: user.id,
                                    content: 'Unknown content',
                                }
                            }
                        )
                    }
                }
            } catch (error) {
                console.error(
                    `Error fetching posts for user ${user.id}:`,
                    error.message
                )
                userPosts[user.id] = []
            }
        }

        postComments = {}
        for (const userId in userPosts) {
            for (const post of userPosts[userId]) {
                try {
                    const commentsResponse = await apiClient.get(
                        `/posts/${post.id}/comments`
                    )

                    if (
                        commentsResponse.data &&
                        commentsResponse.data.comments
                    ) {
                        const commentsData = commentsResponse.data.comments

                        if (Array.isArray(commentsData)) {
                            postComments[post.id] = commentsData.map(
                                (comment) => {
                                    let username = ''
                                    let commentUserId = comment.userid || ''

                                    if (commentUserId) {
                                        const commentUser = allUsers.find(
                                            (u) =>
                                                u.id.toString() ===
                                                commentUserId.toString()
                                        )
                                        if (commentUser) {
                                            username = commentUser.username
                                        }
                                    }

                                    return {
                                        id:
                                            comment.id ||
                                            `comment-${Math.random()
                                                .toString(36)
                                                .substr(2, 9)}`,
                                        postId: comment.postid || post.id,
                                        userId: commentUserId,
                                        username: username,
                                        userAvatar: '',
                                        content: comment.content || '',
                                        createdAt:
                                            comment.timestamp ||
                                            new Date().toISOString(),
                                    }
                                }
                            )
                        } else if (typeof commentsData === 'object') {
                            postComments[post.id] = Object.entries(
                                commentsData
                            ).map(([commentId, commentData]) => {
                                if (
                                    typeof commentData === 'object' &&
                                    commentData !== null
                                ) {
                                    let username = ''
                                    let commentUserId = commentData.userid || ''

                                    if (commentUserId) {
                                        const commentUser = allUsers.find(
                                            (u) =>
                                                u.id.toString() ===
                                                commentUserId.toString()
                                        )
                                        if (commentUser) {
                                            username = commentUser.username
                                        }
                                    }

                                    return {
                                        id: commentId,
                                        postId: commentData.postid || post.id,
                                        userId: commentUserId,
                                        username: username,
                                        userAvatar: '',
                                        content: commentData.content || '',
                                        createdAt:
                                            commentData.timestamp ||
                                            new Date().toISOString(),
                                    }
                                } else if (typeof commentData === 'string') {
                                    return {
                                        id: commentId,
                                        postId: post.id,
                                        userId: '',
                                        username: '',
                                        userAvatar: '',
                                        content: commentData,
                                        createdAt: new Date().toISOString(),
                                    }
                                }
                                return {
                                    id: commentId,
                                    postId: post.id,
                                    userId: '',
                                    username: '',
                                    userAvatar: '',
                                    content: 'Unknown comment',
                                    createdAt: new Date().toISOString(),
                                }
                            })
                        } else {
                            postComments[post.id] = []
                        }
                    } else {
                        postComments[post.id] = []
                    }
                } catch (error) {
                    console.error(
                        `Error fetching comments for post ${post.id}:`,
                        error.message
                    )
                    postComments[post.id] = []
                }
            }
        }

        lastFetchTime = Date.now()

        cache.set('users', allUsers)
        cache.set('userPosts', userPosts)
        cache.set('postComments', postComments)
        cache.set('lastFetchTime', lastFetchTime)

        return { allUsers, userPosts, postComments }
    } catch (error) {
        console.error('Error fetching data from test server:', error.message)
        if (error.response) {
            console.log('Response status:', error.response.status)
            console.log('Response data:', error.response.data)
        }
        throw error
    }
}

async function getData() {
    try {
        const cachedUsers = cache.get('users')
        const cachedUserPosts = cache.get('userPosts')
        const cachedPostComments = cache.get('postComments')
        const cachedLastFetchTime = cache.get('lastFetchTime')

        if (
            cachedUsers &&
            cachedUserPosts &&
            cachedPostComments &&
            cachedLastFetchTime
        ) {
            allUsers = cachedUsers
            userPosts = cachedUserPosts
            postComments = cachedPostComments
            lastFetchTime = cachedLastFetchTime
            return { allUsers, userPosts, postComments }
        }

        return await fetchData()
    } catch (error) {
        console.error('Error getting data:', error.message)
        throw error
    }
}

app.get('/users', async (req, res) => {
    try {
        await getData()

        const userCommentCounts = allUsers.map((user) => {
            const posts = userPosts[user.id] || []
            let totalComments = 0
            let postCount = posts.length

            for (const post of posts) {
                const comments = postComments[post.id] || []
                totalComments += comments.length
            }

            return {
                id: user.id,
                name: user.name,
                username: user.username,
                avatar: '',
                postCount,
                commentCount: totalComments,
            }
        })

        const topUsers = userCommentCounts
            .sort((a, b) => b.commentCount - a.commentCount)
            .slice(0, 5)

        res.json(topUsers)
    } catch (error) {
        console.error('Error getting top users:', error.message)
        res.status(500).json({ error: 'Failed to fetch top users' })
    }
})

app.get('/posts', async (req, res) => {
    try {
        const { type = 'latest' } = req.query
        await getData()

        let allPosts = []
        for (const userId in userPosts) {
            const posts = userPosts[userId] || []

            for (const post of posts) {
                const comments = postComments[post.id] || []
                const user = allUsers.find(
                    (u) => u.id.toString() === userId.toString()
                )

                allPosts.push({
                    id: post.id,
                    userId: post.userid || userId,
                    username: user ? user.username : '',
                    userAvatar: '',
                    content: post.content || '',
                    image: '',
                    comments: comments,
                    commentCount: comments.length,
                    createdAt: post.timestamp || new Date().toISOString(),
                })
            }
        }

        let result = []

        if (type === 'popular') {
            const maxCommentCount = Math.max(
                ...allPosts.map((post) => post.commentCount),
                0
            )

            result = allPosts.filter(
                (post) => post.commentCount === maxCommentCount
            )
        } else if (type === 'latest') {
            result = allPosts
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
        }

        res.json(result)
    } catch (error) {
        console.error('Error getting posts:', error.message)
        res.status(500).json({ error: 'Failed to fetch posts' })
    }
})

io.on('connection', (socket) => {
    console.log('New client connected')

    socket.on('disconnect', () => {
        console.log('Client disconnected')
    })
})

const notifyClients = (type, data) => {
    io.emit(type, data)
}

setInterval(async () => {
    try {
        const { allUsers, userPosts, postComments } = await fetchData()
        console.log('Background data refresh completed')

        notifyClients('dataUpdated', { timestamp: Date.now() })
    } catch (error) {
        console.error('Background data refresh failed:', error.message)
    }
}, 300000)
;(async () => {
    try {
        await fetchData()
        console.log('Initial data fetch completed')
    } catch (error) {
        console.error('Initial data fetch failed:', error.message)
    }
})()

server.listen(port, () => {
    console.log(`Social Media Analytics Server listening on port ${port}`)
})

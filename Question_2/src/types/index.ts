export interface User {
    id: string
    name: string
    username: string
    avatar: string
    postCount: number
}

export interface Comment {
    id: string
    postId: string
    userId: string
    username: string
    userAvatar: string
    content: string
    createdAt: string
}

export interface Post {
    id: string
    userId: string
    username: string
    userAvatar: string
    content: string
    image: string
    comments: Comment[]
    commentCount: number
    createdAt: string
}

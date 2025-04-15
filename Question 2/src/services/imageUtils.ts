/**
 * Utility functions for generating random images for users and posts
 */

// Array of avatar image URLs
const userAvatars = [
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/women/2.jpg',
    'https://randomuser.me/api/portraits/men/3.jpg',
    'https://randomuser.me/api/portraits/women/4.jpg',
    'https://randomuser.me/api/portraits/men/5.jpg',
    'https://randomuser.me/api/portraits/women/6.jpg',
    'https://randomuser.me/api/portraits/men/7.jpg',
    'https://randomuser.me/api/portraits/women/8.jpg',
    'https://randomuser.me/api/portraits/men/9.jpg',
    'https://randomuser.me/api/portraits/women/10.jpg',
]

// Array of post image URLs
const postImages = [
    'https://source.unsplash.com/random/800x600?nature',
    'https://source.unsplash.com/random/800x600?city',
    'https://source.unsplash.com/random/800x600?people',
    'https://source.unsplash.com/random/800x600?technology',
    'https://source.unsplash.com/random/800x600?food',
    'https://source.unsplash.com/random/800x600?animals',
    'https://source.unsplash.com/random/800x600?architecture',
    'https://source.unsplash.com/random/800x600?business',
    'https://source.unsplash.com/random/800x600?travel',
    'https://source.unsplash.com/random/800x600?fashion',
]

/**
 * Get a random user avatar URL
 * @returns Random avatar URL
 */
export const getRandomUserAvatar = (): string => {
    const randomIndex = Math.floor(Math.random() * userAvatars.length)
    return userAvatars[randomIndex]
}

/**
 * Get a random post image URL
 * @returns Random post image URL
 */
export const getRandomPostImage = (): string => {
    const randomIndex = Math.floor(Math.random() * postImages.length)
    return postImages[randomIndex]
}

export default {
    getRandomUserAvatar,
    getRandomPostImage,
}

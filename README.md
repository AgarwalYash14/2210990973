# PulsePost - Social Media Analytics Dashboard

PulsePost is a comprehensive social media analytics platform built with React, TypeScript, and Node.js. The application fetches and visualizes social media data, providing insights into trending posts, top users, and real-time feed updates.

## Project Overview

The project consists of two main components:

1. **Backend Server (Question_1)**: An Express.js server that fetches data from an external API, processes it, and serves it to the frontend.
2. **Frontend Dashboard (Question_2)**: A React-based dashboard built with TypeScript and Tailwind CSS that visualizes the social media data.

## Screenshots

### Top Users
![Top Users Page](https://raw.githubusercontent.com/AgarwalYash14/2210990973/master/ScreenShots/topusers.png)

### Trending Posts
![Trending Posts Page](https://raw.githubusercontent.com/AgarwalYash14/2210990973/master/ScreenShots/trending.jpg)

### Feed
![Feed Page](https://raw.githubusercontent.com/AgarwalYash14/2210990973/master/ScreenShots/feed.jpg)

## Project Requirements

### Frontend (Question_2)
- Responsive React application running exclusively on http://localhost:3000
- Three main pages:
  - **Top Users**: Displays the top five users with the highest number of posts
  - **Trending Posts**: Shows post(s) with the maximum number of comments
  - **Feed**: Displays posts in real-time with newest posts at the top
- Random image selection for each post and user
- Integration with backend APIs (no direct calls to the test server)
- Implemented with a CSS library (Tailwind CSS) for enhanced user experience

### Backend (Question_1)
- RESTful API endpoints:
  - GET http://hostname/users - Returns top five users with the most commented posts
  - GET http://hostname/posts?type=popular - Returns top post(s) with maximum comments
  - GET http://hostname/posts?type=latest - Returns latest 5 posts in real-time
- Efficient data storage and retrieval mechanisms
- Cost-effective API usage while maintaining responsive user experience
- Adaptability to handle data changes from the source API

## Features

- 📊 **Data Visualization**: Displays trending posts and top users
- 🔄 **Real-time Updates**: Socket.IO integration for live data updates
- 📱 **Responsive Design**: Fully responsive UI built with Tailwind CSS
- 🎨 **Modern UI**: Clean and intuitive interface with animations and visual effects
- 🔒 **Type Safety**: Fully typed with TypeScript

## Backend Technologies

- **Node.js & Express**: RESTful API endpoints
- **Socket.IO**: Real-time bidirectional communication
- **Node-Cache**: Data caching for improved performance
- **Axios**: HTTP requests to external API
- **dotenv**: Environment variable management

## Frontend Technologies

- **React**: Component-based UI architecture
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Router**: Navigation and routing
- **Vite**: Fast, modern build tool
- **React Icons**: Icon library for the UI

## Project Structure

### Backend (Question 1)

```
Question 1/
  ├── index.js         # Main server file
  ├── package.json     # Dependencies
```

### Frontend (Question 2)

```
Question 2/
  ├── src/
  │   ├── components/  # Reusable UI components (Layout, PostCard, UserCard, Loading)
  │   ├── pages/       # Application pages (Feed, TopUsers, TrendingPosts)
  │   ├── services/    # API and utility services
  │   ├── types/       # TypeScript interfaces
  │   ├── App.tsx      # Main application component
  │   └── main.tsx     # Application entry point
  ├── public/          # Static assets
  ├── package.json     # Dependencies
  ├── vite.config.ts   # Vite configuration
  └── tsconfig.json    # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd "Question 1"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node index.js
   ```
   or with nodemon (if installed):
   ```bash
   nodemon index.js
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd "Question 2"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local development server URL shown in your terminal

## Key Pages

- **Top Users**: Displays users with the most engagement
- **Trending Posts**: Shows posts with the highest comment counts
- **Feed**: Real-time feed of the latest posts

## Data Flow

1. The backend server fetches data from the external API
2. Data is processed, cached, and exposed through RESTful endpoints
3. The frontend consumes these endpoints and updates the UI
4. Socket.IO provides real-time updates when new data is available

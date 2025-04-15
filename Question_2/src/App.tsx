import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import TopUsers from './pages/TopUsers'
import TrendingPosts from './pages/TrendingPosts'
import Feed from './pages/Feed'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<TopUsers />} />
                    <Route path="trending" element={<TrendingPosts />} />
                    <Route path="feed" element={<Feed />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App

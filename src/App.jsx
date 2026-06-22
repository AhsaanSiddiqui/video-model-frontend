import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import LikedVideos from './pages/LikedVideos.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import MyContent from './pages/MyContent.jsx'
import CollectionPage from './pages/CollectionPage.jsx'
import Subscribers from './pages/Subscribers.jsx'
import Support from './pages/Support.jsx'
import Settings from './pages/Settings.jsx'
import Profile from './pages/Profile.jsx'
import PlaylistDetails from './pages/PlaylistDetails.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import Signup from './pages/Signup.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import VideoDetails from './pages/VideoDetails.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="liked" element={<LikedVideos />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="my-content" element={<MyContent />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="collection" element={<CollectionPage />} />
        <Route path="subscribers" element={<Subscribers />} />
        <Route path="support" element={<Support />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="playlist/:playlistId" element={<PlaylistDetails />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="video/:videoId" element={<VideoDetails />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

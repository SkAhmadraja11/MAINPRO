import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Background3D from './components/common/Background3D';
import Footer from './components/common/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/Profile';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import SongManagement from './components/admin/SongManagement';
import PlaylistManagement from './components/admin/PlaylistManagement';
import QuickImportSong from './components/admin/QuickImportSong';
import CustomerDashboard from './components/customer/CustomerDashboard';
import SongSearch from './components/customer/SongSearch';
import Playlist from './components/customer/Playlist';
import SongRating from './components/customer/SongRating';
import ArtistDashboard from './components/artist/ArtistDashboard';
import SongUpload from './components/artist/SongUpload';
import { Box } from '@mui/material';
import './App.css';

function AppInner() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Determine whether to use a light 'white' 3D background for app pages.
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Apply CSS variables to switch body/overlay colors dynamically
  useEffect(() => {
    if (isAuthPage) {
      document.documentElement.style.setProperty('--body-bg-color', '#1a2130');
      document.documentElement.style.setProperty('--text-color', '#e6eef8');
      document.documentElement.style.setProperty('--root-overlay', 'linear-gradient(180deg, rgba(14,21,47,0.55), rgba(7,12,25,0.65))');
    } else {
      // light/white 3D variant for other pages
      document.documentElement.style.setProperty('--body-bg-color', '#f8fafc');
      document.documentElement.style.setProperty('--text-color', '#0f172a');
      document.documentElement.style.setProperty('--root-overlay', 'linear-gradient(180deg, rgba(255,255,255,0.6), rgba(245,246,250,0.6))');
    }
  }, [isAuthPage]);

  return (
    <>
      {/* ====== 3D Canvas Background ====== */}
      <Background3D color={isAuthPage ? '#9be7ff' : '#ffffff'} />

      {/* ====== Main App Layout ====== */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 2,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, paddingTop: '80px', p: 2 }}>
          <Routes>
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to={`/${user.role.toLowerCase()}`} />}
            />
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to={`/${user.role.toLowerCase()}`} />}
            />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route
              path="/admin"
              element={user && user.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin/users"
              element={user && user.role === 'ADMIN' ? <UserManagement /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin/songs"
              element={user && user.role === 'ADMIN' ? <SongManagement /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin/import-song-quick"
              element={user && user.role === 'ADMIN' ? <QuickImportSong defaultUrl={'https://open.spotify.com/track/4GuP8EHbSeKRlFFaUCBeWs?si=c2d4384faa5a440f'} /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin/playlists"
              element={
                user && user.role === 'ADMIN' ? <PlaylistManagement /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/customer"
              element={user && user.role === 'CUSTOMER' ? <CustomerDashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/customer/search"
              element={user && user.role === 'CUSTOMER' ? <SongSearch /> : <Navigate to="/login" />}
            />
            <Route
              path="/customer/playlists"
              element={user && user.role === 'CUSTOMER' ? <Playlist /> : <Navigate to="/login" />}
            />
            <Route
              path="/customer/ratings"
              element={user && user.role === 'CUSTOMER' ? <SongRating /> : <Navigate to="/login" />}
            />
            <Route
              path="/artist"
              element={user && user.role === 'ARTIST' ? <ArtistDashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/artist/upload"
              element={user && user.role === 'ARTIST' ? <SongUpload /> : <Navigate to="/login" />}
            />
            <Route
              path="/"
              element={<Navigate to={user ? `/${user.role.toLowerCase()}` : '/login'} />}
            />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </>
  );
}

// Top-level App wraps AppInner with Router so useLocation works inside AppInner
function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;

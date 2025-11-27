
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#65bcbeff' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" component={Link} to="/">
          <MusicNoteIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          MelodyCloud — Stream & Share
        </Typography>
        {user ? (
          <>
              <Button color="inherit" component={Link} to={`/${user.role.toLowerCase()}`}>
              Home
            </Button>
              <Button color="inherit" component={Link} to="/profile">
              My Hub
            </Button>
            {user.role === 'ADMIN' && (
              <>
                <Button color="inherit" component={Link} to="/admin/users">
                  Manage Users
                </Button>
                <Button color="inherit" component={Link} to="/admin/songs">
                  Manage Songs
                </Button>
                <Button color="inherit" component={Link} to="/admin/playlists">
                  Manage Playlists
                </Button>
              </>
            )}
            {user.role === 'CUSTOMER' && (
              <>
                <Button color="inherit" component={Link} to="/customer/search">
                  Explore
                </Button>
                <Button color="inherit" component={Link} to="/customer/playlists">
                  My Playlists
                </Button>
                <Button color="inherit" component={Link} to="/customer/ratings">
                  My Ratings
                </Button>
              </>
            )}
            {user.role === 'ARTIST' && (
              <Button color="inherit" component={Link} to="/artist/upload">
                  Upload
                </Button>
            )}
            <Button color="inherit" onClick={handleLogout}>
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Sign In
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Get Started
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

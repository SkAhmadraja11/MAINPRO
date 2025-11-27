import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const AdminDashboard = () => {
  return (
    <Box
      className="container card"
      sx={{
        mt: 4,
        p: 4,
        backgroundColor: '#ffffff', // white background
        borderRadius: 3,
        boxShadow: '0 4px 10px rgba(0,0,0,0.08)', // subtle shadow
      }}
    >
      <Typography variant="h4" gutterBottom>
        <AdminPanelSettingsIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Admin Control — MelodyCloud
      </Typography>
      <Button
        className="btn"
        variant="contained"
        component={Link}
        to="/admin/users"
        sx={{ m: 1 }}
      >
        User Accounts
      </Button>
      <Button
        className="btn"
        variant="contained"
        component={Link}
        to="/admin/songs"
        sx={{ m: 1 }}
      >
        Song Library
      </Button>
      <Button
        className="btn"
        variant="contained"
        component={Link}
        to="/admin/playlists"
        sx={{ m: 1 }}
      >
        Playlists
      </Button>
    </Box>
  );
};

export default AdminDashboard;

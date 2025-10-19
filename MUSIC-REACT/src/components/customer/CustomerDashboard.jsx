import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const CustomerDashboard = () => {
  const buttonStyle = {
    backgroundColor: '#87CEEB', // sky blue
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#00BFFF', // deeper sky blue on hover
    },
    m: 1
  };

  return (
    <Box
      className="container card"
      sx={{
        mt: 4,
        mx: 'auto',
        maxWidth: 800,   // increased width
        p: 4,
        backgroundColor: '#ffffff', // white background
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <Typography variant="h4" gutterBottom>
        <MusicNoteIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Customer Dashboard
      </Typography>
      <Button variant="contained" component={Link} to="/customer/search" sx={buttonStyle}>
        Search Songs
      </Button>
      <Button variant="outlined" component={Link} to="/customer/playlists" sx={buttonStyle}>
        My Playlists
      </Button>
      <Button variant="contained" component={Link} to="/customer/ratings" sx={buttonStyle}>
        My Ratings
      </Button>
    </Box>
  );
};

export default CustomerDashboard;

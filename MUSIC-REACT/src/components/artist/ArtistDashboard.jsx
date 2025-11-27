
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const ArtistDashboard = () => {
  return (
    <Box className="container card" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        <MusicNoteIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Artist Studio
      </Typography>
      <Button className="btn" variant="contained" component={Link} to="/artist/upload" sx={{ m: 1 }}>
        Upload New Track
      </Button>
    </Box>
  );
};

export default ArtistDashboard;

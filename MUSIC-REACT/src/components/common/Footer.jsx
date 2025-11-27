
import { Box, Typography } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#65bcbeff', color: '#fff', p: 2, textAlign: 'center', mt: 'auto' }}>
      <MusicNoteIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
      <Typography variant="body2">
        &copy; 2025 MelodyCloud — Keep the music playing.
      </Typography>
    </Box>
  );
};

export default Footer;

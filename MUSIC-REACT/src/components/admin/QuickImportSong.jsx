import { useState } from 'react';
import { addSong } from '../../utils/api';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import PublishIcon from '@mui/icons-material/Publish';

const QuickImportSong = ({ defaultUrl }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [album, setAlbum] = useState('');
  const [url, setUrl] = useState(defaultUrl || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImport = async () => {
    if (!title || !artist || !url) {
      setError('Title, artist and URL are required');
      return;
    }
    try {
      const song = { title, artist, genre, album, url };
      await addSong(song);
      setSuccess('Song imported successfully');
      setError('');
      setTitle('');
      setArtist('');
      setGenre('');
      setAlbum('');
      setUrl(defaultUrl || '');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to import song');
      setSuccess('');
    }
  };

  return (
    <Box className="container card" sx={{ mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        <PublishIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Quick Import Song
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth margin="normal" />
      <TextField label="Artist" value={artist} onChange={(e) => setArtist(e.target.value)} fullWidth margin="normal" />
      <TextField label="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} fullWidth margin="normal" />
      <TextField label="Album" value={album} onChange={(e) => setAlbum(e.target.value)} fullWidth margin="normal" />
      <TextField label="URL" value={url} onChange={(e) => setUrl(e.target.value)} fullWidth margin="normal" />
      <Button variant="contained" onClick={handleImport} sx={{ mt: 2, backgroundColor: '#ff6f61', '&:hover': { backgroundColor: '#e55a50' } }}>
        Import Song
      </Button>
    </Box>
  );
};

export default QuickImportSong;

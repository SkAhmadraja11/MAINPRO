
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { addSong } from '../../utils/api';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

const SongUpload = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState(user?.username || '');
  const [genre, setGenre] = useState('');
  const [album, setAlbum] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!title || !artist || !url) {
      setError('Please provide title, artist and a valid URL');
      return;
    }
    try {
      const song = { title, artist, genre, album, url, artistUser: { id: user.id } };
      await addSong(song);
      setTitle('');
      setArtist(user.username);
      setGenre('');
      setAlbum('');
      setUrl('');
    } catch (err) {
      setError('Failed to upload song');
    }
  };

  return (
    <Box className="container card" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        <UploadIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Share Your Track
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        className="input-field"
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        className="input-field"
        label="Artist"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        className="input-field"
        label="Genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        className="input-field"
        label="Album"
        value={album}
        onChange={(e) => setAlbum(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        className="input-field"
        label="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button className="btn" variant="contained" onClick={handleUpload} sx={{ mt: 2 }}>
        Publish Track
      </Button>
    </Box>
  );
};

export default SongUpload;

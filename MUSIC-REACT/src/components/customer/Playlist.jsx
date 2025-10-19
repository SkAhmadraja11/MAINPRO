import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { createPlaylist, getUserPlaylists, addSongToPlaylist, deletePlaylist, searchSongs } from '../../utils/api';
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Alert, Paper, Checkbox, FormControlLabel, Stack } from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

const Playlist = () => {
  const { user } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState('');
  const [songQuery, setSongQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [selectedSongIds, setSelectedSongIds] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        if (user?.id) {
          const data = await getUserPlaylists(user.id);
          setPlaylists(data);
        }
      } catch (err) {
        setError('Failed to fetch playlists');
      }
    };
    fetchPlaylists();
  }, [user?.id]);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Playlist name is required');
      return;
    }
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }
    
    try {
      const newPlaylist = await createPlaylist(name, user.id);
      setPlaylists([...playlists, newPlaylist]);
      setName('');
      setError('');
      // Attach selected songs to the newly created playlist
      if (selectedSongIds.length > 0) {
        try {
          await Promise.all(selectedSongIds.map((songId) => addSongToPlaylist(newPlaylist.id, songId)));
        } catch (err) {
          // non-fatal: playlist created but some songs may not have been added
          console.error('Failed to add some songs to playlist', err);
          setError('Playlist created but failed to add some songs');
        }
      }
      setSuccess('Playlist created successfully!');
      setSelectedSongIds([]);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create playlist');
      setSuccess('');
    }
  };

  const handleAddSong = async (playlistId, songId) => {
    try {
      const updatedPlaylist = await addSongToPlaylist(playlistId, songId);
      setPlaylists(playlists.map((p) => (p.id === playlistId ? updatedPlaylist : p)));
      setError('');
      setSuccess('Song added to playlist successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add song to playlist');
      setSuccess('');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      try {
        await deletePlaylist(id);
        setPlaylists(playlists.filter((p) => p.id !== id));
        setError('');
        setSuccess('Playlist deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete playlist');
        setSuccess('');
      }
    }
  };

  const handleSearchSongs = async () => {
    if (!songQuery.trim()) {
      setError('Song search query is required');
      return;
    }
    try {
      const data = await searchSongs(songQuery, 'title');
      setSongs(data);
      setError('');
      if (data.length === 0) {
        setError('No songs found matching your search');
      }
    } catch (err) {
      setError('Failed to search songs');
      setSongs([]);
    }
  };

  const toggleSelectSong = (songId) => {
    setSelectedSongIds((prev) => {
      if (prev.includes(songId)) return prev.filter((id) => id !== songId);
      return [...prev, songId];
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSongs();
    }
  };

  return (
    <Box className="container" sx={{ mt: 4, p: 3, backgroundColor: '#ffffff' }}>
      <Paper elevation={3} sx={{ p: 3, backgroundColor: '#ffffff' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#ff6f61', fontWeight: 'bold' }}>
          <PlaylistAddIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '2rem' }} /> 
          My Playlists
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2, backgroundColor: '#ffffff' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2, backgroundColor: '#ffffff' }}>{success}</Alert>}

        {/* Create Playlist Section */}
        <Box sx={{ mb: 4, p: 2, backgroundColor: '#ffffff', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Create New Playlist</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Playlist Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="small"
              placeholder="Enter playlist name..."
              sx={{ backgroundColor: '#ffffff' }}
            />
            <Button 
              variant="contained" 
              onClick={handleCreate}
              sx={{ minWidth: '140px', backgroundColor: '#ff6f61', '&:hover': { backgroundColor: '#e55a50' } }}
            >
              Create Playlist
            </Button>
          </Box>
        </Box>

        {/* Search Results & Selection */}
        {songs.length > 0 && (
          <Box sx={{ mb: 4, p: 2, backgroundColor: '#ffffff', borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Select songs to include in new playlist</Typography>
            <Stack direction="column" spacing={1}>
              {songs.map((song) => (
                <FormControlLabel
                  key={song.id}
                  control={
                    <Checkbox
                      checked={selectedSongIds.includes(song.id)}
                      onChange={() => toggleSelectSong(song.id)}
                    />
                  }
                  label={`${song.title}${song.artist ? ` — ${song.artist}` : ''}`}
                />
              ))}
            </Stack>
            {selectedSongIds.length > 0 && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {selectedSongIds.length} song(s) selected to be added when creating the playlist.
              </Typography>
            )}
          </Box>
        )}

        {/* Search Songs Section */}
        <Box sx={{ mb: 4, p: 2, backgroundColor: '#ffffff', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Search Songs to Add</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Search Songs"
              value={songQuery}
              onChange={(e) => setSongQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              size="small"
              placeholder="Enter song title..."
              sx={{ backgroundColor: '#ffffff' }}
            />
            <Button 
              variant="contained" 
              onClick={handleSearchSongs}
              sx={{ minWidth: '140px', backgroundColor: '#ff6f61', '&:hover': { backgroundColor: '#e55a50' } }}
            >
              Search Songs
            </Button>
          </Box>
        </Box>

        {/* Playlists Table */}
        {playlists.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 4, backgroundColor: '#ffffff' }}>
            <Typography variant="h6" color="textSecondary">
              No playlists yet. Create your first playlist above!
            </Typography>
          </Box>
        ) : (
          <Table sx={{ backgroundColor: '#ffffff' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', backgroundColor: '#ffffff' }}>Playlist Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', backgroundColor: '#ffffff' }}>Songs</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', backgroundColor: '#ffffff' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playlists.map((playlist) => (
                <TableRow key={playlist.id} hover sx={{ backgroundColor: '#ffffff' }}>
                  <TableCell>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {playlist.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {playlist.songs?.length || 0} songs
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {playlist.songs && playlist.songs.length > 0 ? (
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {playlist.songs.map((song) => song.title).join(', ')}
                        </Typography>
                        {songs.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Search Results:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {songs.map((song) => (
                                <Button
                                  key={song.id}
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleAddSong(playlist.id, song.id)}
                                  sx={{ 
                                    textTransform: 'none',
                                    fontSize: '0.8rem'
                                  }}
                                >
                                  + {song.title}
                                </Button>
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSeco6ndary">
                        No songs in this playlist yet.
                        {songs.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Add from search results:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {songs.map((song) => (
                                <Button
                                  key={song.id}
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleAddSong(playlist.id, song.id)}
                                  sx={{ 
                                    textTransform: 'none',
                                    fontSize: '0.8rem'
                                  }}
                                >
                                  + {song.title}
                                </Button>
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="error" 
                      onClick={() => handleDelete(playlist.id)}
                      size="small"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {playlists.length === 0 && songs.length > 0 && (
          <Box sx={{ mt: 3, p: 2, backgroundColor: '#ffffff', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Search Results
            </Typography>
            <Typography variant="body2">
              Create a playlist first to add these songs.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {songs.map((song) => (
                <Typography key={song.id} variant="body2" sx={{ 
                  backgroundColor: '#ffffff', 
                  px: 1, 
                  py: 0.5, 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  {song.title}
                </Typography>
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Playlist;

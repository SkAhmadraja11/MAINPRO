import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { updateProfile } from '../utils/api';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpdate = async () => {
    if (!username || !email) {
      setError('Username and email are required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return;
    }
    try {
      const updatedUser = await updateProfile(user.id, { username, email, password, role: user.role });
      login(updatedUser);
      navigate(`/${user.role.toLowerCase()}`);
    } catch (err) {
      setError('Update failed');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 4,
        p: 4,
        backgroundColor: '#ffffff', // box background white
        borderRadius: 3,
        boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
        color: 'inherit', // keeps text color normal
      }}
    >
      <Typography variant="h5" gutterBottom>
        <AccountCircleIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Profile
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password (optional)"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Typography variant="body1" sx={{ mt: 1 }}>Role: {user?.role}</Typography>
      <Button
        variant="contained"
        onClick={handleUpdate}
        sx={{ mt: 2 }}
      >
        Update Profile
      </Button>
    </Box>
  );
};

export default Profile;

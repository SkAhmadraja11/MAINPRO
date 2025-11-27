
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { loginUser } from '../../utils/api';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter your username and password to continue');
      return;
    }
    try {
      const userData = await loginUser({ username, password });
      login(userData);
      navigate(`/${userData.role.toLowerCase()}`);
    } catch (err) {
      setError("Oops — we couldn't sign you in. Check your details and try again.");
    }
  };

  return (
    <Box className="container card" sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        <LoginIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Welcome back — let's groove!
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        className="input-field"
        label="Username or Email"
        placeholder="e.g. melodyfan92"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        className="input-field"
        label="Password"
        placeholder="Your secret groove"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button className="btn" variant="contained" onClick={handleLogin} sx={{ mt: 2 }}>
        Sign In & Play
      </Button>
    </Box>
  );
};

export default Login;

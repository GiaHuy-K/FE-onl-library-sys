import { AppBar, Toolbar, Typography, Button, Container, Stack, Box, TextField, Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
const Header = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <AppBar position="static" sx={{ backgroundColor: '#FF6E61', py: 0.5, elevation: 0 }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={3} alignItems="center">
            {/* Logo Trắng Chữ Cam */}
            <Box sx={{ bgcolor: '#fff', px: 1.5, py: 0.5, borderRadius: '4px' }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#FF6E61' }}>LIB</Typography>
            </Box>
            <Button sx={{ color: '#fff', textTransform: 'none', fontWeight: 600 }}>KHÁM PHÁ ▾</Button>
          </Stack>

          <Box sx={{ flexGrow: 1, maxWidth: '500px', mx: 4, display: { xs: 'none', md: 'block' } }}>
            <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', borderRadius: '4px' }}>
              <TextField 
                fullWidth 
                placeholder="Tìm tên sách, tác giả..." 
                variant="standard" 
                InputProps={{ disableUnderline: true, sx: { px: 2, fontSize: '0.85rem' } }} 
              />
              <IconButton sx={{ p: '8px', bgcolor: '#00BFA5', borderRadius: '0 4px 4px 0', '&:hover': { bgcolor: '#009688' } }}>
                <SearchIcon sx={{ color: '#fff', fontSize: '20px' }} />
              </IconButton>
            </Paper>
          </Box>

          <Button onClick={handleLogin} sx={{ color: '#fff', textTransform: 'none', fontWeight: 600 }}>Đăng nhập</Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
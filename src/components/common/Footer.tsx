import { Box, Container, Typography, Stack,Divider } from '@mui/material';
import Grid from '@mui/material/Grid';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#2D3436', color: '#fff', pt: 6, pb: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#FF6E61', mb: 2 }}>LIB-SYS</Typography>
            <Typography variant="body2" sx={{ color: '#dfe6e9' }}>
              Dự án SWD392 - Thư viện thông minh tích hợp AI. <br />
              
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: { md: 'right' } }}>
            <Typography variant="body2" sx={{ mb: 2 }}>Kết nối với chúng tôi qua các mạng xã hội.</Typography>
            <Stack direction="row" spacing={2} justifyContent={{ md: 'flex-end' }}>
              {/* Thêm các IconButton ở đây */}
              <Box sx={{ color: '#FF6E61', fontWeight: 700, cursor: 'pointer' }}>FB</Box>
              <Box sx={{ color: '#FF6E61', fontWeight: 700, cursor: 'pointer' }}>GH</Box>
              <Box sx={{ color: '#FF6E61', fontWeight: 700, cursor: 'pointer' }}>LN</Box>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
          © {new Date().getFullYear()} LIB-SYS
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
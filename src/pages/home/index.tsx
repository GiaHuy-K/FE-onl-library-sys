import { Box, Container, Typography, Stack, Button, Paper, } from '@mui/material';
import Grid from '@mui/material/Grid';

const HomePage = () => {
  const books = [
    { title: "Sách đề cử 1", img: "https://manybooks.net/sites/default/files/styles/240x360/public/book-covers/mysisterssecretkeeper.jpg" },
    { title: "Sách đề cử 2", img: "https://manybooks.net/sites/default/files/styles/240x360/public/book-covers/couragethroughadversity.jpg" },
    { title: "Sách đề cử 3", img: "https://manybooks.net/sites/default/files/styles/240x360/public/book-covers/justforthismoment.jpg" },
    { title: "Sách đề cử 4", img: "https://manybooks.net/sites/default/files/styles/240x360/public/book-covers/thecarnationmurder.jpg" },
  ];

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
      {/* Banner Cam Trắng */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #FF6E61 0%, #FF9E80 100%)',
        py: { xs: 8, md: 12 },
        color: '#fff',
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2.2rem', md: '3.8rem' } }}>
            THƯ VIỆN SỐ THẾ HỆ MỚI
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, mb: 4 }}>
            Tìm kiếm và trò chuyện cùng hàng ngàn cuốn sách với sức mạnh AI RAG.
          </Typography>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: '#fff', 
              color: '#FF6E61', 
              fontWeight: 700, 
              px: 4, py: 1.5, 
              borderRadius: '50px',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
          >
            BẮT ĐẦU ĐỌC NGAY
          </Button>
        </Container>
      </Box>

      {/* Phần danh sách sách */}
      <Container sx={{ py: 8 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#333' }}>
            SÁCH MIỄN PHÍ PHỔ BIẾN
          </Typography>
          <Button sx={{ color: '#FF6E61', fontWeight: 700 }}>Xem tất cả</Button>
        </Stack>

        <Grid container spacing={4}>
          {books.map((book, index) => (
            <Grid key={index} size={{ xs: 6, sm: 4, md: 3 }}>
              <Box sx={{ 
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-10px)' }
              }}>
                <Paper elevation={6} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
                  <Box component="img" src={book.img} sx={{ width: '100%', height: 'auto', display: 'block' }} />
                </Paper>
                <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 700, color: '#444', textAlign: 'center' }}>
                  {book.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
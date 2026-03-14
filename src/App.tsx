import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home'; // Anh kiểm tra lại đường dẫn cho đúng với folder của anh nhé
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { Box } from '@mui/material';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header nằm ngoài Routes để trang nào cũng thấy */}
        <Header />

        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Sau này anh thêm trang Login ở đây: 
            <Route path="/login" element={<LoginPage />} /> 
            */}
          </Routes>
        </Box>

        {/* Footer nằm ngoài Routes */}
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
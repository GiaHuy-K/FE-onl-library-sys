import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home'; 
import Header from './components/common/Header';
import Footer from './components/common/Footer';

function App() {
  return (
    <Router>
      {/* Header nằm ngoài Routes để trang nào cũng thấy */}
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        {/*  thêm trang Login ở đây: 
        <Route path="/login" element={<LoginPage />} /> 
        */}
      </Routes>

      {/* Footer nằm ngoài Routes */}
        <Footer />
      
    </Router>
  );
}

export default App;
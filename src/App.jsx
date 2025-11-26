import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AboutUs from './components/About Us';
import Career from './components/Career';
import Login from './components/admin/Login';
import Home from './components/admin/Home';
import ProtectedRoute from './routes/ProtectedRoutes';
import NotFound from './components/NotFound';

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/Career" element={<Career />} />

        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/home" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
   
  );
}
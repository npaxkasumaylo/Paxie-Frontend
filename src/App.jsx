import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AboutUs from './components/About Us';
import Career from './components/Career';
import Login from './components/admin/Login';
import Home from './components/admin/Home';
import ProtectedRoute from './routes/ProtectedRoutes';

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/career" element={<Career />} />

        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/home" element={
          // <ProtectedRoute>
            <Home />
          // </ProtectedRoute>
        } />
      </Routes>
   
  );
}
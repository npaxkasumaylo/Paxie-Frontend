import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Chatbot from './components/Chatbot.jsx'

function ChatbotWrapper() {
  const location = useLocation();

  const visibleRoutes = ["", "/", "/LandingPage", "/AboutUs", "/Career"];
  const isVisible = visibleRoutes.includes(location.pathname);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Chatbot isDark={false} />
    </div>
  );
}



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* Floating Chatbot Wrapper */}
      <ChatbotWrapper />

      <App />
    </BrowserRouter>
  </StrictMode>,
)

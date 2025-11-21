import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Chatbot from './components/Chatbot.jsx'

function ChatbotWrapper() {
  const location = useLocation();

  // List of routes where Chatbot should NOT appear
  const hiddenRoutes = ["/admin/login", "/admin/home"];

  const isHidden = hiddenRoutes.includes(location.pathname);

  if (isHidden) return null;

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

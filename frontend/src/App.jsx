import { useEffect } from 'react';
import AppRouter from "./routes/appRouter";
import { BrowserRouter } from 'react-router-dom';
import PageTemplate from "./components/PageTemplate";
import { isAuthenticated } from "./utils/auth";
import "./App.css";

function App() {
  useEffect(() => {
    if (isAuthenticated()) {
      const darkMode = localStorage.getItem('darkMode');
      if (darkMode === 'true') {
        document.documentElement.classList.add('dark-mode');
      }
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.removeItem('darkMode');
    }
  }, []);

  return (
    <BrowserRouter>
      <PageTemplate>
        <AppRouter />
      </PageTemplate>
    </BrowserRouter>
  )
}

export default App

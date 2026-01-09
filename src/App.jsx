import AppRouter from "./routes/appRouter";
import { BrowserRouter } from 'react-router-dom';

import "./App.css";
function App() {
  return (
    <>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
    </>
  )
}

export default App

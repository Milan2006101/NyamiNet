import AppRouter from "./routes/appRouter";
import { BrowserRouter } from 'react-router-dom';
import Layout from "./components/layout/Layout.jsx";
import { PaginationProvider } from "./context/PaginationContext.jsx";

import "./App.css";
function App() {
  return (
    <>
    <BrowserRouter>
      <PaginationProvider>
        <Layout>
          <AppRouter />
        </Layout>
      </PaginationProvider>
    </BrowserRouter>
    </>
  )
}

export default App

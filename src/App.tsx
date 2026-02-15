import { Route, Routes } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/Dashboard";
import { TableContextProvider } from "./context/TableContext";

function App() {
  return (
    <>
      <AuthContextProvider>
        <TableContextProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </TableContextProvider>
      </AuthContextProvider>
    </>
  );
}

export default App;

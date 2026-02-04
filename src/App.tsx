import { Route, Routes } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/Dashboard";

function App() {
  return (
    <>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />}/>
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;

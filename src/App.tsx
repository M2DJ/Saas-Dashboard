import { Route, Routes } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import RoleChoicePage from "./pages/RoleChoice";

function App() {
  return (
    <>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/role" element={<RoleChoicePage />} />
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;

import { AuthContextProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <AuthContextProvider>
        <HomePage />
      </AuthContextProvider>
    </>
  );
}

export default App;

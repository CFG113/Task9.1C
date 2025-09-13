import { Routes, Route } from "react-router-dom";
import NavFooter from "./components/NavFooter";
import HomePage from "./routes/HomePage";
import AboutPage from "./routes/AboutPage";
import ConnectPage from "./routes/ConnectPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TutorialsPage from "./routes/TutorialsPage.jsx";
import AddTutorialPage from "./routes/AddTutorialPage.jsx";
import MfaOtp from "./routes/MfaOtp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NavFooter />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="connect" element={<ConnectPage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        <Route path="tutorials">
          <Route index element={<TutorialsPage />} />
          <Route path="new" element={<AddTutorialPage />} />
        </Route>

        <Route path="mfa" element={<MfaOtp />} />
      </Route>
    </Routes>
  );
}

export default App;

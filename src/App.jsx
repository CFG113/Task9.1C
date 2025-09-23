import { Routes, Route } from "react-router-dom";
import NavFooter from "./components/NavFooter";
import HomePage from "./routes/HomePage";
import AboutPage from "./routes/AboutPage";
import ConnectPage from "./routes/ConnectPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TutorialsPage from "./routes/TutorialsPage.jsx";
import AddTutorialPage from "./routes/AddTutorialPage.jsx";
import VerifyEmail from "./components/VerifyEmail";
import OtpPage from "./routes/OtpPage";
import TutorialDetailPage from "./routes/TutorialDetailPage";
import ForgotPassword from "./routes/ForgotPassword";

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
          <Route path=":id" element={<TutorialDetailPage />} />
        </Route>

        <Route path="verifyemail" element={<VerifyEmail />} />
        <Route path="otp" element={<OtpPage />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>
    </Routes>
  );
}

export default App;

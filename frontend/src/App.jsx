import { useState } from "react";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import { Routes, Route } from "react-router-dom";
// import Auth from "./pages/Auth";
// import SurveyPage from "./pages/SurveyPage";
// import Test from "./pages/Test";
// import Dashboard from "./pages/Dashboard.jsx";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/auth" element={<Auth />} />
        <Route path="/auth/survey" element={<SurveyPage />} />
        <Route path="/test" element={<Test />} />
        <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </>
  );
}

export default App;

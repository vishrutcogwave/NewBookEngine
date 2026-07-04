import { HashRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./screens/LandingPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
import { HashRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./screens/LandingPage";
import PrivacyPolicy from "./screens/PrivacyPolicy";
import TermsConditions from "./screens/TermsConditions";
import RefundPolicy from "./screens/RefundPolicy";
import ContactUs from "./screens/ContactUs";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
         <Route path="/refund-policy" element={<RefundPolicy />} />
           <Route path="/contact-us" element={<ContactUs />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
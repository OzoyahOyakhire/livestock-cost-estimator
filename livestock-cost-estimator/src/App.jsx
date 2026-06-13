import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EstimationSetup from './pages/Wizard/EstimationSetup';
import PoultryWizard from './pages/Wizard/Poultry/PoultryWizard';
import CattleWizard from './pages/Wizard/Cattle/CattleWizard';
import ResultsPage from './pages/Wizard/ResultsPage';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Main site layout */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="estimate">
            <Route index element={<EstimationSetup />} />
            <Route path="poultry" element={<PoultryWizard />} />
            <Route path="cattle" element={<CattleWizard />} />
            <Route path="results/:id" element={<ResultsPage />} />
          </Route>
        </Route>

        {/* Auth routes without global layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


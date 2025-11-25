import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import RequireAuth from './components/auth/RequireAuth';
import LandingPage from './components/LandingPage';
import MainApp from './MainApp';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <RequireAuth fallback={<LandingPage />}>
          <MainApp />
        </RequireAuth>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;

import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './navigation/RootNavigator';
import { getItem } from './services/storage';
import Loader from './components/UI/Loader';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getItem('authToken');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
  return <Loader />;
}
  return (
    <>
      <StatusBar style="auto" />
      <RootNavigator isAuthenticated={isAuthenticated} />
    </>
  );
};

export default App;

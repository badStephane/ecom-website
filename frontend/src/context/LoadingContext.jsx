import PropTypes from 'prop-types';
import { createContext, useContext, useState, useCallback } from 'react';

/**
 * Contexte pour gérer l'état de chargement global
 */
const LoadingContext = createContext();

/**
 * Provider pour le contexte de chargement
 */
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Chargement...');

  const startLoading = useCallback((message = 'Chargement...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage('Chargement...');
  }, []);

  const value = {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte de chargement
 */
LoadingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

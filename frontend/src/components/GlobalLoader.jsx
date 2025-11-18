import { useLoading } from '../context/LoadingContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * Composant qui affiche le loading global
 */
const GlobalLoader = () => {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) return null;

  return (
    <LoadingSpinner 
      fullScreen 
      overlay 
      text={loadingMessage}
      size="lg"
    />
  );
};

export default GlobalLoader;

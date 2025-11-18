import PropTypes from 'prop-types';
import { Loader } from 'lucide-react';

/**
 * Composant de spinner de chargement
 */
const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Chargement...',
  fullScreen = false,
  overlay = true 
}) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader className={`${sizes[size]} animate-spin text-black`} />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className={`fixed inset-0 flex items-center justify-center ${
          overlay ? 'bg-black/20 backdrop-blur-sm' : 'bg-white'
        } z-50`}
        role="status"
        aria-label="Chargement en cours"
      >
        {spinner}
      </div>
    );
  }

  return (
    <div 
      className="flex items-center justify-center p-4"
      role="status"
      aria-label="Chargement en cours"
    >
      {spinner}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  text: PropTypes.string,
  fullScreen: PropTypes.bool,
  overlay: PropTypes.bool,
};

export default LoadingSpinner;

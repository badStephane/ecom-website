import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../store/adminAuthSlice';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockUntil, setLockUntil] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.adminAuth);

  // Vérifier si le compte est verrouillé
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
    
    // Vérifier le verrouillage du compte
    const lockTime = localStorage.getItem('accountLockedUntil');
    if (lockTime && new Date(lockTime) > new Date()) {
      setIsLocked(true);
      setLockUntil(new Date(lockTime));
      
      const timer = setInterval(() => {
        if (new Date() >= new Date(lockTime)) {
          setIsLocked(false);
          setLockUntil(null);
          localStorage.removeItem('accountLockedUntil');
          clearInterval(timer);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      return;
    }
    
    try {
      const result = await dispatch(loginAdmin(formData));
      
      if (result.payload?.message) {
        // Échec de la connexion
        const attempts = loginAttempts + 1;
        setLoginAttempts(attempts);
        
        // Verrouiller le compte après 5 tentatives échouées
        if (attempts >= 5) {
          const lockTime = new Date();
          lockTime.setMinutes(lockTime.getMinutes() + 15); // Verrouiller pendant 15 minutes
          localStorage.setItem('accountLockedUntil', lockTime);
          setIsLocked(true);
          setLockUntil(lockTime);
        }
      } else {
        // Réinitialiser le compteur en cas de succès
        setLoginAttempts(0);
        navigate('/admin');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  // Fonction pour formater le temps restant
  const formatTimeRemaining = () => {
    if (!lockUntil) return '';
    
    const now = new Date();
    const diff = Math.max(0, lockUntil - now);
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">LIVEWEAR</h1>
          <p className="text-center text-gray-600 mb-8">Admin Panel</p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                {error}
                {loginAttempts > 0 && (
                  <span className="block mt-1 text-xs">
                    Tentatives échouées : {loginAttempts}/5
                  </span>
                )}
              </p>
            </div>
          )}

          {isLocked ? (
            <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-medium">
                Compte temporairement verrouillé
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Veuillez réessayer dans {formatTimeRemaining()}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400"
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </form>
          )}
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              En cas de problème de connexion, veuillez contacter l'administrateur système.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

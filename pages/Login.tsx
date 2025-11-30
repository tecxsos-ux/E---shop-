
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Lock, Mail, Facebook, Twitter, Chrome } from 'lucide-react';
import { User as UserType } from '../types';

const Login: React.FC = () => {
  const { state, dispatch } = useContext(StoreContext);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user exists (Mock Auth)
    const user = state.users.find(u => u.email.toLowerCase() === form.email.toLowerCase());
    
    // In a real app, you would verify the password hash here
    if (user && form.password.length > 0) { // Simple check
        dispatch({ type: 'LOGIN_USER', payload: user.email });
        navigate('/profile');
    } else {
        setError(t('auth.errorLogin'));
    }
  };

  const handleSocialLogin = (provider: string) => {
      // Mock Social Login
      const socialUser: UserType = {
          id: `social-${Date.now()}`,
          name: `${provider} User`,
          email: `${provider.toLowerCase()}@example.com`,
          role: 'customer',
          location: 'Internet',
          joinedDate: new Date().toISOString(),
          status: 'active',
          avatar: provider === 'Google' ? 'https://lh3.googleusercontent.com/d/123' : undefined
      };
      
      // Add and Login
      dispatch({ type: 'REGISTER_USER', payload: socialUser });
      navigate('/profile');
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="text-center">
           <div className="mx-auto h-12 w-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
           </div>
           <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
             {t('auth.loginTitle')}
           </h2>
           <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
             {t('auth.noAccount')} <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">{t('auth.registerNow')}</Link>
           </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.email')}</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-700"
                    placeholder="you@example.com"
                  />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.password')}</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-700"
                    placeholder="••••••••"
                  />
              </div>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm text-center font-medium">{error}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
            >
              {t('auth.loginBtn')}
            </button>
          </div>
        </form>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">{t('auth.continueWith')}</span>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
            <button 
                onClick={() => handleSocialLogin('Google')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
                <Chrome className="h-5 w-5 text-red-500" />
                <span className="sr-only">{t('auth.google')}</span>
            </button>
            <button 
                onClick={() => handleSocialLogin('Facebook')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
                <Facebook className="h-5 w-5 text-blue-600" />
                <span className="sr-only">{t('auth.facebook')}</span>
            </button>
            <button 
                onClick={() => handleSocialLogin('X')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
                <Twitter className="h-5 w-5 text-black dark:text-white" />
                <span className="sr-only">{t('auth.x')}</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

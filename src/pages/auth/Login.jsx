import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../features/auth/authSlice';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const from = location.state?.from?.pathname || '/';
  
  // If user was redirected here from a protected route or because of expired token
  const isExpired = new URLSearchParams(location.search).get('expired');

  const onSubmit = async (data) => {
    dispatch(clearError());
    const resultAction = await dispatch(login(data));
    
    if (login.fulfilled.match(resultAction)) {
      const { user, requirePasswordChange } = resultAction.payload;
      
      if (requirePasswordChange) {
        navigate('/force-change-password');
      } else {
        // Redirect to intended route or default dashboard based on role
        if (from === '/' || from === '/login') {
          if (user.role === 'admin' || user.role === 'SUPER_ADMIN') navigate('/admin');
          else if (user.role === 'delivery_partner') navigate('/delivery');
          else navigate('/seller');
        } else {
          navigate(from);
        }
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {isExpired && (
        <div className="mb-4 p-3 bg-red-50 text-error text-sm rounded-lg border border-red-100 flex items-start gap-2">
           <span>Your session has expired. Please login again.</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-error text-sm rounded-lg border border-red-100">
           {typeof error === 'string' ? error : error.message || 'An error occurred during login'}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="loginId" className="label-text">
            Email or Mobile Number
          </label>
          <div className="mt-1">
            <input
              id="loginId"
              type="text"
              autoComplete="username"
              className={`input-field ${errors.loginId ? 'border-error focus:ring-error/20' : ''}`}
              placeholder="Enter your email or mobile number"
              {...register('loginId', { required: 'Login ID is required' })}
            />
            {errors.loginId && <p className="error-text">{errors.loginId.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="label-text">
            Password
          </label>
          <div className="mt-1 relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={`input-field pr-10 ${errors.password ? 'border-error focus:ring-error/20' : ''}`}
              placeholder="Enter your password"
              {...register('password', { required: 'Password is required' })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-primary hover:text-primary-dark transition-colors">
              Forgot password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary flex justify-center items-center py-2.5 shadow-md shadow-primary/20"
          >
            {isLoading ? (
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
            ) : (
              'Sign in'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useForm } from 'react-hook-form';
import authApi from '../../api/authApi';
import { checkAuth } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2, ShieldAlert } from 'lucide-react';

const ForceChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await authApi.forceChangePassword({ newPassword: data.newPassword });
      toast.success('Password updated successfully');
      
      // Refresh user state to clear the requirePasswordChange flag
      await dispatch(checkAuth());
      
      // Navigate to dashboard
      navigate(user?.role === 'admin' ? '/admin' : '/seller');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 mb-4">
          <ShieldAlert className="h-6 w-6 text-amber-600" />
        </div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Security Update Required
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Your account has been set to force a password change. Please update your password to continue accessing the dashboard.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="newPassword" className="label-text">
            New Password
          </label>
          <div className="mt-1 relative">
            <input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              className={`input-field pr-10 ${errors.newPassword ? 'border-error focus:ring-error/20' : ''}`}
              placeholder="Enter new password"
              {...register('newPassword', { 
                required: 'New password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' }
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword && <p className="error-text">{errors.newPassword.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="label-text">
            Confirm New Password
          </label>
          <div className="mt-1">
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              className={`input-field ${errors.confirmPassword ? 'border-error focus:ring-error/20' : ''}`}
              placeholder="Confirm new password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === newPassword || 'Passwords do not match'
              })}
            />
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary flex justify-center items-center py-2.5 shadow-md shadow-primary/20"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
            ) : (
              'Update Password & Continue'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForceChangePassword;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import adminApi from '../../api/adminApi';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, Store, User } from 'lucide-react';

const CreateSeller = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await adminApi.createSeller(data);
      
      toast.success('Seller created successfully!');
      
      // Show credentials instead of redirecting immediately
      setCreatedCredentials({
        loginId: data.mobileNumber,
        password: data.password,
        storeName: data.storeName
      });
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create seller');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdCredentials) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="card p-8 text-center animate-fade-in">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <Store className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Seller Account Created!</h2>
          <p className="text-gray-500 mb-8">
            The store partner <strong>{createdCredentials.storeName}</strong> has been successfully registered.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 text-left mb-8 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Initial Login Credentials</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-500">Login ID / Mobile:</span>
                <span className="font-mono font-medium text-gray-900">{createdCredentials.loginId}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-500">Temporary Password:</span>
                <span className="font-mono font-medium text-gray-900">{createdCredentials.password}</span>
              </div>
            </div>
            
            <p className="text-sm text-amber-600 mt-4 bg-amber-50 p-3 rounded-lg border border-amber-100">
              Please copy these credentials and share them securely with the seller. They will be forced to change this password on their first login.
            </p>
          </div>

          <Link to="/admin/sellers" className="btn-primary inline-flex items-center">
            Back to Sellers List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to="/admin/sellers" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="page-title">Add New Seller</h1>
          <p className="text-sm text-gray-500">Create a new store partner account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Owner Details */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <User className="text-primary" size={20} />
              <h2 className="section-title">Owner Details</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="label-text">Full Name *</label>
                <input
                  type="text"
                  className={`input-field ${errors.name ? 'border-error' : ''}`}
                  placeholder="e.g. Ramesh Kumar"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="error-text">{errors.name.message}</p>}
              </div>

              <div>
                <label className="label-text">Mobile Number * (Used for Login)</label>
                <input
                  type="text"
                  className={`input-field ${errors.mobileNumber ? 'border-error' : ''}`}
                  placeholder="10-digit mobile number"
                  {...register('mobileNumber', { 
                    required: 'Mobile is required',
                    pattern: { value: /^[6-9]\d{9}$/, message: 'Valid 10-digit mobile number required' }
                  })}
                />
                {errors.mobileNumber && <p className="error-text">{errors.mobileNumber.message}</p>}
              </div>

              <div>
                <label className="label-text">Email Address (Optional)</label>
                <input
                  type="email"
                  className={`input-field ${errors.email ? 'border-error' : ''}`}
                  placeholder="seller@example.com"
                  {...register('email', { 
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                  })}
                />
                {errors.email && <p className="error-text">{errors.email.message}</p>}
              </div>

              <div>
                <label className="label-text">Initial Password *</label>
                <input
                  type="text" // using text so admin can see what they generate
                  className={`input-field ${errors.password ? 'border-error' : ''}`}
                  placeholder="Min 8 characters"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Must be at least 8 characters' }
                  })}
                />
                {errors.password && <p className="error-text">{errors.password.message}</p>}
                <p className="helper-text">Seller will be forced to change this on first login.</p>
              </div>
            </div>
          </div>

          {/* Store Details */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <Store className="text-primary" size={20} />
              <h2 className="section-title">Store Details</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="label-text">Store Name *</label>
                <input
                  type="text"
                  className={`input-field ${errors.storeName ? 'border-error' : ''}`}
                  placeholder="e.g. Ramesh Fresh Veggies"
                  {...register('storeName', { required: 'Store name is required' })}
                />
                {errors.storeName && <p className="error-text">{errors.storeName.message}</p>}
              </div>

              <div>
                <label className="label-text">Store Description (Optional)</label>
                <textarea
                  className="input-field min-h-[100px] resize-y"
                  placeholder="Short description of the store..."
                  {...register('profileData.storeDescription')}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-gray-200 pt-6">
          <Link to="/admin/sellers" className="btn-secondary">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary min-w-[150px] flex justify-center items-center"
          >
            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Seller'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSeller;

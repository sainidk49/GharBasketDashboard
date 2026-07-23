import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import adminApi from '../../api/adminApi';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, Store, User } from 'lucide-react';

const EditSeller = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const response = await adminApi.getSellerById(id);
        const seller = response.data.data || response.data; // Handle different wrapping
        
        const sellerUser = seller.user || seller.userId || {};
        
        reset({
          name: sellerUser.name || '',
          mobileNumber: sellerUser.mobileNumber || '',
          email: sellerUser.email || '',
          storeName: seller.storeName || '',
          profileData: {
            storeDescription: seller.profileData?.storeDescription || ''
          }
        });
      } catch (error) {
        toast.error('Failed to load seller details');
        navigate('/admin/sellers');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSeller();
  }, [id, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const payload = {
        userData: {
          name: data.name,
          mobileNumber: data.mobileNumber,
          email: data.email
        },
        profileData: {
          storeName: data.storeName,
          storeDescription: data.profileData?.storeDescription
        }
      };
      await adminApi.updateSeller(id, payload);
      toast.success('Seller updated successfully!');
      navigate('/admin/sellers');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update seller');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
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
          <h1 className="page-title">Edit Seller</h1>
          <p className="text-sm text-gray-500">Update store partner account details</p>
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
            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Update Seller'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSeller;

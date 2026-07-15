import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import sellerApi from '../../api/sellerApi';
import adminApi from '../../api/adminApi'; // Used to fetch categories for now
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, Save, Image as ImageIcon, Plus, X } from 'lucide-react';
import { SELLING_TYPES, PRODUCT_STATUSES, GST_OPTIONS } from '../../utils/constants';

const AddProduct = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      status: PRODUCT_STATUSES.ACTIVE,
      sellingType: SELLING_TYPES.PIECE,
      isAvailable: true,
      stockQuantity: 10,
      taxIncluded: true,
      gst: 0
    }
  });

  const sellingType = watch('sellingType');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await adminApi.getCategories({ isActive: true });
        setCategories(catRes.data.data);

        if (isEditing) {
          const prodRes = await sellerApi.getProductById(id);
          const data = prodRes.data.data;
          
          reset({
            name: data.name,
            sku: data.sku,
            categoryId: data.categoryId?._id,
            description: data.description,
            originalPrice: data.originalPrice,
            sellingPrice: data.sellingPrice,
            stockQuantity: data.stockQuantity,
            sellingType: data.sellingType,
            unit: data.unit,
            status: data.status,
            isAvailable: data.isAvailable,
            gst: data.gst || 0,
            taxIncluded: data.taxIncluded ?? true
          });
          setImages(data.images || []);
        }
      } catch (error) {
        toast.error('Failed to load required data');
        if (isEditing) navigate('/seller/products');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, isEditing, reset, navigate]);

  const addImageUrl = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      setImages([...images, url]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const payload = { ...data, images };
      
      if (isEditing) {
        await sellerApi.updateProduct(id, payload);
        toast.success('Product updated successfully!');
      } else {
        await sellerApi.createProduct(payload);
        toast.success('Product created successfully!');
      }
      
      navigate('/seller/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex items-center gap-4">
        <Link to="/seller/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="page-title">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-sm text-gray-500">
            {isEditing ? 'Update existing product details' : 'Create a new product listing in your store'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="card p-6">
              <h2 className="section-title mb-6">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="label-text">Product Name *</label>
                  <input
                    type="text"
                    className={`input-field ${errors.name ? 'border-error' : ''}`}
                    placeholder="E.g. Fresh Red Tomatoes"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && <p className="error-text">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Category *</label>
                    <select
                      className={`input-field ${errors.categoryId ? 'border-error' : ''}`}
                      {...register('categoryId', { required: 'Category is required' })}
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                    {errors.categoryId && <p className="error-text">{errors.categoryId.message}</p>}
                  </div>
                  <div>
                    <label className="label-text">SKU (Optional)</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Stock Keeping Unit"
                      {...register('sku')}
                    />
                  </div>
                </div>

                <div>
                  <label className="label-text">Description</label>
                  <textarea
                    className="input-field min-h-[120px] resize-y"
                    placeholder="Describe your product in detail..."
                    {...register('description')}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="section-title">Product Images</h2>
                <button type="button" onClick={addImageUrl} className="btn-ghost text-primary text-sm flex items-center gap-1">
                  <Plus size={16} /> Add Image URL
                </button>
              </div>
              
              {images.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500">No images added yet. Click 'Add Image URL' to add an external image link.</p>
                  <p className="text-xs text-gray-400 mt-1">Image upload feature coming soon.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                      <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/200x200?text=Error'} />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Pricing & Stock */}
            <div className="card p-6">
              <h2 className="section-title mb-6">Pricing & Inventory</h2>
              <div className="space-y-4">
                <div>
                  <label className="label-text">Selling Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className={`input-field font-semibold text-primary ${errors.sellingPrice ? 'border-error' : ''}`}
                    placeholder="0.00"
                    {...register('sellingPrice', { 
                      required: 'Selling price is required',
                      min: { value: 0, message: 'Must be positive' }
                    })}
                  />
                  {errors.sellingPrice && <p className="error-text">{errors.sellingPrice.message}</p>}
                </div>

                <div>
                  <label className="label-text">MRP / Original Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field text-gray-500"
                    placeholder="0.00"
                    {...register('originalPrice')}
                  />
                </div>

                <hr className="border-gray-100 my-2" />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label-text">Selling Type *</label>
                    <select
                      className="input-field"
                      {...register('sellingType')}
                    >
                      {Object.values(SELLING_TYPES).map(t => (
                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label-text">Unit *</label>
                    <input
                      type="text"
                      className={`input-field ${errors.unit ? 'border-error' : ''}`}
                      placeholder={sellingType === 'weight' ? 'e.g. 500gm' : 'e.g. 1 Dozen'}
                      {...register('unit', { required: 'Required' })}
                    />
                  </div>
                </div>

                <div>
                  <label className="label-text">Stock Quantity *</label>
                  <input
                    type="number"
                    className={`input-field ${errors.stockQuantity ? 'border-error' : ''}`}
                    placeholder="0"
                    {...register('stockQuantity', { 
                      required: 'Required',
                      min: { value: 0, message: 'Cannot be negative' }
                    })}
                  />
                  {errors.stockQuantity && <p className="error-text">{errors.stockQuantity.message}</p>}
                </div>
              </div>
            </div>

            {/* Visibility & Tax */}
            <div className="card p-6">
              <h2 className="section-title mb-6">Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="label-text">Status</label>
                  <select className="input-field" {...register('status')}>
                    {Object.values(PRODUCT_STATUSES).map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    {...register('isAvailable')}
                  />
                  <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Available for purchase
                  </label>
                </div>

                <hr className="border-gray-100 my-2" />

                <div>
                  <label className="label-text">GST Rate (%)</label>
                  <select className="input-field" {...register('gst', { valueAsNumber: true })}>
                    {GST_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="taxIncluded"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    {...register('taxIncluded')}
                  />
                  <label htmlFor="taxIncluded" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Price includes tax
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end gap-4 border-t border-gray-200 pt-6">
          <Link to="/seller/products" className="btn-secondary">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary min-w-[150px] flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <>
                <Save size={18} />
                {isEditing ? 'Update Product' : 'Save Product'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;

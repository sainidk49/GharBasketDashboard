import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import sellerApi from '../../api/sellerApi';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, Save, Image as ImageIcon, Plus, X } from 'lucide-react';
import { PRODUCT_TYPES, PRODUCT_STATUSES, GST_OPTIONS } from '../../utils/constants';

const PRODUCT_TYPE_OPTIONS = [
  { value: PRODUCT_TYPES.WEIGHT, label: 'Weight Based' },
  { value: PRODUCT_TYPES.PIECE, label: 'Piece Based' },
  { value: PRODUCT_TYPES.QUANTITY, label: 'Quantity Based' }
];

const AddProduct = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      status: PRODUCT_STATUSES.ACTIVE,
      productType: PRODUCT_TYPES.PIECE,
      isAvailable: true,
      stockQuantity: 10,
      unit: 'piece',
      pricingUnitValue: 1,
      minimumOrderQuantity: 1,
      maximumOrderQuantity: 10,
      lowStockThreshold: 5,
      taxIncluded: true,
      gst: 0
    }
  });

  const productType = watch('productType');
  const unit = watch('unit');

  useEffect(() => {
    if (isEditing) return;
    if (productType === PRODUCT_TYPES.WEIGHT) {
      setValue('unit', 'grm');
      setValue('stockQuantity', 20000);
      setValue('pricingUnitValue', 1000);
      setValue('minimumOrderQuantity', 1000);
      setValue('maximumOrderQuantity', 0);
      setValue('lowStockThreshold', 1000);
    } else if (productType === PRODUCT_TYPES.QUANTITY) {
      setValue('unit', 'pack');
      setValue('pricingUnitValue', 1);
      setValue('minimumOrderQuantity', 1);
      setValue('maximumOrderQuantity', 0);
      setValue('lowStockThreshold', 5);
    } else {
      setValue('unit', 'piece');
      setValue('pricingUnitValue', 1);
      setValue('minimumOrderQuantity', 1);
      setValue('maximumOrderQuantity', 0);
      setValue('lowStockThreshold', 5);
    }
  }, [productType, isEditing, setValue]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await sellerApi.getCategories();
        setCategories(catRes.data.data || []);

        if (isEditing) {
          const prodRes = await sellerApi.getProductById(id);
          const data = prodRes.data.data;
          
          reset({
            name: data.name,
            sku: data.sku,
            barcode: data.barcode,
            brand: data.brand,
            subCategory: data.subCategory,
            categoryId: data.categoryId?._id,
            description: data.description,
            originalPrice: data.originalPrice,
            sellingPrice: data.sellingPrice,
            stockQuantity: data.stockQuantity,
            productType: data.productType || data.sellingType || PRODUCT_TYPES.PIECE,
            unit: data.unit,
            pricingUnitValue: data.pricingUnitValue || data.inventory?.pricingUnitValue || 1,
            minimumOrderQuantity: data.inventory?.minimumOrderQuantity || 1,
            maximumOrderQuantity: data.inventory?.maximumOrderQuantity || data.maxPurchaseQty || data.stockQuantity,
            lowStockThreshold: data.lowStockThreshold || data.inventory?.lowStockThreshold || data.minStockAlert || 5,
            packageSize: data.inventory?.packageSize || data.packageSize,
            status: data.status,
            isAvailable: data.isAvailable,
            gst: data.gst || 0,
            taxIncluded: data.taxIncluded ?? true
          });
          setImages(data.images || []);
          setNewImages([]);
          setRemovedImages([]);
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

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported image type`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} must be under 5MB`);
        return false;
      }
      return true;
    });

    const availableSlots = 10 - images.length - newImages.length;
    if (validFiles.length > availableSlots) {
      toast.error(`You can upload up to 10 product images`);
    }

    const selectedImages = validFiles.slice(0, availableSlots).map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setNewImages((current) => [...current, ...selectedImages]);
    event.target.value = '';
  };

  const removeExistingImage = (index) => {
    const image = images[index];
    if (image?.publicId) {
      setRemovedImages((current) => [...current, image.publicId]);
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    const image = newImages[index];
    if (image?.preview) URL.revokeObjectURL(image.preview);
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const buildProductFormData = (data) => {
    const payload = {
      ...data,
      productType: data.productType,
      sellingType: data.productType,
      sellingPrice: Number(data.sellingPrice),
      originalPrice: Number(data.originalPrice || data.sellingPrice),
      stockQuantity: Number(data.stockQuantity),
      pricingUnitValue: Number(data.pricingUnitValue || 1),
      minimumOrderQuantity: Number(data.minimumOrderQuantity || 1),
      maximumOrderQuantity: Number(data.maximumOrderQuantity || 0),
      lowStockThreshold: Number(data.lowStockThreshold || 0)
    };

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    newImages.forEach(({ file }) => {
      formData.append('files', file);
    });

    if (removedImages.length > 0) {
      formData.append('removedImages', JSON.stringify(removedImages));
    }

    return formData;
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const payload = buildProductFormData(data);
      
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

  const onError = (errors) => {
    if (errors.maximumOrderQuantity) {
      toast.error(errors.maximumOrderQuantity.message);
    } else if (errors.minimumOrderQuantity) {
      toast.error(errors.minimumOrderQuantity.message);
    } else if (errors.stockQuantity) {
      toast.error(errors.stockQuantity.message);
    } else {
      toast.error('Please fill all required fields correctly.');
    }
  };

  const onFormSubmit = handleSubmit(onSubmit, onError);

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

      <form onSubmit={onFormSubmit} className="space-y-6">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label-text">Sub Category</label>
                    <input type="text" className="input-field" placeholder="E.g. Rice" {...register('subCategory')} />
                  </div>
                  <div>
                    <label className="label-text">Brand</label>
                    <input type="text" className="input-field" placeholder="Brand name" {...register('brand')} />
                  </div>
                  <div>
                    <label className="label-text">Barcode</label>
                    <input type="text" className="input-field" placeholder="EAN / UPC" {...register('barcode')} />
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
                <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-ghost text-primary text-sm flex items-center gap-1">
                  <Plus size={16} /> Upload Images
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </div>
              
              {images.length === 0 && newImages.length === 0 ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:border-primary hover:bg-green-50/40 transition-colors"
                >
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600">Click to upload product images</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, or WEBP. Max 5MB each.</p>
                </button>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div key={img.publicId || img.url || idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                      <img src={img.url || img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {newImages.map((img, idx) => (
                    <div key={img.preview} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                      <img src={img.preview} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
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
                    <label className="label-text">Product Type *</label>
                    <select
                      className="input-field"
                      {...register('productType')}
                    >
                      {PRODUCT_TYPE_OPTIONS.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label-text">{productType === PRODUCT_TYPES.WEIGHT ? 'Weight Unit' : 'Display Unit'} *</label>
                    {productType === PRODUCT_TYPES.WEIGHT ? (
                      <select className="input-field" {...register('unit', { required: 'Required' })}>
                        <option value="grm">grm</option>
                        <option value="kg">kg</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        className={`input-field ${errors.unit ? 'border-error' : ''}`}
                        placeholder={productType === PRODUCT_TYPES.QUANTITY ? 'pack' : 'piece'}
                        {...register('unit', { required: 'Required' })}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="label-text">
                    {productType === PRODUCT_TYPES.WEIGHT ? 'Total Weight in Grams *' : productType === PRODUCT_TYPES.PIECE ? 'Total Pieces *' : 'Total Quantity *'}
                  </label>
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
                  {productType === PRODUCT_TYPES.WEIGHT && (
                    <p className="text-xs text-gray-500 mt-1">Store inventory in grams. Example: 20 KG = 20000 grams.</p>
                  )}
                </div>

                <div>
                  <label className="label-text">Price Applies To</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder={productType === PRODUCT_TYPES.WEIGHT && unit === 'kg' ? '1000' : '1'}
                    {...register('pricingUnitValue', { 
                      min: { value: 1, message: 'Must be at least 1' },
                      onChange: (e) => {
                        setValue('minimumOrderQuantity', e.target.value, { shouldValidate: true });
                      }
                    })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {productType === PRODUCT_TYPES.WEIGHT ? 'Use 1000 when the selling price is per KG, or 1 when it is per gram.' : 'Use 1 when the selling price is per piece or pack.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label-text">Minimum Order Quantity *</label>
                    <input
                      type="number"
                      className={`input-field ${errors.minimumOrderQuantity ? 'border-error' : ''}`}
                      {...register('minimumOrderQuantity', {
                        required: 'Minimum Order Quantity is required',
                        min: { value: 1, message: 'Minimum Order Quantity must be > 0' },
                        validate: {
                          lessThanMax: value => {
                            const max = Number(watch('maximumOrderQuantity') || 0);
                            if (max > 0 && Number(value) > max) return 'Minimum Order Quantity cannot exceed Maximum Order Quantity.';
                            return true;
                          }
                        }
                      })}
                    />
                    {errors.minimumOrderQuantity && <p className="error-text">{errors.minimumOrderQuantity.message}</p>}
                  </div>
                  <div>
                    <label className="label-text">Maximum Order Quantity *</label>
                    <input
                      type="number"
                      className={`input-field ${errors.maximumOrderQuantity ? 'border-error' : ''}`}
                      placeholder="0"
                      {...register('maximumOrderQuantity', {
                        required: 'Please enter the Maximum Order Quantity.',
                        min: { value: 1, message: 'Please enter the Maximum Order Quantity.' },
                        validate: {
                          lessThanStock: value => Number(value) <= Number(watch('stockQuantity')) || 'Maximum Order Quantity cannot exceed the available stock.'
                        }
                      })}
                    />
                    {errors.maximumOrderQuantity && <p className="error-text">{errors.maximumOrderQuantity.message}</p>}
                  </div>
                </div>

                {productType === PRODUCT_TYPES.QUANTITY && (
                  <div>
                    <label className="label-text">Package Size</label>
                    <input type="text" className="input-field" placeholder="E.g. 4 soaps per pack" {...register('packageSize')} />
                  </div>
                )}

                <div>
                  <label className="label-text">Low Stock Alert</label>
                  <input type="number" className="input-field" {...register('lowStockThreshold')} />
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

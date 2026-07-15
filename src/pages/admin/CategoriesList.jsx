import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import adminApi from '../../api/adminApi';
import { Plus, Edit, Trash2, ListTree, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getCategories({});
      // Build simple tree for display (just 2 levels for this demo)
      const allCats = response.data.data;
      const roots = allCats.filter(c => !c.parentCategory);
      
      const enrichedRoots = roots.map(root => {
        return {
          ...root,
          children: allCats.filter(c => c.parentCategory === root._id)
        };
      });
      
      setCategories(enrichedRoots.sort((a,b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description,
        isActive: category.isActive,
        parentCategory: category.parentCategory || ''
      });
    } else {
      reset({ name: '', slug: '', description: '', isActive: true, parentCategory: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      if (!data.parentCategory) delete data.parentCategory;
      if (!data.slug) data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      if (editingCategory) {
        await adminApi.updateCategory(editingCategory._id, data);
        toast.success('Category updated successfully');
      } else {
        await adminApi.createCategory(data);
        toast.success('Category created successfully');
      }
      closeModal();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await adminApi.deleteCategory(id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product categories structure</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="card p-6">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-primary h-8 w-8" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ListTree className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p>No categories found. Create one to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category._id} className="border border-border rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-border">
                  <div className="flex items-center gap-3">
                    {category.image ? (
                      <img src={category.image} alt="" className="w-10 h-10 rounded-md object-cover border border-gray-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500"><ListTree size={18} /></div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-xs text-gray-500">/{category.slug}</p>
                    </div>
                    {!category.isActive && <span className="badge bg-gray-100 text-gray-600 ml-2">Inactive</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(category)} className="btn-ghost p-2 text-blue-600"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(category._id)} className="btn-ghost p-2 text-red-600"><Trash2 size={16} /></button>
                  </div>
                </div>

                {/* Subcategories */}
                {category.children && category.children.length > 0 && (
                  <div className="p-4 pl-14 bg-white space-y-2">
                    {category.children.map(sub => (
                      <div key={sub._id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                          <span className="font-medium text-sm text-gray-800">{sub.name}</span>
                          {!sub.isActive && <span className="badge bg-gray-100 text-gray-600 ml-2 text-[10px]">Inactive</span>}
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => openModal(sub)} className="btn-ghost p-1.5 text-blue-600"><Edit size={14} /></button>
                          <button onClick={() => handleDelete(sub._id)} className="btn-ghost p-1.5 text-red-600"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="label-text">Name *</label>
                <input
                  type="text"
                  className={`input-field ${errors.name ? 'border-error' : ''}`}
                  placeholder="e.g. Vegetables"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="error-text">{errors.name.message}</p>}
              </div>

              <div>
                <label className="label-text">Slug (Optional)</label>
                <input
                  type="text"
                  className="input-field text-gray-600"
                  placeholder="e.g. fresh-vegetables"
                  {...register('slug')}
                />
              </div>

              <div>
                <label className="label-text">Parent Category</label>
                <select className="input-field" {...register('parentCategory')}>
                  <option value="">None (Top Level)</option>
                  {categories.map(c => (
                    // Don't show self as parent option if editing
                    (!editingCategory || c._id !== editingCategory._id) && 
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  {...register('isActive')}
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Category is active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary min-w-[100px] flex justify-center items-center"
                >
                  {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesList;

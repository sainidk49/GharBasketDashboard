import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import sellerApi from '../../api/sellerApi';
import DataTable from '../../components/ui/DataTable';
import { useTableParams } from '../../hooks/useTableParams';
import { Plus, Edit, Copy, Trash2 } from 'lucide-react';
import { formatCurrency, formatProductStatus, getStatusColor, getFileUrl } from '../../utils/formatters';
import { formatStockQuantity, getStockStatusClass, getStockStatusLabel } from '../../utils/inventory';
import toast from 'react-hot-toast';

const ProductsList = () => {
  const { params, setPage, setSearch, setStatus } = useTableParams({ limit: 10 });
  const [data, setData] = useState({ products: [], totalCount: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await sellerApi.getProducts(params);
      setData(response.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [params]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await sellerApi.deleteProduct(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await sellerApi.duplicateProduct(id);
      toast.success('Product duplicated successfully (Saved as Draft)');
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to duplicate product');
    }
  };

  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded bg-gray-100 overflow-hidden border border-gray-200">
            {row.images && row.images.length > 0 ? (
              <img src={getFileUrl(row.images[0])} alt={row.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No img</div>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900 line-clamp-1">{row.name}</p>
            <p className="text-xs text-gray-500">SKU: {row.sku || 'N/A'}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'categoryId',
      render: (row) => row.categoryId?.name || '-'
    },
    {
      header: 'Price',
      accessor: 'sellingPrice',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{formatCurrency(row.sellingPrice)}</p>
          {row.originalPrice > row.sellingPrice && (
            <p className="text-xs text-gray-500 line-through">{formatCurrency(row.originalPrice)}</p>
          )}
        </div>
      )
    },
    {
      header: 'Stock',
      accessor: 'stockQuantity',
      render: (row) => (
        <div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${getStockStatusClass(row.stockStatus)}`}></span>
            <span className="text-sm">{formatStockQuantity(row.stockQuantity, row.productType)}</span>
          </div>
          <p className="text-xs text-gray-500">{getStockStatusLabel(row.stockStatus)}</p>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`badge ${getStatusColor(row.status)}`}>
          {formatProductStatus(row.status)}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Link to={`/seller/products/${row._id}/edit`} className="btn-ghost p-2" title="Edit">
            <Edit size={16} />
          </Link>
          <button onClick={() => handleDuplicate(row._id)} className="btn-ghost p-2 text-blue-600" title="Duplicate">
            <Copy size={16} />
          </button>
          <button onClick={() => handleDelete(row._id)} className="btn-ghost p-2 text-red-600" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your catalog and inventory</p>
        </div>
        <Link to="/seller/products/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      <div className="flex gap-2 pb-2 overflow-x-auto">
        {['', 'active', 'draft', 'inactive'].map((status) => (
          <button
            key={status}
            onClick={() => setStatus(status)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              params.status === status
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {status === '' ? 'All Products' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <DataTable 
        columns={columns}
        data={data.products}
        isLoading={isLoading}
        pagination={{
          page: params.page,
          limit: params.limit,
          totalPages: Math.ceil(data.totalCount / params.limit) || 1,
          totalCount: data.totalCount
        }}
        onPageChange={setPage}
        onSearch={setSearch}
        searchValue={params.search}
        searchPlaceholder="Search by name, SKU..."
      />
    </div>
  );
};

export default ProductsList;

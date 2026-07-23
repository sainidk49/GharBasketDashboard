import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import DataTable from '../../components/ui/DataTable';
import { useTableParams } from '../../hooks/useTableParams';
import { Plus, Edit, ShieldCheck, Trash2 } from 'lucide-react';
import { formatDate, formatSellerStatus, getStatusColor } from '../../utils/formatters';
import toast from 'react-hot-toast';

const SellersList = () => {
  const { params, setPage, setSearch } = useTableParams({ limit: 10 });
  const [data, setData] = useState({ profiles: [], totalCount: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchSellers = async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getSellers(params);
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch sellers:', error);
      toast.error('Failed to fetch sellers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [params]);

  const activateSeller = async (sellerId) => {
    try {
      await adminApi.updateSellerStatus(sellerId, { status: 'active' });
      toast.success('Seller activated');
      fetchSellers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to activate seller');
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await adminApi.deleteSeller(deleteConfirm);
      toast.success('Seller deleted successfully');
      fetchSellers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete seller');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const columns = [
    {
      header: 'Store Name',
      accessor: 'storeName',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.storeName}</p>
          <p className="text-sm text-gray-500">{row.userId?.name}</p>
        </div>
      )
    },
    {
      header: 'Contact',
      accessor: 'contact',
      render: (row) => (
        <div>
          <p className="text-sm text-gray-900">{row.userId?.mobileNumber}</p>
          <p className="text-sm text-gray-500">{row.userId?.email || 'N/A'}</p>
        </div>
      )
    },
    {
      header: 'Joined Date',
      accessor: 'createdAt',
      render: (row) => formatDate(row.createdAt)
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`badge ${getStatusColor(row.status)}`}>
          {formatSellerStatus(row.status)}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Link to={`/admin/sellers/${row._id}`} className="btn-ghost p-2 text-gray-500 hover:text-primary" title="Edit Details">
            <Edit size={18} />
          </Link>
          {row.status !== 'active' && (
            <button
              type="button"
              onClick={() => activateSeller(row._id)}
              className="btn-ghost p-2 text-primary"
              title="Activate seller"
            >
              <ShieldCheck size={18} />
            </button>
          )}
          {row.status !== 'inactive' && (
            <button
              type="button"
              onClick={() => setDeleteConfirm(row._id)}
              className="btn-ghost p-2 text-red-500 hover:bg-red-50"
              title="Delete seller"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="page-title">Store Partners</h1>
          <p className="text-sm text-gray-500 mt-1">Manage sellers and their stores</p>
        </div>
        <Link to="/admin/sellers/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add New Seller
        </Link>
      </div>

      <DataTable 
        columns={columns}
        data={data.profiles}
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
        searchPlaceholder="Search store name..."
      />

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Seller</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to delete this seller? This action will set their account to inactive.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellersList;

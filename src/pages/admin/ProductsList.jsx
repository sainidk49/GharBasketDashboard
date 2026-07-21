import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import adminApi from '../../api/adminApi';
import DataTable from '../../components/ui/DataTable';
import { useTableParams } from '../../hooks/useTableParams';
import { formatCurrency, getFileUrl } from '../../utils/formatters';
import { formatStockQuantity, getStockStatusClass, getStockStatusLabel } from '../../utils/inventory';

const STOCK_FILTERS = [
  { value: '', label: 'All Products' },
  { value: 'in_stock', label: 'In Stock' },
  { value: 'low_stock', label: 'Low Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' }
];

const ProductsList = () => {
  const { params, setPage, setSearch } = useTableParams({ limit: 10 });
  const [stockStatus, setStockStatus] = useState('');
  const [data, setData] = useState({ products: [], totalCount: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await adminApi.getProducts({ ...params, stockStatus });
        setData(response.data);
      } catch {
        toast.error('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [params, stockStatus]);

  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded bg-gray-100 overflow-hidden border border-gray-200">
            {row.images?.length ? (
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
      header: 'Seller',
      accessor: 'seller',
      render: (row) => row.seller?.name || '-'
    },
    {
      header: 'Type',
      accessor: 'productType',
      render: (row) => <span className="capitalize">{row.productType}</span>
    },
    {
      header: 'Price',
      accessor: 'sellingPrice',
      render: (row) => formatCurrency(row.sellingPrice)
    },
    {
      header: 'Available Stock',
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
      header: 'Sold',
      accessor: 'soldStock',
      render: (row) => formatStockQuantity(row.inventory?.soldStock || 0, row.productType)
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Products</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor catalog inventory, low stock alerts, and out-of-stock products.</p>
      </div>

      <div className="flex gap-2 pb-2 overflow-x-auto">
        {STOCK_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStockStatus(filter.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              stockStatus === filter.value
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {filter.label}
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
        searchPlaceholder="Search by product name, SKU..."
      />
    </div>
  );
};

export default ProductsList;

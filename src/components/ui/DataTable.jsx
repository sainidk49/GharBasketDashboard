import React from 'react';
import { Loader2, Search, Filter } from 'lucide-react';
import { clsx } from 'clsx';

const DataTable = ({
  columns,
  data,
  isLoading,
  pagination, // { page, limit, totalPages, totalCount }
  onPageChange,
  onSearch,
  searchPlaceholder = 'Search...',
  searchValue = '',
  actions,
  emptyMessage = 'No records found'
}) => {
  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-border">
      {/* Table Toolbar */}
      {(onSearch || actions) && (
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          {onSearch && (
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="input-field pl-10"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          )}
          {actions && <div className="flex items-center gap-2 w-full sm:w-auto justify-end">{actions}</div>}
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  scope="col"
                  className={clsx("table-header", col.className)}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <Loader2 className="animate-spin h-8 w-8 text-primary mx-auto" />
                  <p className="mt-2 text-sm text-gray-500">Loading data...</p>
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={row._id || rowIndex} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={clsx("table-cell", col.cellClassName)}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Filter className="h-10 w-10 text-gray-300 mb-2" />
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-4 py-3 border-t border-border flex items-center justify-between sm:px-6 bg-gray-50 rounded-b-xl">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{Math.min((pagination.page - 1) * pagination.limit + 1, pagination.totalCount)}</span> to{' '}
                <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.totalCount)}</span> of{' '}
                <span className="font-medium">{pagination.totalCount}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Previous
                </button>
                {/* Add simple page numbers logic if needed, skipping for brevity */}
                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;

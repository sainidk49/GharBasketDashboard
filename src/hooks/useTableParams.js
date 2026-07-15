import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from './useDebounce';

export const useTableParams = (defaults = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || defaults.page || '1', 10);
  const limit = parseInt(searchParams.get('limit') || defaults.limit || '20', 10);
  const sort = searchParams.get('sort') || defaults.sort || 'createdAt';
  const order = searchParams.get('order') || defaults.order || 'desc';
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';

  const debouncedSearch = useDebounce(search, 500);

  const setParam = useCallback(
    (key, value) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        if (key !== 'page') next.set('page', '1');
        return next;
      });
    },
    [setSearchParams]
  );

  const setPage = useCallback((p) => setParam('page', String(p)), [setParam]);
  const setSearch = useCallback((s) => setParam('search', s), [setParam]);
  const setStatus = useCallback((s) => setParam('status', s), [setParam]);
  const setSort = useCallback(
    (field) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        const currentSort = next.get('sort');
        if (currentSort === field) {
          next.set('order', next.get('order') === 'asc' ? 'desc' : 'asc');
        } else {
          next.set('sort', field);
          next.set('order', 'desc');
        }
        next.set('page', '1');
        return next;
      });
    },
    [setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const params = useMemo(
    () => ({
      page,
      limit,
      sort,
      order,
      search: debouncedSearch,
      status
    }),
    [page, limit, sort, order, debouncedSearch, status]
  );

  return {
    params,
    page,
    limit,
    sort,
    order,
    search,
    status,
    setPage,
    setSearch,
    setStatus,
    setSort,
    setParam,
    resetFilters
  };
};

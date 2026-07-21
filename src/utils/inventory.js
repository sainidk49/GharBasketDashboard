export const formatStockQuantity = (quantity = 0, productType = 'piece') => {
  const value = Number(quantity) || 0;

  if (productType === 'weight') {
    if (value >= 1000 && value % 1000 === 0) return `${value / 1000} KG`;
    if (value >= 1000) return `${(value / 1000).toFixed(2).replace(/\.00$/, '')} KG`;
    return `${value} gm`;
  }

  if (productType === 'quantity') {
    return `${value} ${value === 1 ? 'Pack' : 'Packs'}`;
  }

  return `${value} ${value === 1 ? 'Piece' : 'Pieces'}`;
};

export const getStockStatusLabel = (status) => {
  if (status === 'out_of_stock') return 'Out of Stock';
  if (status === 'low_stock') return 'Low Stock';
  return 'In Stock';
};

export const getStockStatusClass = (status) => {
  if (status === 'out_of_stock') return 'bg-red-500';
  if (status === 'low_stock') return 'bg-orange-500';
  return 'bg-green-500';
};

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const formatCurrency = (amount) => {
  if (amount == null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '-';
  return dayjs(date).format('DD MMM YYYY');
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  return dayjs(date).format('DD MMM YYYY, hh:mm A');
};

export const formatRelativeTime = (date) => {
  if (!date) return '-';
  return dayjs(date).fromNow();
};

export const formatPhone = (phone) => {
  if (!phone) return '-';
  return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
};

export const formatOrderStatus = (status) => {
  const map = {
    PLACED: 'Placed',
    CONFIRMED: 'Confirmed',
    PACKING: 'Packing',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled'
  };
  return map[status] || status;
};

export const formatSellerStatus = (status) => {
  const map = {
    pending: 'Pending',
    active: 'Active',
    suspended: 'Suspended',
    rejected: 'Rejected',
    inactive: 'Inactive'
  };
  return map[status] || status;
};

export const formatProductStatus = (status) => {
  const map = {
    draft: 'Draft',
    active: 'Active',
    inactive: 'Inactive',
    archived: 'Archived'
  };
  return map[status] || status;
};

export const formatPaymentStatus = (status) => {
  const map = {
    PENDING: 'Pending',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    REFUNDED: 'Refunded'
  };
  return map[status] || status;
};

export const formatPaymentMethod = (method) => {
  const map = {
    UPI: 'UPI',
    CASH_ON_DELIVERY: 'Cash on Delivery'
  };
  return map[method] || method;
};

export const calculateDiscount = (mrp, sellingPrice) => {
  if (!mrp || !sellingPrice || mrp <= 0) return 0;
  return Math.round(((mrp - sellingPrice) / mrp) * 100);
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

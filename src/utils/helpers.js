import { clsx } from 'clsx';

export const cn = (...inputs) => clsx(inputs);

export const generatePassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
  let password = '';
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
  password += '0123456789'[Math.floor(Math.random() * 10)];
  password += '!@#$%&*' [Math.floor(Math.random() * 7)];
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getStatusColor = (status) => {
  const colors = {
    active: 'status-active',
    DELIVERED: 'status-active',
    COMPLETED: 'status-active',
    pending: 'status-pending',
    PLACED: 'status-pending',
    PENDING: 'status-pending',
    CONFIRMED: 'bg-blue-50 text-blue-700',
    PACKING: 'bg-indigo-50 text-indigo-700',
    OUT_FOR_DELIVERY: 'bg-cyan-50 text-cyan-700',
    suspended: 'status-suspended',
    CANCELLED: 'status-suspended',
    FAILED: 'status-suspended',
    rejected: 'status-suspended',
    inactive: 'status-inactive',
    draft: 'status-draft',
    archived: 'status-draft'
  };
  return colors[status] || 'status-inactive';
};

export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || '/api';
};

export const getFileUrl = (path) => {
  if (!path) return null;
  const resolvedPath = typeof path === 'object'
    ? path.url || path.secure_url || path.path || ''
    : path;

  if (!resolvedPath || typeof resolvedPath !== 'string') return null;
  if (resolvedPath.startsWith('http')) return resolvedPath;
  const baseUrl = getApiBaseUrl().replace('/api', '');
  return `${baseUrl}${resolvedPath}`;
};

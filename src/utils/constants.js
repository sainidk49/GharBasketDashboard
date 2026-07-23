export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'admin',
  SELLER: 'seller',
  CUSTOMER: 'customer',
  DELIVERY_PARTNER: 'delivery_partner'
};

export const PERMISSIONS = {
  SELLER_VIEW: 'SELLER_VIEW',
  SELLER_CREATE: 'SELLER_CREATE',
  SELLER_UPDATE: 'SELLER_UPDATE',
  SELLER_DELETE: 'SELLER_DELETE',
  SELLER_SUSPEND: 'SELLER_SUSPEND',
  USER_VIEW: 'USER_VIEW',
  PRODUCT_VIEW: 'PRODUCT_VIEW',
  PRODUCT_CREATE: 'PRODUCT_CREATE',
  PRODUCT_UPDATE: 'PRODUCT_UPDATE',
  PRODUCT_DELETE: 'PRODUCT_DELETE',
  ORDER_VIEW: 'ORDER_VIEW',
  ORDER_ACCEPT: 'ORDER_ACCEPT',
  ORDER_CANCEL: 'ORDER_CANCEL',
  ORDER_UPDATE_STATUS: 'ORDER_UPDATE_STATUS',
  CATEGORY_VIEW: 'CATEGORY_VIEW',
  CATEGORY_MANAGE: 'CATEGORY_MANAGE',
  REPORT_VIEW: 'REPORT_VIEW',
  SETTINGS_MANAGE: 'SETTINGS_MANAGE'
};

export const ORDER_STATUSES = {
  PLACED: 'PLACED',
  ACCEPTED: 'ACCEPTED',
  PREPARING: 'PREPARING',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  PICKED_UP: 'PICKED_UP',
  CONFIRMED: 'CONFIRMED',
  PACKING: 'PACKING',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  FAILED: 'FAILED'
};

export const ORDER_STATUS_FLOW = {
  PLACED: ['ACCEPTED', 'CANCELLED'],
  ACCEPTED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY_FOR_PICKUP', 'CANCELLED'],
  READY_FOR_PICKUP: ['PICKED_UP'],
  PICKED_UP: ['OUT_FOR_DELIVERY'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'FAILED'],
  CONFIRMED: ['PACKING', 'CANCELLED'],
  PACKING: ['OUT_FOR_DELIVERY', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
  FAILED: []
};

export const SELLER_ORDER_STATUSES = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  PREPARING: 'PREPARING',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  CANCELLED: 'CANCELLED'
};

export const DELIVERY_ORDER_STATUSES = {
  ASSIGNED: 'ASSIGNED',
  ACCEPTED: 'ACCEPTED',
  PICKED_UP: 'PICKED_UP',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED'
};

export const SELLER_STATUSES = {
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  REJECTED: 'rejected',
  INACTIVE: 'inactive'
};

export const PRODUCT_STATUSES = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived'
};

export const PRODUCT_TYPES = {
  WEIGHT: 'weight',
  PIECE: 'piece',
  QUANTITY: 'quantity'
};

export const SELLING_TYPES = {
  PIECE: 'piece',
  WEIGHT: 'weight',
  VOLUME: 'volume',
  PACK: 'pack',
  BOX: 'box',
  BOTTLE: 'bottle',
  DOZEN: 'dozen',
  CUSTOM: 'custom'
};

export const SELLING_TYPE_UNITS = {
  weight: ['mg', 'gm', 'kg'],
  volume: ['ml', 'litre'],
  piece: ['piece'],
  pack: ['pack'],
  box: ['box'],
  bottle: ['bottle'],
  dozen: ['dozen']
};

export const GST_OPTIONS = [
  { value: 0, label: '0% (Exempt)' },
  { value: 5, label: '5%' },
  { value: 12, label: '12%' },
  { value: 18, label: '18%' },
  { value: 28, label: '28%' }
];

export const DIETARY_LABELS = [
  'Vegetarian', 'Non-Vegetarian', 'Vegan', 'Organic', 'Gluten Free',
  'Sugar Free', 'No Added Sugar', 'Preservative Free', 'Chemical Free',
  'Fresh', 'Seasonal', 'Premium'
];

export const PAYMENT_METHODS = {
  UPI: 'UPI',
  CASH_ON_DELIVERY: 'CASH_ON_DELIVERY',
  RAZORPAY: 'RAZORPAY'
};

export const PAYMENT_STATUSES = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

import { ROLES, PERMISSIONS } from './constants';

const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const getPermissionsForRole = (role, sellerPermissions = []) => {
  if (role === ROLES.ADMIN) return ALL_PERMISSIONS;
  if (role === ROLES.SELLER) return sellerPermissions;
  return [];
};

export const hasPermission = (userPermissions, requiredPermission) => {
  if (!userPermissions || !requiredPermission) return false;
  return userPermissions.includes(requiredPermission);
};

export const hasAnyPermission = (userPermissions, requiredPermissions) => {
  if (!userPermissions || !requiredPermissions) return false;
  return requiredPermissions.some((p) => userPermissions.includes(p));
};

export const hasAllPermissions = (userPermissions, requiredPermissions) => {
  if (!userPermissions || !requiredPermissions) return false;
  return requiredPermissions.every((p) => userPermissions.includes(p));
};

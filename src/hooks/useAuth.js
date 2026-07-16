import { useAppSelector } from '../app/hooks';
import { ROLES } from '../utils/constants';
import { getPermissionsForRole, hasPermission as checkPerm } from '../utils/permissions';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  const role = user?.role;
  const isAdmin = role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
  const isSeller = role === ROLES.SELLER;
  const permissions = getPermissionsForRole(role, user?.sellerProfile?.permissions || []);

  const checkPermission = (permission) => checkPerm(permissions, permission);

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    role,
    isAdmin,
    isSeller,
    permissions,
    checkPermission
  };
};

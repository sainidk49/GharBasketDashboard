import { useEffect, useCallback } from 'react';

export const useUnsavedChanges = (isDirty) => {
  const handleWindowClose = useCallback(
    (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    },
    [isDirty]
  );

  useEffect(() => {
    window.addEventListener('beforeunload', handleWindowClose);
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };
  }, [handleWindowClose]);
};

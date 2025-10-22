import { useCallback } from 'react';

export const useNavigationPreload = () => {
  const preloadImportProfiles = useCallback(() => {
    import("@/pages/ImportProfiles");
  }, []);

  const preloadDatabase = useCallback(() => {
    import("@/pages/Database");
  }, []);

  const preloadAnalytics = useCallback(() => {
    import("@/pages/Analytics");
  }, []);

  const preloadQualification = useCallback(() => {
    import("@/pages/Qualification");
  }, []);

  const preloadPublicCandidature = useCallback(() => {
    import("@/pages/PublicCandidature");
  }, []);

  return {
    preloadImportProfiles,
    preloadDatabase,
    preloadAnalytics,
    preloadQualification,
    preloadPublicCandidature,
  };
};
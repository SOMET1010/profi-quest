import { useCallback } from 'react';

export const useNavigationPreload = () => {
  const preloadImportProfiles = useCallback(() => {
    import("@/pages/ImportProfiles");
  }, []);

  const preloadDatabase = useCallback(() => {
    import("@/pages/Database");
  }, []);

  const preloadCampaigns = useCallback(() => {
    import("@/pages/Campaigns");
  }, []);

  const preloadAnalytics = useCallback(() => {
    import("@/pages/Analytics");
  }, []);

  const preloadQualification = useCallback(() => {
    import("@/pages/Qualification");
  }, []);

  const preloadCandidature = useCallback(() => {
    import("@/pages/Candidature");
  }, []);

  return {
    preloadImportProfiles,
    preloadDatabase,
    preloadCampaigns,
    preloadAnalytics,
    preloadQualification,
    preloadCandidature,
  };
};
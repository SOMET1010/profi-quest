/**
 * Hook pour limiter le nombre de tentatives d'une action dans une fenêtre temporelle
 * Utile pour prévenir les attaques par force brute
 */
export function useRateLimiter(key: string, maxAttempts: number, windowMs: number) {
  const getAttempts = (): number[] => {
    try {
      const data = localStorage.getItem(`rateLimit_${key}`);
      if (!data) return [];
      
      const attempts = JSON.parse(data);
      const now = Date.now();
      // Garder uniquement les tentatives dans la fenêtre temporelle
      return attempts.filter((timestamp: number) => now - timestamp < windowMs);
    } catch (error) {
      console.error('[RateLimiter] Error reading attempts:', error);
      return [];
    }
  };

  const canAttempt = (): boolean => {
    const attempts = getAttempts();
    return attempts.length < maxAttempts;
  };

  const recordAttempt = (): void => {
    try {
      const attempts = getAttempts();
      attempts.push(Date.now());
      localStorage.setItem(`rateLimit_${key}`, JSON.stringify(attempts));
    } catch (error) {
      console.error('[RateLimiter] Error recording attempt:', error);
    }
  };

  const getRemainingTime = (): number => {
    const attempts = getAttempts();
    if (attempts.length < maxAttempts) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const resetTime = oldestAttempt + windowMs;
    return Math.max(0, resetTime - Date.now());
  };

  const reset = (): void => {
    try {
      localStorage.removeItem(`rateLimit_${key}`);
    } catch (error) {
      console.error('[RateLimiter] Error resetting:', error);
    }
  };

  return { canAttempt, recordAttempt, getRemainingTime, reset };
}

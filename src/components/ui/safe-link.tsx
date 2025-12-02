import { Link, LinkProps } from 'react-router-dom';
import { isValidRoute } from '@/config/routes';
import { useEffect } from 'react';

interface SafeLinkProps extends LinkProps {
  warnOnInvalid?: boolean;
}

export function SafeLink({ to, warnOnInvalid = true, children, ...props }: SafeLinkProps) {
  const path = typeof to === 'string' ? to : to.pathname || '';
  const isValid = isValidRoute(path);
  
  useEffect(() => {
    if (!isValid && warnOnInvalid && import.meta.env.DEV) {
      console.warn(`🔗 [SafeLink] Lien vers route invalide: "${path}"`);
    }
  }, [path, isValid, warnOnInvalid]);
  
  return (
    <Link to={to} {...props}>
      {children}
    </Link>
  );
}

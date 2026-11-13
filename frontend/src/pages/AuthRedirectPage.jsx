import { useEffect } from 'react';
import { authRedirect } from '../runtime/authRedirect.js';
export default function AuthRedirectPage({ mode }) {
  useEffect(() => {
    let session;
    try {
      session = sessionStorage.getItem('techprep_current_user');
    } catch {
      session = null;
    }
    location.replace(authRedirect(mode, session, location.search));
  }, [mode]);
  return (
    <main className="min-h-screen grid place-items-center text-sm" role="status">
      Opening your {mode === 'signup' ? 'registration' : 'sign-in'} page…
    </main>
  );
}

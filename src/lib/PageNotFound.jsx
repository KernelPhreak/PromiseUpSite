import { useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-7xl font-outfit font-light text-muted-foreground/30">404</h1>
            <div className="h-0.5 w-16 bg-border mx-auto"></div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-outfit font-medium text-foreground">Page Not Found</h2>
            <p className="font-inter text-muted-foreground leading-relaxed">
              The page <span className="font-medium text-foreground">"{pageName}"</span> could not be found.
            </p>
          </div>

          {isAuthenticated && user?.role === 'admin' && (
            <div className="mt-8 p-4 bg-slate-100 rounded-lg border border-slate-200">
              <p className="text-sm font-medium text-slate-700">Admin Note</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                This route does not exist in the React router.
              </p>
            </div>
          )}

          <div className="pt-6">
            <button
              onClick={() => (window.location.href = '/')}
              className="inline-flex items-center px-6 py-3 text-sm font-inter font-semibold text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

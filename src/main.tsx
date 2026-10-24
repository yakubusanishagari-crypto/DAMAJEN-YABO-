import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Root error boundary caught fatal error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleSafeReset = () => {
    try {
      // Clear non-critical caches if storage corruption triggered the issue
      localStorage.removeItem('danmaje_activity_logs');
      localStorage.removeItem('danmaje_analytics');
    } catch {}
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-6 text-center text-[#103C2E]">
          <div className="max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-stone-200 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
              <img src="/official_logo.png" alt="Official Seal" className="w-10 h-10 object-contain" />
            </div>
            <h2 className="text-xl font-bold font-['Manrope']">National Assembly Constituency Portal</h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              The portal is safely recovering from a transient state. Your constituency data remains intact and secure.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <button
                onClick={this.handleReload}
                className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase cursor-pointer shadow transition"
              >
                Reload Portal
              </button>
              <button
                onClick={this.handleSafeReset}
                className="bg-stone-100 hover:bg-stone-200 text-[#103C2E] px-4 py-2.5 rounded-xl font-bold text-xs uppercase cursor-pointer transition border border-stone-200"
              >
                Restore View
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
);


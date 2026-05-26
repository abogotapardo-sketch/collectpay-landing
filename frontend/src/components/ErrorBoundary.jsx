import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorCount: 0 };
    this.maxAutoRecover = 2;
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Auto-recover up to 2 times silently
    if (this.state.errorCount < this.maxAutoRecover) {
      setTimeout(() => {
        this.setState((prev) => ({
          hasError: false,
          error: null,
          errorCount: prev.errorCount + 1
        }));
      }, 1500);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorCount: 0 });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError && this.state.errorCount >= this.maxAutoRecover) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
              <AlertCircle className="h-8 w-8 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Algo salió mal</h1>
            <p className="text-slate-600 mb-6">
              Hemos detectado un problema temporal. Nuestro sistema intentará restablecer automáticamente.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReload}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all"
                data-testid="error-reload-button"
              >
                <RefreshCw className="h-4 w-4" />
                Recargar página
              </button>
              <button
                onClick={this.handleHome}
                className="w-full bg-white border-2 border-slate-300 hover:border-cyan-500 text-slate-700 hover:text-cyan-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
                data-testid="error-home-button"
              >
                <Home className="h-4 w-4" />
                Volver al inicio
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-6">
              Si el problema persiste, contáctanos al{' '}
              <a href="tel:3116579706" className="text-cyan-600 hover:underline">311 657 9706</a>
            </p>
          </div>
        </div>
      );
    }

    if (this.state.hasError) {
      // During silent recovery, show a brief loading
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-cyan-600 mx-auto mb-3" />
            <p className="text-slate-600 text-sm">Restableciendo...</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

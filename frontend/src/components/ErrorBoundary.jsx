import React, { Component } from 'react';
import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#070b13] px-4 text-center">
          <div className="glass-panel p-8 rounded-2xl max-w-md w-full border border-red-500/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500 to-pink-500" />
            <h1 className="text-2xl font-bold text-text-heading font-heading mb-3">Something went wrong</h1>
            <p className="text-sm text-text-muted mb-6">
              An unexpected error occurred in the workspace application layer.
            </p>
            <div className="bg-bg-main/50 rounded-lg p-3 text-left text-xs font-mono text-red-400 overflow-x-auto mb-6 max-h-32 border border-border-color">
              {this.state.error?.toString()}
            </div>
            <Button onClick={this.handleReset} variant="primary" className="w-full">
              Reset Workspace
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

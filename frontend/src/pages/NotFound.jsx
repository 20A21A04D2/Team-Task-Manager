import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#070b13] px-4 text-center">
      <div className="glass-panel p-8 rounded-2xl max-w-md w-full border border-border-color shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 mb-6 animate-bounce">
          <FiAlertTriangle size={32} />
        </div>
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 font-heading mb-2">404</h1>
        <h3 className="text-xl font-bold text-text-heading mb-3">Page Not Found</h3>
        <p className="text-sm text-text-muted mb-8 max-w-xs leading-relaxed">
          The dashboard link or project workspace you are attempting to view does not exist.
        </p>
        <Link to="/dashboard" className="w-full">
          <Button variant="primary" className="w-full flex items-center justify-center gap-2">
            <FiHome size={16} />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

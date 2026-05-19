import React from 'react';
import Spinner from './Spinner';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/20 focus:ring-brand-600/30',
    secondary: 'bg-bg-surface hover:bg-bg-main text-text-heading border border-border-color focus:ring-border-color/30',
    danger: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 focus:ring-red-600/30',
    ghost: 'bg-transparent hover:bg-bg-surface text-text-muted hover:text-text-heading focus:ring-border-color/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || disabled}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size="sm" color={variant === 'primary' || variant === 'danger' ? 'white' : 'brand'} />
          <span className="ml-2">Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;

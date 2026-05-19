import React from 'react';

const Input = React.forwardRef(({
  label,
  name,
  type = 'text',
  error,
  placeholder,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col w-full gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-xs font-semibold text-text-muted tracking-wide uppercase">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 bg-bg-surface border ${
          error ? 'border-red-500 focus:ring-red-500/20' : 'border-border-color focus:border-brand-500 focus:ring-brand-500/20'
        } rounded-lg text-text-heading placeholder-text-muted focus:outline-none focus:ring-4 transition duration-200`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-400 mt-0.5 font-medium">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

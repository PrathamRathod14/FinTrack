const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  gold: 'btn-gold',
  ghost: 'px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium'
};

const sizes = {
  sm: 'text-sm px-3 py-1.5',
  md: '',
  lg: 'text-lg px-6 py-3'
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  ...props
}) {
  return (
    <button
      className={`${variants[variant]} ${sizes[size]} inline-flex items-center justify-center gap-2 ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

import { Link } from 'react-router-dom';

const variantClasses = {
  primary:
    'bg-yellow-400 text-zinc-900 hover:bg-yellow-300 border-yellow-400',

  secondary:
    'bg-blue-900/95 text-zinc-50 border-blue-700 hover:bg-blue-800',

};

const Button = ({
  children,
  to,
  type = 'button',
  variant = 'secondary',
  className = '',
  onClick,
  disabled = false,
  ...rest
}) => {
  const classes = [
    'inline-flex items-center justify-center rounded-full border-2 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] transition',
    variantClasses[variant] ?? variantClasses.secondary,
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className,
  ]
    .join(' ')
    .trim();

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
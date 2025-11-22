import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className = '',
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    id,
    type = 'text',
    ...props
  }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const hasError = !!error;

    const baseInputStyles = `
      w-full h-11 px-4 py-2.5
      bg-background
      border rounded-lg
      text-foreground text-base
      placeholder:text-muted-foreground
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-0
      disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted
    `.replace(/\s+/g, ' ').trim();

    const stateStyles = hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : 'border-input focus:border-primary focus:ring-primary/20';

    const paddingStyles = leftIcon && rightIcon
      ? 'pl-11 pr-11'
      : leftIcon
        ? 'pl-11'
        : rightIcon
          ? 'pr-11'
          : '';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`${baseInputStyles} ${stateStyles} ${paddingStyles} ${className}`}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="mt-2 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-2 text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea 컴포넌트
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className = '',
    label,
    error,
    hint,
    id,
    rows = 4,
    ...props
  }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const hasError = !!error;

    const baseStyles = `
      w-full px-4 py-3
      bg-background
      border rounded-lg
      text-foreground text-base
      placeholder:text-muted-foreground
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-0
      disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted
      resize-y min-h-[100px]
    `.replace(/\s+/g, ' ').trim();

    const stateStyles = hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : 'border-input focus:border-primary focus:ring-primary/20';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`${baseStyles} ${stateStyles} ${className}`}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined
          }
          {...props}
        />

        {error && (
          <p id={`${textareaId}-error`} className="mt-2 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${textareaId}-hint`} className="mt-2 text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, Textarea };

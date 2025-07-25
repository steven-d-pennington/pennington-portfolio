'use client'

import React, { useState } from 'react'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number'
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  placeholder?: string
  disabled?: boolean
  className?: string
  autoComplete?: string
  validation?: {
    pattern?: RegExp
    minLength?: number
    maxLength?: number
    custom?: (value: string) => string | null
  }
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error: externalError,
  required = false,
  placeholder,
  disabled = false,
  className = '',
  autoComplete,
  validation
}: FormFieldProps) {
  const [touched, setTouched] = useState(false)
  const [internalError, setInternalError] = useState<string | null>(null)

  const validateField = (fieldValue: string) => {
    if (required && !fieldValue.trim()) {
      return `${label} is required`
    }

    if (validation) {
      const { pattern, minLength, maxLength, custom } = validation

      if (pattern && fieldValue && !pattern.test(fieldValue)) {
        return `${label} format is invalid`
      }

      if (minLength && fieldValue.length < minLength) {
        return `${label} must be at least ${minLength} characters`
      }

      if (maxLength && fieldValue.length > maxLength) {
        return `${label} must be no more than ${maxLength} characters`
      }

      if (custom) {
        const customError = custom(fieldValue)
        if (customError) return customError
      }
    }

    // Built-in validations
    if (type === 'email' && fieldValue) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(fieldValue)) {
        return 'Please enter a valid email address'
      }
    }

    if (type === 'url' && fieldValue) {
      try {
        new URL(fieldValue)
      } catch {
        return 'Please enter a valid URL'
      }
    }

    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // Real-time validation
    if (touched) {
      const error = validateField(newValue)
      setInternalError(error)
    }
  }

  const handleBlur = () => {
    setTouched(true)
    const error = validateField(value)
    setInternalError(error)
  }

  const displayError = externalError || internalError
  const hasError = Boolean(displayError && touched)

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
          ${hasError 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 dark:border-gray-600'
          }
        `}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
      />
      {hasError && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
          {displayError}
        </p>
      )}
    </div>
  )
}

// Select field component
interface SelectFieldProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  placeholder?: string
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  className = '',
  placeholder = 'Select an option...'
}: SelectFieldProps) {
  const hasError = Boolean(error)

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          dark:bg-gray-700 dark:border-gray-600 dark:text-white
          ${hasError 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 dark:border-gray-600'
          }
        `}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hasError && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

// Textarea field component
interface TextareaFieldProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  placeholder?: string
  disabled?: boolean
  className?: string
  rows?: number
  maxLength?: number
}

export function TextareaField({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  disabled = false,
  className = '',
  rows = 4,
  maxLength
}: TextareaFieldProps) {
  const hasError = Boolean(error)

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed resize-vertical
          dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
          ${hasError 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 dark:border-gray-600'
          }
        `}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
      />
      {maxLength && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          {value.length}/{maxLength}
        </div>
      )}
      {hasError && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
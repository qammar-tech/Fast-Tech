import styles from './inputField.module.scss'
import PasswordEye from '@/assets/icons/passwordEye.svg'
import { useState } from 'react'
import { UseFormRegister, RegisterOptions } from 'react-hook-form'

interface InputFieldProps {
  type: string
  label: string
  name: string
  title: string
  register?: UseFormRegister<any> // Adjust the type based on your form data structure
  errors?: Record<string, unknown> // Use the correct type based on your version of react-hook-form
  useReactHookForm?: boolean
  defaultValue?: string | number
  showPassword?: any
  validationRules?: RegisterOptions<Record<string, string | number>>
  style?: React.CSSProperties
}

export default function InputField({
  type,
  label,
  showPassword,
  title,
  style,
  register,
  name,
  useReactHookForm = true,
  validationRules = { required: false },
  ...props
}: InputFieldProps) {
  const [isVisible, setIsVisible] = useState(false)

  const handleFunction = () => {
    setIsVisible(!isVisible)
    // Call the callback function with the new visibility state
    showPassword(isVisible)
  }

  return (
    <div className={styles.mainDiv}>
      <span className={styles.title}>{title}</span>

      <div className={styles['input-container']}>
        <input
          className={styles.input}
          {...(useReactHookForm && register
            ? register(name, validationRules)
            : {})}
          type={isVisible ? 'text' : type} // Toggle between 'text' and original type
          placeholder={label}
          {...props}
          style={{ ...style }}
        />
        {type === 'password' && ( // Only show the eye icon for password input
          <img
            src={PasswordEye}
            alt="Show Password"
            className={styles['show-password-icon']}
            onClick={handleFunction}
          />
        )}
      </div>
      {/* {errors && errors[name] && (
  <div className={styles['error-popup']}>
    <span className={styles['error-message']}>
      {errors[name] && typeof errors[name] === 'object' && 'message' in errors[name] ? (
        (errors[name] as { message: React.ReactNode }).message
      ) : (
        'An error occurred'
          </span>
        </div>
      )} */}
    </div>
  )
}

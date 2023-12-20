import styles from './button.module.scss'
import googleIcon from '@/assets/icons/googleIcon.svg'
interface ButtonProps {
  text: string
  type: 'button' | 'submit' | 'reset'
  style?: React.CSSProperties
  onClick?: () => void
  disabled?: boolean | undefined
}

export default function GoogleButton({
  text,
  type,
  style,
  onClick,
  disabled
}: ButtonProps) {
  return (
    <div>
      <button
        className={styles.GoogleButton}
        type={type}
        style={{ ...style }}
        onClick={onClick as any}
        disabled={disabled as any}
      >
        <img
          src={googleIcon}
          alt="Google Icon"
          style={{ marginRight: '5px' }}
        />{' '}
        {/* Added Google Icon */}
        {text}
      </button>
    </div>
  )
}

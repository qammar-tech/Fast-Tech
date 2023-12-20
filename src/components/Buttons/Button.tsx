import styles from './button.module.scss'

interface ButtonProps {
  text: string
  type: 'button' | 'submit' | 'reset'
  chatVariant?: any
  style?: React.CSSProperties
  onClick?: () => void
  disabled?: boolean
}

export default function Button({
  text,
  type,
  style,
  chatVariant,
  onClick,
  disabled
}: ButtonProps) {
  return (
    <button
      className={chatVariant ? styles.endConversation : styles.button}
      type={type}
      style={{ ...style }}
      onClick={onClick as any}
      disabled={disabled}
    >
      {text}
    </button>
  )
}

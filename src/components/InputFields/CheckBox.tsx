import styles from './inputField.module.scss'

interface CheckBoxProp {
  label?: string
}

export default function CheckBox({ label }: CheckBoxProp) {
  return (
    <>
      <div className={styles.checkboxDiv}>
        <input type="checkbox"></input>
        <label>{label}</label>
      </div>
    </>
  )
}

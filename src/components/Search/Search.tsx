import React from 'react'
import styles from './search.module.scss'
import search from '@/assets/icons/search.svg'
export default function Search() {
  return (
    <div>
      <input type="text" placeholder="Search" className={styles.search}></input>
      <button className={styles.searchIcon}>
        <img src={search} />
      </button>
    </div>
  )
}

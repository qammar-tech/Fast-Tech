import React from 'react'
import styles from './styles.module.scss'
import { CircularProgress } from '@mui/material'

interface PageLoaderProps {
  text?: string
}

export default function PageLoader({}: PageLoaderProps) {
  return (
    <>
      <div className={styles.overlay}></div>
      <div className={styles.loaderContainer}>
        {/*<p>{text}</p>*/}
        {/*{text && <p>{text}</p>}*/}
        <CircularProgress />
      </div>
    </>
  )
}

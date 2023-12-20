import home from '@/assets/icons/Home.svg'
import bell from '@/assets/icons/Bell.svg'
import bookmark from '@/assets/icons/Bookmark.svg'
import message from '@/assets/icons/message.svg'
import plus from '@/assets/icons/plus.svg'
import profileIcon from '@/assets/images/profile.svg'
import styles from './sidebar.module.scss'
import { useEffect, useState } from 'react'
interface SideBarProps {
  setProfileCardDisplay?: () => void
}
export default function Sidebar({ setProfileCardDisplay }: SideBarProps) {
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth)
  const [isProfile, setIsProfile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }

    handleResize()

    // Attach the event listener
    window.addEventListener('resize', handleResize)

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      {screenWidth >= 600 ? (
        <div className={styles.iconsGroup}>
          <img alt="home" src={home} className={styles.icons} />
          <img alt="notifications" src={bell} className={styles.icons} />
          <img alt="bookmark" src={bookmark} className={styles.icons} />
          <img alt="message" src={message} className={styles.icons} />
          <img alt="add" src={plus} className={styles.icons} />
        </div>
      ) : (
        <>
          <div className={styles.iconsGroupMobile}>
            <img alt="home" src={home} className={styles.icons} />
            <img alt="bookmark" src={bookmark} className={styles.icons} />
            <img alt="add" src={plus} className={styles.icons} />
            <img alt="message" src={message} className={styles.icons} />
            <img
              alt="profile"
              src={profileIcon}
              className={styles.icons}
              onClick={() => {
                setIsProfile(!isProfile)
                setProfileCardDisplay && setProfileCardDisplay()
              }}
            />
          </div>
        </>
      )}
    </>
  )
}

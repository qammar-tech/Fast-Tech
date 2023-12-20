import React, { useEffect, useState } from 'react'
import styles from './profile.module.scss'
import profile from '@/assets/images/profile.svg'
import closeIcon from '@/assets/icons/close.svg'
import { profileCardList } from './ProfileContent'
// import { useNavigate } from 'react-router-dom' // Corrected import
import { useAuth } from '@/hooks/AuthContext'

interface ProfileCardProps {
  display: (displayState: boolean) => void
  profileCardDisplay?: boolean // Function type that takes a boolean parameter
}
export default function ProfileCard({
  display,
  profileCardDisplay
}: ProfileCardProps) {
  // const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth)
  const [cardDisplay, setCardDisplay] = useState(profileCardDisplay)
  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  }
  const handleActions = (content: any) => {
    if (content.path === 'logout') {
      logout()
    } else if (content.path === 'close') {
      display(false)
      setCardDisplay(false)
    } else {
      // navigate(content.path)
    }
  }
  useEffect(() => {
    handleResize()

    // Attach the event listener
    window.addEventListener('resize', handleResize)

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return screenWidth <= 600 && cardDisplay === true ? (
    <>
      <div className={`${styles.sideBarCard} ${cardDisplay && styles.show}`}>
        <div className={styles.profileDiv}>
          <img src={profile} alt="profile" height="50" width="50" />
          <img
            src={closeIcon}
            alt="close icon"
            style={{ marginBottom: '15%', cursor: 'pointer' }}
            onClick={() => handleActions({ path: 'close' })} // Example content for closing
          />
        </div>
        <div
          style={{
            display: 'grid',
            paddingBottom: '1rem',
            paddingLeft: '1.5rem'
          }}
        >
          <span className={styles.profileText}>{user?.name}</span>
          <span className={styles.profileEmail}>@{user?.username}</span>
        </div>
        <div className={styles.followersDiv}>
          <span className={styles.followers}>
            520 <span className={styles.followersText}>Followers</span>
          </span>
          <span className={styles.followers}>
            23 <span className={styles.followersText}>Following</span>
          </span>
        </div>
        {profileCardList.map((content, index) => (
          <>
            <div
              className={styles.profileList}
              onClick={() => handleActions(content)}
            >
              <img
                key={index}
                style={{ paddingRight: '1rem' }}
                src={content.icon}
                alt="Profile Icon"
              />
              <span key={index}>{content.text}</span>
            </div>
          </>
        ))}
      </div>
    </>
  ) : (
    <div className={styles.mainDiv}>
      <div className={styles.profileDiv}>
        <img src={profile} alt="profile" height="50" width="50" />
        <img
          src={closeIcon}
          alt="close icon"
          style={{ marginBottom: '15%', cursor: 'pointer' }}
          onClick={() => handleActions({ path: 'close' })} // Example content for closing
        />
      </div>
      <div
        style={{
          display: 'grid',
          paddingBottom: '1rem',
          paddingLeft: '1.5rem'
        }}
      >
        <span className={styles.profileText}>{user?.name}</span>
        <span className={styles.profileEmail}>@{user?.username}</span>
      </div>
      <div className={styles.followersDiv}>
        <span className={styles.followers}>
          520 <span className={styles.followersText}>Followers</span>
        </span>
        <span className={styles.followers}>
          23 <span className={styles.followersText}>Following</span>
        </span>
      </div>
      {profileCardList.map((content, index) => (
        <>
          <div
            className={styles.profileList}
            onClick={() => handleActions(content)}
          >
            <img
              key={index}
              style={{ paddingRight: '1rem' }}
              src={content.icon}
              alt="Profile Icon"
            />
            <span key={index}>{content.text}</span>
          </div>
        </>
      ))}
    </div>
  )
}

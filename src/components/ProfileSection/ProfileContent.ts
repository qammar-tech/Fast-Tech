import profileIcon from '@/assets/icons/profileDummy.svg'
import creditCard from '@/assets/icons/creditCard.svg'
import settings from '@/assets/icons/settings.svg'
import logout from '@/assets/icons/logout.svg'
export const profileCardList = [
  {
    icon: profileIcon,
    text: 'My Profile',
    path: '/profile'
  },
  {
    icon: creditCard,
    text: 'Your cards',
    subText: '(to subscribe)',
    path: '/cards'
  },
  {
    icon: settings,
    text: 'Settings',
    path: '/settings'
  },
  {
    icon: logout,
    text: 'Log out',
    path: 'logout'
  }
]

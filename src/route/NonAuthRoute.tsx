import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useAuth } from '@/hooks/AuthContext'

type PrivateRouteProps = RouteProps

const NonAuthRoute: React.FC<PrivateRouteProps> = ({ children, ...rest }) => {
  const { isAuthenticated } = useAuth()

  return (
    <Route
      {...rest}
      render={() => (!isAuthenticated || isAuthenticated) ? (children as any) : <Redirect to="/" />
      }
    />
  )
}

export default NonAuthRoute

import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useAuth } from '@/hooks/AuthContext'

type PrivateRouteProps = RouteProps

const AuthRoute: React.FC<PrivateRouteProps> = ({ children, ...rest }) => {
  const { isAuthenticated } = useAuth()

  return (
    <Route
      {...rest}
      render={() =>
        isAuthenticated ? (children as any) : <Redirect to="/login" />
      }
    />
  )
}

export default AuthRoute

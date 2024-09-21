import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));

const ChangePasswordCard = Loadable(lazy(() => import('views/pages/authentication/account-settings/security/ChangePassWordCard')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/auth/login',
      element: <AuthLogin3 />
    },
    {
      path: '/auth/change-password',
      element: <ChangePasswordCard />
    }
  ]
};

export default AuthenticationRoutes;

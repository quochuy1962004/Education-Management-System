import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// Account Settings routing
const AuthAccountSettings = Loadable(lazy(() => import('views/pages/authentication/account-settings/Settings')));

// ==============================|| ACCOUNT SETTINGS ROUTING ||============================== //

const AccountSettingsRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/account-settings', 
      element: <AuthAccountSettings /> 
    }
  ]
};

export default AccountSettingsRoutes;

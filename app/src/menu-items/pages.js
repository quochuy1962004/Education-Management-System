// assets
import { IconKey } from '@tabler/icons-react';
import { IconBrandSuperhuman } from '@tabler/icons-react';
// constant
const icons = {
  IconKey,
  IconBrandSuperhuman
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Pages',
  caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Authentication',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'login',
          title: 'Login',
          type: 'item',
          url: '/auth/login',
        },
        {
          id: 'change-password',
          title: 'Change Password',
          type: 'item',
          url: '/auth/change-password',
        }

      ]
    },
  ]
};

export default pages;

// assets
import {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconBrandSuperhuman,
  IconNotebook,
  IconUserShield
} from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconBrandSuperhuman,
  IconNotebook,
  IconUserShield
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'admin',
      title: 'iAdmin',
      type: 'collapse',
      icon: icons.IconBrandSuperhuman,
      children: [
        {
          id: 'student-management',
          title: 'Student Management',
          type: 'item',
          url: 'admin/student-management',
          breadcrumbs: false
        },
        {
          id: 'teacher-management',
          title: 'Teacher Management',
          type: 'item',
          url: 'admin/teacher-management',
          breadcrumbs: false
        },
        {
          id: 'course-management',
          title: 'Course Management',
          type: 'item',
          url: 'admin/course-management',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'student',
      title: 'iStudent',
      type: 'collapse',
      icon: icons.IconNotebook,
      children: [
        {
          id: 'schedule',
          title: 'Schedule',
          type: 'item',
          url: 'student/schedule',
          breadcrumbs: false
        },
        {
          id: 'student-transcript',
          title: 'Student Transcript',
          type: 'item',
          url: 'student/student-transcript',
          breadcrumbs: false
        },
        {
          id: 'courses-site',
          title: 'Courses Site',
          type: 'item',
          url: 'student/courses-site',
          breadcrumbs: false
        },
        {
          id: 'course-registration',
          title: 'Course-registration',
          type: 'item',
          url: 'student/course-registration',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'teacher',
      title: 'iTeacher',
      type: 'collapse',
      icon: icons.IconUserShield,
      children: [
        {
          id: 'grade',
          title: 'Grading',
          type: 'item',
          url: 'teacher/grading',
          breadcrumbs: false
        },
        {
          id: 'courses-site',
          title: 'Courses Site',
          type: 'item',
          url: 'teacher/courses-site'
        },
        {
          id: 'schedule',
          title: 'Schedule',
          type: 'item',
          url: 'teacher/schedule',
          breadcrumbs: false
        }
      ]
    }
    // {
    //   id: 'util-typography',
    //   title: 'Typography',
    //   type: 'item',
    //   url: '/utils/util-typography',
    //   icon: icons.IconTypography,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'util-color',
    //   title: 'Color',
    //   type: 'item',
    //   url: '/utils/util-color',
    //   icon: icons.IconPalette,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'util-shadow',
    //   title: 'Shadow',
    //   type: 'item',
    //   url: '/utils/util-shadow',
    //   icon: icons.IconShadow,
    //   breadcrumbs: false
    // }
  ]
};

export default utilities;

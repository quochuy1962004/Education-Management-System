import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import MinimalLayout from 'layout/MinimalLayout';

import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const StudentManagement = Loadable(lazy(() => import('views/utilities/StudentManagement')));
const TeacherManagement = Loadable(lazy(() => import('views/utilities/TeacherManagement')));
const CourseManagement = Loadable(lazy(() => import('views/utilities/CourseManagement')));
const StudentManagementByTeacher = Loadable(lazy(() => import('views/utilities/Grading')));
const StudentTranscript = Loadable(lazy(() => import('views/utilities/StudentTranscript')));
const Schedule = Loadable(lazy(() => import('views/utilities/Schedule')));
const CourseRegistration = Loadable(lazy(() => import('views/utilities/CourseRegistration')));
const TeacherSchedule = Loadable(lazy(() => import('views/utilities/TeacherSchedule')));
const CoursesSite = Loadable(lazy(() => import('views/utilities/CoursesSite')));
const CourseDetail = Loadable(lazy(() => import('views/utilities/CourseDetail')));

// sample page routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
// Account Settings routing
const AccountSettings = Loadable(lazy(() => import('views/pages/authentication/account-settings/Settings')));
// ==============================|| MAIN ROUTING ||============================== //
const userId = localStorage.getItem('userId');
const role = localStorage.getItem('role');
const MainRoutes = {
  path: '/',
  element: userId === null ? <MinimalLayout /> : <MainLayout />,
  children: [
    {
      path: '/',
      element: userId === null ? <AuthLogin3 /> : <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: userId === null ? <AuthLogin3 /> : <DashboardDefault />
        }
      ]
    },
    {
      path: 'admin',
      children: [
        {
          path: 'student-management',
          element: userId === null || role !== 'admin' ? <AuthLogin3 requiredRole="Admin" /> : <StudentManagement />
        }
      ]
    },
    {
      path: 'admin',
      children: [
        {
          path: 'teacher-management',
          element: userId === null || role !== 'admin' ? <AuthLogin3 requiredRole="Admin" /> : <TeacherManagement />
        }
      ]
    },
    {
      path: 'admin',
      children: [
        {
          path: 'course-management',
          element: userId === null || role !== 'admin' ? <AuthLogin3 requiredRole="Admin" /> : <CourseManagement />
        }
      ]
    },
    {
      path: 'teacher',
      children: [
        {
          path: 'grading',
          element: userId === null || role !== 'teacher' ? <AuthLogin3 requiredRole="Teacher" /> : <StudentManagementByTeacher />
        },
        {
          path: 'courses-site',
          element:
            userId === null || role !== 'teacher' ? (
              <AuthLogin3 requiredRole="Teacher" />
            ) : (
              <CoursesSite currentRole="teacher" uid={userId} />
            )
        },
        {
          path: 'schedule',
          element: userId === null || role !== 'teacher' ? <AuthLogin3 requiredRole="Teacher" /> : <TeacherSchedule />
        },
        {
          path: 'courses-site/:courseCode',
          element: <CourseDetail />
        }
      ]
    },
    {
      path: 'student',
      children: [
        {
          path: 'student-transcript',
          element: userId === null || role !== 'student' ? <AuthLogin3 requiredRole="Student" /> : <StudentTranscript />
        },
        {
          path: 'courses-site',
          element:
            userId === null || role !== 'student' ? (
              <AuthLogin3 requiredRole="Student" />
            ) : (
              <CoursesSite currentRole="student" uid={userId} />
            )
        },
        {
          path: 'courses-site/:courseCode',
          element: <CourseDetail />
        },
        {
          path: 'schedule',
          element: userId === null || role !== 'student' ? <AuthLogin3 requiredRole="Student" /> : <Schedule />
        },
        {
          path: 'course-registration',
          element: userId === null || role !== 'student' ? <AuthLogin3 requiredRole="Student" /> : <CourseRegistration />
        }
      ]
    },
    {
      path: 'account-settings',
      element: userId === null ? <AuthLogin3 /> : <AccountSettings />
    }
  ]
};

export default MainRoutes;

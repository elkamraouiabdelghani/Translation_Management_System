import React, { lazy } from 'react';

import { Icon } from '@chakra-ui/react';
import {
    MdPerson,
    MdHome,
    MdLock,
    MdApps,
    MdTranslate,
    MdDeveloperMode,
    MdPersonSearch,
} from 'react-icons/md';

// Admin Imports
// import MainDashboard from 'views/admin/default';
// import Profile from 'views/admin/profile';

// Auth Imports
// import SignInCentered from 'views/auth/signIn';
// import SignUpCentered from 'views/auth/signUp';
// import Apps from 'views/productOwner/apps/apps';
// import Trans from 'views/productOwner/translations/trans';
// import Devs from 'views/productOwner/developers';
// import Users from 'views/admin/users';

const MainDashboard = lazy(() => import('views/admin/default'));
const Profile = lazy(() => import('views/admin/profile'));
const SignInCentered = lazy(() => import('views/auth/signIn'));
const SignUpCentered = lazy(() => import('views/auth/signUp'));
const Apps = lazy(() => import('views/productOwner/apps/apps'));
const Trans = lazy(() => import('views/productOwner/translations/trans'));
const Devs = lazy(() => import('views/productOwner/developers'));
const Users = lazy(() => import('views/admin/users'));

const routes = JSON.parse(localStorage.getItem('user'))?
    JSON.parse(localStorage.getItem('user')).role == 'admin' ? [
        {
            name: 'Main Dashboard',
            layout: '/admin',
            path: '/default',
            icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
            component: <MainDashboard />,
        },
        {
            name: 'Profile',
            layout: '/admin',
            path: '/profile',
            icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
            component: <Profile />,
        },
        {
            name: 'Users',
            layout: '/admin',
            path: '/users',
            icon: <Icon as={MdPersonSearch} width="20px" height="20px" color="inherit" />,
            component: <Users />,
        },
        {
            name: 'Translations',
            layout: '/admin',
            path: '/translations',
            icon: <Icon as={MdTranslate} width="20px" height="20px" color="inherit" />,
            component: <Trans />
        },
        // auth
        {
            name: 'Sign In',
            layout: '/auth',
            path: '/sign-in',
            icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
            component: <SignInCentered />,
        },
        {
            name: 'Sign Up',
            layout: '/auth',
            path: '/sign-up',
            icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
            component: <SignUpCentered />,
        }
    ]
        :JSON.parse(localStorage.getItem('user')).role == 'product owner'?[
            {
                name: 'Main Dashboard',
                layout: '/admin',
                path: '/default',
                icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
                component: <MainDashboard />,
            },
            {
                name: 'Profile',
                layout: '/admin',
                path: '/profile',
                icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
                component: <Profile />,
            },
            // product owner
            {
                name: 'Apps',
                layout: '/admin',
                path: '/apps',
                icon: <Icon as={MdApps} width="20px" height="20px" color="inherit" />,
                component: <Apps />,
            },
            {
                name: 'Translations',
                layout: '/admin',
                path: '/translations',
                icon: <Icon as={MdTranslate} width="20px" height="20px" color="inherit" />,
                component: <Trans />
            },
            {
                name: 'Developers',
                layout: '/admin',
                path: '/developers',
                icon: <Icon as={MdDeveloperMode} width="20px" height="20px" color="inherit" />,
                component: <Devs />
            },
            // auth
            {
                name: 'Sign In',
                layout: '/auth',
                path: '/sign-in',
                icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
                component: <SignInCentered />,
            },
            {
                name: 'Sign Up',
                layout: '/auth',
                path: '/sign-up',
                icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
                component: <SignUpCentered />,
            }
        ]
            :[
                {
                    name: 'Main Dashboard',
                    layout: '/admin',
                    path: '/default',
                    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
                    component: <MainDashboard />,
                },
                {
                    name: 'Profile',
                    layout: '/admin',
                    path: '/profile',
                    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
                    component: <Profile />,
                },
                // developer
                {
                    name: 'Apps',
                    layout: '/admin',
                    path: '/apps',
                    icon: <Icon as={MdApps} width="20px" height="20px" color="inherit" />,
                    component: <Apps />,
                },
                {
                    name: 'Translations',
                    layout: '/admin',
                    path: '/translations',
                    icon: <Icon as={MdTranslate} width="20px" height="20px" color="inherit" />,
                    component: <Trans />
                },
                // auth
                {
                    name: 'Sign In',
                    layout: '/auth',
                    path: '/sign-in',
                    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
                    component: <SignInCentered />,
                },
                {
                    name: 'Sign Up',
                    layout: '/auth',
                    path: '/sign-up',
                    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
                    component: <SignUpCentered />,
                }
            ]
    :[
        {
            name: 'Sign In',
            layout: '/auth',
            path: '/sign-in',
            icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
            component: <SignInCentered />,
        },
        {
            name: 'Sign Up',
            layout: '/auth',
            path: '/sign-up',
            icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
            component: <SignUpCentered />,
        }
    ];

export default routes;

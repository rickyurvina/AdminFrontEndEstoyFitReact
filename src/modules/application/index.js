//import {mapConfigs} from './googleMap';
//import {rechartsConfigs} from './recharts';
import React from 'react';
//import {calendarConfigs} from './calendar';

export const applicationConfigs = [
  //...mapConfigs,
  //...rechartsConfigs,
  {
    auth: ['user'],
    role: [1],
    routes: [
      {
        path: '/application/gimnasios',
        component: React.lazy(() => import('./gims')),
      },
    ],
  },
  {
    auth: ['user'],
    role: [1],
    routes: [
      {
        path: '/application/sucursales',
        component: React.lazy(() => import('./superAdminGymBranch')),
      }]
  },
  {
    auth: ['user'],
    role: [1],
    routes: [
      {
        path: '/application/pases',
        component: React.lazy(() => import('./passes')),
      },
    ],
  },
  {
    auth: ['user'],
    role: [1],
    routes: [
      {
        path: '/application/tiposdepases',
        component: React.lazy(() => import('./typePasses')),
      },
    ],
  },

  {
    auth: ['user'],
    role: [1],
    routes: [
      {
        path: '/application/services',
        component: React.lazy(() => import('./services')),
      },
    ],
  },
  {
    auth: ['user'],
    role: [1],
    routes: [
      {
        path: '/application/categorias',
        component: React.lazy(() => import('./categories')),
      },
    ],
  },
  {
    auth: ['user'],
    role: [1],
    routes: [
      {
        path: '/application/calendar',
        component: React.lazy(() => import('./calendar')),
      }]
  },

  {
    auth: ['user'],
    role: [2],
    routes: [
      {
        path: '/application/sucursales',
        component: React.lazy(() => import('./reactTable')),
      },
    ],
  },
  {
    auth: ['user'],
    role: [2],
    routes: [
      {
        path: '/application/usuarios',
        component: React.lazy(() => import('./users')),
      },
    ],
  },
  {
    auth: ['user'],
    role: [2],
    routes: [
      {
        path: '/application/gymadmin',
        component: React.lazy(() => import('./gymAdminCrud')),
      },
    ],
  },
  {
    auth: ['user'],
    role: [3],
    routes: [
      {
        path: '/application/sucursaladmin',
        component: React.lazy(() => import('./gymBranchCrud')),
      },
    ],
  },
  {
    auth: ['user'],
    role: [3],
    routes: [
      {
        path: '/application/galeria',
        component: React.lazy(() => import('./galleryGymBranch')),
      },
    ],
  },
  {
    auth: ['user'],
    role: [3],
    routes: [
      {
        path: '/application/user',
        component: React.lazy(() => import('./user')),
      },
    ],
  },
  {
    auth: ['user'],
    role: [3],
    routes: [
      {
        path: '/application/review',
        component: React.lazy(() => import('./review')),
      },
    ],
  },
  {
    auth: ['user'],
    role: [3],
    routes: [
      {
        path: '/application/comodidades',
        component: React.lazy(() => import('./amenities')),
      },
    ],
  },
  {
    auth: ['user'],
    role: [3],
    routes: [
      {
        path: '/application/publicidad',
        component: React.lazy(() => import('./publicity')),
      },
    ],
  },
  {
    auth: ['user'],
    role: [3],
    routes: [
      {
        path: '/application/sliderHome',
        component: React.lazy(() => import('./sliderHome')),
      },
    ],
  },
  {
    auth: ['user'],
    role: [3],
    routes: [
      {
        path: '/application/blog',
        component: React.lazy(() => import('./blog')),
      },
    ],
  },
  {
    auth: ['user'],
    role: [3],
    routes: [
      {
        path: '/application/review',
        component: React.lazy(() => import('./review')),
      },
    ],
  },
  {
    auth: ['user'],
    role: [3],
    routes: [
      {
        path: '/application/calendarGymBranch',
        component: React.lazy(() => import('./calendarGymBranch')),
      },
    ],
  },
  // ...calendarConfigs, galleryGymBranch
];
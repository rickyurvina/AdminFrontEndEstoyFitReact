import {createMuiTheme} from '@material-ui/core/styles';

export const isBreakPointDown = key => {
  const defaultTheme = createMuiTheme();
  return defaultTheme.breakpoints.width(key) > window.innerWidth;
};

export const createRoutes = routeConfigs => {
  let allRoutes = [];
  routeConfigs.forEach(config => {
    allRoutes = [...allRoutes, ...setRoutes(config)];
  });
  return allRoutes;
};

export const setRoutes = config => {
  let routes = [...config.routes];
  console.log('CONFIG AUTH ',config.auth)
  if (config.auth) {
    routes = routes.map(route => {
      let auth = route.auth
        ? [...config.auth, ...route.auth]
        : [...config.auth];
      return {...route, auth};
    });
  }

  return [...routes];
};

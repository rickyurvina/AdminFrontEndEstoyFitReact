import React, {useContext, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {setInitialPath} from '../../redux/actions';
import {matchRoutes} from 'react-router-config';
import AppContext from './AppContext';
import {useAuthToken,useAuthUser} from './AppHooks';
import {Loader} from '../index';
import PropTypes from 'prop-types';
import {initialUrl} from '../../shared/constants/AppConst';

const AuthRoutes = ({children}) => {
  const {pathname} = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const {routes} = useContext(AppContext);
  
  const user = useAuthUser();
  const [token, loading] = useAuthToken();
  const initialPath = useSelector(({settings}) => settings.initialPath);
  const currentRoute = matchRoutes(routes, pathname)[0].route;

  useEffect(() => {
    function setInitPath() {
      if (
        initialPath === '/' &&
        [
          '/signin',
          '/signup',
          '/confirm-signup',
          '/reset-password',
          '/forget-password',
        ].indexOf(pathname) === -1
      ) {
        dispatch(setInitialPath(pathname));
      }

      console.log('INITIAL AND PATHNAMEssss --------',initialPath, pathname)
    }

    setInitPath();
  }, [dispatch, initialPath, loading, pathname, token]);

  useEffect(() => {
    if (!loading) {
      if (!token && currentRoute.auth && currentRoute.auth.length >= 1) { 
        console.log('CASE 111',token, currentRoute.auth, currentRoute.auth.length >= 1);
        history.push('/signin');
      } else if (
        (pathname === '/signin' ||
          pathname === '/signup' ||
          pathname === '/confirm-signup' ||
          pathname === '/reset-password' ||
          pathname === '/forget-password') &&
        token
      ) { 
        console.log('CASE 222',initialUrl,user);
        
        if (pathname === '/') {
          history.push(initialUrl);
        } else if (
          initialPath !== '/' ||
          initialPath !== '/signin' ||
          initialPath !== '/signup'
        ) {
          console.log('INITIALSSSSSS ')
          const userInitPath = setInitialPathUser(user.role_id);
          dispatch(setInitialPath(userInitPath));
          history.push(userInitPath);
          // history.push(initialPath);
        } else {
          console.log('INITIALSXXXX ')
          history.push(initialUrl);
        }
      }
    }
  }, [token, loading, pathname, initialPath, currentRoute.auth, history]);

  return loading ? <Loader /> : <>{children}</>;
};

const setInitialPathUser = (userRole) => {
  let initialPath = '/';
  switch (userRole) {
    case 1:
      initialPath = '/application/gimnasios';
      break;
    case 2:
      initialPath = '/application/sucursales';
      break;
    case 3:
      initialPath = '/application/sucursaladmin';
      break;
    default:
      initialPath = '/';
  }

  return initialPath;
}

export default AuthRoutes;

AuthRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};

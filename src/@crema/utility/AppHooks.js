import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {UPDATE_AUTH_USER,SET_TOKEN_SET} from '../../shared/constants/ActionTypes';

export const useAuthToken = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const authUser = useSelector(({auth}) => auth.user);
  const authToken = useSelector(({auth}) => auth.token);
  const localToken = JSON.parse(localStorage.getItem('auth-user'));
  useEffect(() => {
    const userAthCheck = () =>
      new Promise(resolve => {
        const user = JSON.parse(localStorage.getItem('auth-user'));
        
        dispatch({
          type: UPDATE_AUTH_USER,
          payload: user,
        });
        const auxToken = (authToken) ? authToken : localToken;
        // console.log(' TOKEN APP HOOKS ',auxToken)
        dispatch({
          type: SET_TOKEN_SET,
          payload: auxToken,
        });
        resolve();
        return Promise.resolve();
      });

    const checkAuth = () => {
      Promise.all([userAthCheck()]).then(() => {
        setLoading(false);
      });
    };
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (!authUser) {
      setToken(null);
    }
    if (authUser) { 
    const auxToken = (authToken) ? authToken : localToken;
    // console.log(' TOKEN 2 APP HOOKS ',auxToken)
      setToken(auxToken);
    }
  }, [authUser]);

  return [token, loading];
};

export const useAuthUser = () => {
  const authUser = useSelector(({auth}) => auth.user);
  if (authUser) {
    return authUser;
  }
  return {
    displayName: 'Loading',
  };
};

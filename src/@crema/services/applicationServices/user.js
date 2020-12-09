import {FETCH_ERROR} from '../../../shared/constants/ActionTypes';
import jwtAxios from '../../../@crema/services/auth/index';

const token = JSON.parse(localStorage.getItem('token'));

function setConfig() {
  jwtAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

export const getUsers = async () => {
  // console.log('GET User BRANCHS ',token);
  // jwtAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  setConfig();
  const resp = await jwtAxios
    .post('/user/getUsers', {})
    .then((data) => {
      console.log('DATA RESPONSEF ', data.data);
      if (data) {
       
        return data.data;
      } else {
        // console.log('ERROR => ',data)
        return 'error';
      }
    })
    .catch(function (error) {
      console.log('ERRORRR', error);
      return error;
    });

  return resp;
};

export const getPassesUsers = async (id) => {
  // console.log('GET User BRANCHS ',token);
  // jwtAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  
  setConfig();
  console.log("ID USUARIO", id)

  const resp = await jwtAxios
    .post('/user/getPassesUsers/'+id, {})
    .then((data) => {
      console.log('DATA RESPONSEF ', data.data);
      if (data) {
        return data.data;
      } else {
        // console.log('ERROR => ',data)
        return 'error';
      }
    })
    .catch(function (error) {
      console.log('ERRORRR', error);
      return error;
    });

  return resp;
};



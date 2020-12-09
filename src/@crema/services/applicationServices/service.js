import {FETCH_ERROR} from '../../../shared/constants/ActionTypes';
import jwtAxios from '../../../@crema/services/auth/index';

const token = JSON.parse(localStorage.getItem('token'));

function setConfig() {
  jwtAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

export const getServices = async () => {
  // console.log('GET Service BRANCHS ',token);
  // jwtAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  setConfig();
  const resp = await jwtAxios
    .post('/service/getServices', {})
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

export const saveService = async (object) => {
  setConfig();

  const {
    id,
    name,
    description,
  } = object;
  let objectToDb = new FormData();
  objectToDb.append('id', id);
  objectToDb.append('name', name);
  objectToDb.append('description', description);

  console.log('OBJECTTO DB', id, name, description);
  const resp = await jwtAxios
    .post('/service/saveService', objectToDb)
    .then((data) => {
      console.log('DATA RESPONS UPDATED XXXX ', data.data);
      if (data) {
        return data.data;
      } else {
        console.log('ERROR => ', data);
        return 'error';
      }
    })
    .catch(function (error) {
      console.log('ERRORRR', error);
      return error;
    });

  return resp;
};

export const deleteService = async (id) => {
  setConfig();
  let objectToDb = new FormData();
  objectToDb.append('id', id);
  const resp = await jwtAxios
    .post('/service/deleteService', objectToDb)
    .then((data) => {
      console.log('DATA RESPONS delete', data.data);
      if (data) {
        return data.data;
      } else {
        console.log('ERROR => ', data);
        return 'error';
      }
    })
    .catch(function (error) {
      console.log('ERRORRR', error);
      return error;
    });

  return resp;
};

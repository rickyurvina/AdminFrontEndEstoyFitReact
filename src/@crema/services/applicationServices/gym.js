import {FETCH_ERROR} from '../../../shared/constants/ActionTypes';
import jwtAxios from '../../../@crema/services/auth/index';

const token = JSON.parse(localStorage.getItem('token'));

function setConfig() {
  jwtAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

export const getGyms = async () => {
  setConfig();
  const resp = await jwtAxios
    .get('/gym/getGyms')
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

export const getGymData = async (id) => {
  setConfig();
  let objectToDb = new FormData();
  objectToDb.append('id', id);
  const resp = await jwtAxios
    .post('/gym/getGymData', objectToDb)
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

export const saveGymData = async (object) => {
  setConfig();
  const {
    id,
    active,
    commercialName,
    ruc,
    description,
    email,
    mobile,
    phone,
    imageUrl,
    typeBusiness,
  } = object;
  let objectToDb = new FormData();
  objectToDb.append('id', id);
  objectToDb.append('active', active);
  objectToDb.append('commercial_name', commercialName);
  objectToDb.append('ruc', ruc);
  objectToDb.append('email', email);
  objectToDb.append('description', description);
  objectToDb.append('phone', phone);
  objectToDb.append('mobile', mobile);
  objectToDb.append('main_image', imageUrl);
  objectToDb.append('type_business', typeBusiness);

  console.log('OBJECTTO DB', id);
  const resp = await jwtAxios
    .post('/gym/saveGymData', objectToDb)
    .then((data) => {
      console.log('DATA RESPONS UPDATED ', data.data);
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

export const saveGym = async (object) => {
  setConfig();

  const {
    id,
    commercialName,
    ruc,
    userEmail,
    userId,
    password,
    urlFile,
    resume,
    typeBusiness,
  } = object;
  let objectToDb = new FormData();
  objectToDb.append('id', id);
  objectToDb.append('commercial_name', commercialName);
  objectToDb.append('ruc', ruc);
  objectToDb.append('email', userEmail);
  objectToDb.append('user_id', userId);
  objectToDb.append('password', password);
  objectToDb.append('url_file', urlFile);
  objectToDb.append('resume', resume);
  objectToDb.append('type_business', typeBusiness);

  console.log('OBJECTTO DB', id, commercialName, ruc, userEmail, password);
  const resp = await jwtAxios
    .post('/gym/saveGym', objectToDb)
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

export const deleteGym = async (id) => {
  setConfig();
  let objectToDb = new FormData();
  objectToDb.append('id', id);
  const resp = await jwtAxios
    .post('/gym/deleteGym', objectToDb)
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

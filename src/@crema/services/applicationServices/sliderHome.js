import {FETCH_ERROR} from '../../../shared/constants/ActionTypes';
import jwtAxios from '../../../@crema/services/auth/index';

const token = JSON.parse(localStorage.getItem('token'));

function setConfig() {
  jwtAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

export const getSlidersHome = async () => {
  // console.log('GET amenity BRANCHS ',token);
  // jwtAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  setConfig();
  const resp = await jwtAxios
    .post('/slider/getSlidersHome', {})
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

export const saveSliderHome = async (object) => {
  setConfig();

  const {
    id,    
    title,
    subtitle,
    urlFile,
    bannerImageUrl,
  } = object;
  let objectToDb = new FormData();
  objectToDb.append('id', id);
  objectToDb.append('title', title);
  objectToDb.append('subtitle', subtitle);
  objectToDb.append('url', bannerImageUrl);

  console.log('OBJECTTO DB', id, title);
  const resp = await jwtAxios
    .post('/slider/saveSliderHome', objectToDb)
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

export const deleteSliderHome = async (id) => {
  setConfig();
  let objectToDb = new FormData();
  objectToDb.append('id', id);
  const resp = await jwtAxios
    .post('/slider/deleteSliderHome', objectToDb)
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

import {FETCH_ERROR} from '../../../shared/constants/ActionTypes';
import jwtAxios from '../../../@crema/services/auth/index';

const token = JSON.parse(localStorage.getItem('token'));

function setConfig() {
  jwtAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

export const getTypePasses = async () => {
  setConfig();
  const resp = await jwtAxios
    .post('/typePasse/getTypePasses', {})
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

export const saveTypePasse = async (object) => {
  setConfig();

  const {
    id,
    name,
    identifier,
    benefeats,
    infinite,
    quantitySessions,
    durationDays,
    flexibility,
    limitDaysActivate,
    onePerUser,
    onlyFirstFee,
    quantityFee,
    month,
  } = object;
  let objectToDb = new FormData();
  objectToDb.append('id', id);
  objectToDb.append('name', name);
  objectToDb.append('identifier', identifier);
  objectToDb.append('benefeats', benefeats);
  objectToDb.append('infinite', infinite);
  objectToDb.append('quantity_sessions', quantitySessions);
  objectToDb.append('duration_days', durationDays);
  objectToDb.append('flexibility', flexibility);
  objectToDb.append('limit_days_activate', limitDaysActivate);
  objectToDb.append('one_per_user', onePerUser);
  objectToDb.append('only_first_fee', onlyFirstFee);
  objectToDb.append('quantity_fee', quantityFee);
  objectToDb.append('month', month);
  console.log('OBJECTTO DB', id, name);
  const resp = await jwtAxios
    .post('/typePasse/saveTypePasse', objectToDb)
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

export const deleteTypePasse = async (id) => {
  setConfig();
  let objectToDb = new FormData();
  objectToDb.append('id', id);
  const resp = await jwtAxios
    .post('/typePasse/deleteTypePasse', objectToDb)
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

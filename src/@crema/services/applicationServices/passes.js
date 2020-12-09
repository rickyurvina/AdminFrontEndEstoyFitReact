import {FETCH_ERROR} from '../../../shared/constants/ActionTypes';
import jwtAxios from '../../../@crema/services/auth/index';

const token = JSON.parse(localStorage.getItem('token'));

function setConfig() {
  jwtAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

export const getPasses = async () => {
  setConfig();
  const resp = await jwtAxios
    .post('/passe/getPasses', {})
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

export const savePasse = async (object) => {
  setConfig();

  const {
    id,
    branchId,
    name,
    description,
    conditions,
    originalPrice,
    discount,
    typeDiscount,
    disc,
    trainNowPrice,
    daysForValidate,
    expirationDate,
    color,
    sort,
    nAvaible,
    validFrom,
    validTo,
    trainNowBlack,
    hotDeal,
    forTurist,
    type,
    category,
    comission,
    comissionFixPrice,
    active,
  } = object;


  let objectToDb = new FormData();
  objectToDb.append('id', id);
  objectToDb.append('branch_id', branchId);
  objectToDb.append('name', name);
  objectToDb.append('description', description);
  objectToDb.append('conditions', conditions);
  objectToDb.append('original_price', originalPrice);
  objectToDb.append('discount', discount);
  objectToDb.append('type_discount', typeDiscount);
  objectToDb.append('disc', disc);
  objectToDb.append('train_now_price', trainNowPrice);
  objectToDb.append('days_for_validate', daysForValidate);
  objectToDb.append('expiration_date', expirationDate);
  objectToDb.append('color', color);
  objectToDb.append('sort', sort);
  objectToDb.append('n_avaible', nAvaible);
  objectToDb.append('valid_from', validFrom);
  objectToDb.append('valid_to', validTo);
  objectToDb.append('train_now_black', trainNowBlack);
  objectToDb.append('hot_deal', hotDeal);
  objectToDb.append('for_turist', 0);
  objectToDb.append('type', type);
  objectToDb.append('category', category);
  objectToDb.append('commission', comission);
  objectToDb.append('commission_fix_price', comissionFixPrice);
  objectToDb.append('active', 1);

  console.log('OBJECTTO DB', object);
  const resp = await jwtAxios
    .post('/passe/savePasse', objectToDb)
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

export const deletePasse = async (id) => {
  setConfig();
  let objectToDb = new FormData();
  objectToDb.append('id', id);
  const resp = await jwtAxios
    .post('/passe/deletePasse', objectToDb)
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

export const activePasse = async (id, action) => {
  setConfig();
  var objectToDb = new FormData();
  objectToDb.append('id', id);
  objectToDb.append('action', action);
  const resp = await jwtAxios
    .post('/passe/activePasse', objectToDb)
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

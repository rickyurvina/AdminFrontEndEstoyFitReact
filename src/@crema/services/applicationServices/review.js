import {FETCH_ERROR} from '../../../shared/constants/ActionTypes';
import jwtAxios from '../../../@crema/services/auth/index';

const token = JSON.parse(localStorage.getItem('token'));

function setConfig() {
  jwtAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

export const getReviews = async () => {
  // console.log('GET Review BRANCHS ',token);
  // jwtAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  setConfig();
  // let objectToDb = new FormData();
  const resp = await jwtAxios
    .post('/front/getReviewsBranchs', {})
    .then((data) => {
      console.log('DATA RESPONSE REVIEW ', data.data);
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


export const deleteReview = async (id) => {
  setConfig();
  let objectToDb = new FormData();
  objectToDb.append('id', id);
  const resp = await jwtAxios
    .post('/front/deleteReviewsBranchs', objectToDb)
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

// export const activeReview = async (id, action) => {
//   setConfig();
//   var objectToDb = new FormData();
//   objectToDb.append('id', id);
//   objectToDb.append('action', action);
//   const resp = await jwtAxios
//     .post('/Review/activeReview', objectToDb)
//     .then((data) => {
//       console.log('DATA RESPONS delete', data.data);
//       if (data) {
//         return data.data;
//       } else {
//         console.log('ERROR => ', data);
//         return 'error';
//       }
//     })
//     .catch(function (error) {
//       console.log('ERRORRR', error);
//       return error;
//     });

//   return resp;
// };

export const activeReview = async (id, action) => {
  setConfig();
  var objectToDb = new FormData();
  objectToDb.append('id', id);
  objectToDb.append('action', action);
  console.log("datos apra activar review", objectToDb)
  const resp = await jwtAxios
  .post('/reviews/activeReview', objectToDb)
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
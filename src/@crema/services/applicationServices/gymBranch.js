// import {
//     FETCH_ERROR
//   } from '../../../shared/constants/ActionTypes';
import jwtAxios from '../../../@crema/services/auth/index';

const token = JSON.parse(localStorage.getItem('token'));

function setConfig() {
  jwtAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

export const getGymBranchs = async (gym_id) => { 
  setConfig();
  
  let objectToDb = new FormData();
  objectToDb.append('gym_id',gym_id);

  const resp = await jwtAxios
    .post('/gymBranch/getGymBranchs',objectToDb)
    .then((data) => {
      
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

export const getAllGymBranchs = async () => { 
  setConfig();
  
  let objectToDb = new FormData();
  const resp = await jwtAxios
    .post('/gymBranch/getAllGymBranchs',objectToDb)
    .then((data) => {
      
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

export const getBranchData = async (id) => {
  setConfig();
  let objectToDb = new FormData();
  objectToDb.append('id', id);
  const resp = await jwtAxios
    .post('/gymBranch/getGymBranchData', objectToDb)
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

export const saveBranchData = async (object) => {
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
    city,
    province,
    canton, 
    sector,
    mainStreet,
    intersection,
    numeration,
    reference,
    website,
    facebook,
    instagram,
    youtube,
    amenities,
    servicesSelected,
    parking,
    week,
    saturday,
    freeday,
    urlFile,
    bannerImageUrl,
    is_image,
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
  objectToDb.append('city', city);
  objectToDb.append('province', province);
  objectToDb.append('canton', canton);
  objectToDb.append('sector', sector);
  objectToDb.append('main_image', urlFile);
  objectToDb.append('banner_image', bannerImageUrl);
  objectToDb.append('is_image', is_image);
  objectToDb.append('amenities', amenities);
  objectToDb.append('services_selected', servicesSelected);
  objectToDb.append('parking', parking);
  objectToDb.append('main_street', mainStreet);
  objectToDb.append('intersection', intersection);
  objectToDb.append('numeration', numeration);
  objectToDb.append('reference', reference);
  objectToDb.append('website', website);
  objectToDb.append('facebook', facebook);
  objectToDb.append('instagram', instagram);
  objectToDb.append('youtube', youtube);
  objectToDb.append('week_from', week.start);
  objectToDb.append('week_to', week.end);
  objectToDb.append('week_from_afternoon', week.startAfternoon);
  objectToDb.append('week_to_afternoon', week.endAfternoon);
  objectToDb.append('saturday_from', saturday.start);
  objectToDb.append('saturday_to', saturday.end);
  objectToDb.append('saturday_from_afternoon', saturday.startAfternoon);
  objectToDb.append('saturday_to_afternoon', saturday.endAfternoon);
  objectToDb.append('freeday_from', freeday.start);
  objectToDb.append('freeday_to', freeday.end);
  objectToDb.append('freeday_from_afternoon', freeday.startAfternoon);
  objectToDb.append('freeday_to_afternoon', freeday.endAfternoon);

  console.log('OBJECTTO DB', mainStreet);
  const resp = await jwtAxios
    .post('/gymBranch/saveGymBranchData', objectToDb)
    .then((data) => {
      console.log('DATA RESPONS UPDATED ', data);
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

export const saveGymBranch = async (object) => {
  setConfig();

  const {
    id,
    commercialName,
    ruc,
    userEmail,
    userName,
    userId,
    password,
    urlFile,
    resume,
  } = object;
  var objectToDb = new FormData();
  objectToDb.append('id', id);
  objectToDb.append('commercial_name', commercialName);
  objectToDb.append('ruc', ruc);
  objectToDb.append('email', userEmail);
  objectToDb.append('name', userName);
  objectToDb.append('user_id', userId);
  objectToDb.append('password', password);
  objectToDb.append('url_file', urlFile);
  objectToDb.append('resume', resume);

  console.log('OBJECTTO DB', id, commercialName, ruc, userEmail, password);
  const resp = await jwtAxios
    .post('/gymBranch/saveGymBranch', objectToDb)
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

export const deleteGymBranch = async (id) => {
  setConfig();
  var objectToDb = new FormData();
  objectToDb.append('id', id);
  const resp = await jwtAxios
    .post('/gymBranch/deleteGymBranch', objectToDb)
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

export const getGalleryGymBranch = async (branch_id) => {
  setConfig();
  var objectToDb = new FormData();
  objectToDb.append('id', branch_id);
  const resp = await jwtAxios
    .post('/gymBranch/getGalleryGymBranch', objectToDb)
    .then((data) => {
      console.log('DATA RESPONSEF XXXX ', data.data);
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

export const saveGalleryGymBranch = async (object) => {
  setConfig();

  const {branch_id, imagesDb} = object;
  var objectToDb = new FormData();
  objectToDb.append('id', branch_id);
  objectToDb.append('arr_objects', JSON.stringify(imagesDb));

  console.log('OBJECTTO DB', branch_id, imagesDb);
  const resp = await jwtAxios
    .post('/gymBranch/updateGalleryGymBranch', objectToDb)
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

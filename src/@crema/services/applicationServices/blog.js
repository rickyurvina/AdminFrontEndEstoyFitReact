import {FETCH_ERROR} from '../../../shared/constants/ActionTypes';
import jwtAxios from '../../../@crema/services/auth/index';

const token = JSON.parse(localStorage.getItem('token'));

function setConfig() {
  jwtAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

export const getBlogs = async () => {
  // console.log('GET Blog BRANCHS ',token);
  // jwtAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  setConfig();
  // let objectToDb = new FormData();
  const resp = await jwtAxios
    .post('/blog/getBlogs', {})
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

export const saveBlog = async (object) => {
  setConfig();

  const {
    id,
    title,
    description_blog,
    content,
    category,
    is_active,
    urlFile,
    tagsSelected
  } = object;
  let objectToDb = new FormData();
  objectToDb.append('id', id);
  objectToDb.append('title', title);
  objectToDb.append('description_blog', description_blog);
  objectToDb.append('content', content);
  objectToDb.append('category', category);
  objectToDb.append('is_active', is_active);
  objectToDb.append('url_file', urlFile);
  objectToDb.append('tags_selected', tagsSelected);

  console.log('OBJECTTO DB', id, title, description_blog, 
  content, category, is_active, tagsSelected);
  const resp = await jwtAxios
    .post('/blog/saveBlog', objectToDb)
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

export const deleteBlog = async (id) => {
  setConfig();
  let objectToDb = new FormData();
  objectToDb.append('id', id);
  const resp = await jwtAxios
    .post('/blog/deleteBlog', objectToDb)
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

export const activeBlog = async (id, action) => {
  setConfig();
  var objectToDb = new FormData();
  objectToDb.append('id', id);
  objectToDb.append('action', action);
  const resp = await jwtAxios
    .post('/blog/activeBlog', objectToDb)
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
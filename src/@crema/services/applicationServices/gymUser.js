import {
    FETCH_ERROR
  } from '../../../shared/constants/ActionTypes';
import jwtAxios from '../../../@crema/services/auth/index';

const token = JSON.parse(localStorage.getItem('token'));

function setConfig() {
    jwtAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}
    
export const getGymUsers = async () => { 
    setConfig();
    const resp = await jwtAxios.get('/gymUser/getGymUsers')
            .then((data) => {
                console.log('DATA RESPONSe USERS ',data.data);
                if (data){
                    return data.data;
                } else {
                    // console.log('ERROR => ',data)
                    return 'error';
                }
            })
            .catch(function(error) {
                console.log('ERRORRR',error )
                return error;
            });

    return resp;
  };

export const saveGymUser = async (object) => { 
    setConfig();

    const {id, typeUser,  branchId, name, email, password} = object;
    var objectToDb = new FormData();
    objectToDb.append("id", id);
    objectToDb.append("name", name); 
    objectToDb.append("email", email);
    objectToDb.append("password", password);
    objectToDb.append("branch_id", branchId);
    objectToDb.append("role_id", typeUser);

    console.log('OBJECTTO DB',id, name, email, password)
    const resp = await jwtAxios.post('/gymUser/saveGymUser', objectToDb)
            .then((data) => {
                console.log('DATA RESPONS UPDATED XXXX ',data.data);
                if (data){
                    return data.data;
                } else {
                    console.log('ERROR => ',data)
                    return 'error';
                }
            })
            .catch(function(error) {
                console.log('ERRORRR',error )
                return error;
            });

    return resp;
};

export const deleteGymUser = async (id) => { 
    setConfig();
    var objectToDb = new FormData();
    objectToDb.append("id", id);
    const resp = await jwtAxios.post('/gymUser/deleteGymUser', objectToDb)
            .then((data) => {
                console.log('DATA RESPONS delete',data.data);
                if (data){
                    return data.data;
                } else {
                    console.log('ERROR => ',data)
                    return 'error';
                }
            })
            .catch(function(error) {
                console.log('ERRORRR',error )
                return error;
            });

    return resp;
};
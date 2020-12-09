import { FETCH_ERROR } from '../../../shared/constants/ActionTypes';
import jwtAxios from '../../../@crema/services/auth/index';

const token = JSON.parse(localStorage.getItem('token'));

function setConfig() {
    jwtAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

export const getCalendarActivities = async () => {
    setConfig();
    let objectToDb = new FormData();

    objectToDb.append('page', 1);
    objectToDb.append('limit', 10);

    const resp = await jwtAxios
        .post('/calendarActivity/getCalendarActivities', objectToDb)
        .then((data) => {
            console.log('DATA RESPONSEF ', data.data);
            if (data) {
                return data.data;
            } else {
                return 'error';
            }
        })
        .catch(function (error) {
            console.log('ERRORRR', error);
            return error;
        });

    return resp;
};

export const getCalendarActivitiesByBranch = async (branchId) => {
    setConfig();
    let objectToDb = new FormData();

    objectToDb.append('page', 1);
    objectToDb.append('limit', 10);
    objectToDb.append('branch_id', branchId);
    const resp = await jwtAxios
        .post('/calendarActivity/getCalendarActivitiesByBranch', objectToDb)
        .then((data) => {
            console.log('DATA RESPONSEF ', data.data);
            if (data) {
                return data.data;
            } else {
                return 'error';
            }
        })
        .catch(function (error) {
            console.log('ERRORRR', error);
            return error;
        });

    return resp;
};

export const saveCalendarActivity = async (dataToDb) => {
    setConfig();
    
    const {
        create,
        branchId,
        sId,
        dataB,
        title,
        description,
        startLesson,
        endLesson
    } = dataToDb;

    let { id = null, start = null, end = null } = dataB;
    
    console.log('DATA TO DB => ',sId )

    let objectToDb = new FormData();
    objectToDb.append('id', id);
    objectToDb.append('branch_id', branchId);
    objectToDb.append('service_id', sId);
    objectToDb.append('title', title);
    objectToDb.append('description', description);
    objectToDb.append('start', start);
    objectToDb.append('end', end);
    objectToDb.append('start_lesson', startLesson);
    objectToDb.append('end_lesson', endLesson);

    // console.log('OBJECTTO DB', id, name, description);
    const resp = await jwtAxios
        .post('/calendarActivity/saveCalendarActivity', objectToDb)
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
    // return 0;
};

export const deleteCalendarActivity = async (id) => {
    setConfig();
    let objectToDb = new FormData();
    objectToDb.append('id', id);
    const resp = await jwtAxios
        .post('/calendarActivity/deleteCalendarActivity', objectToDb)
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

export const setShowCalendarActivity = async (id, show) => {
    setConfig();
    let objectToDb = new FormData();
    objectToDb.append('id', id);
    objectToDb.append('show_value', show);
    const resp = await jwtAxios
        .post('/calendarActivity/setShowCalendarActivity', objectToDb)
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
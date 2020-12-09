import {
    FETCH_ERROR
  } from '../../shared/constants/ActionTypes';
  import jwtAxios from '../../@crema/services/auth/index';

export const getGymBranchs = ({email, password}) => {
    return (dispatch) => {
        jwtAxios
            .get('/gymBranch/getGymBranchs')
            .then(({data}) => {
                console.log('DATA RESPONSE ',data);
                if (data) {
                    // dispatch({type: FETCH_SUCCESS});
                } else {
                    dispatch({type: FETCH_ERROR, payload: data.error});
                }
            })
            .catch(function(error) {
                dispatch({type: FETCH_ERROR, payload: error.message});
            });
    };
};
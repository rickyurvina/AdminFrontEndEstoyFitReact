import {
  SIGNOUT_USER_SUCCESS,
  UPDATE_AUTH_USER,
  SET_TOKEN_SET
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  user: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_AUTH_USER: {
      return {
        ...state,
        user: action.payload,
      };
    }
    case SIGNOUT_USER_SUCCESS: {
      return {
        ...state,
        user: null,
      };
    }

    case SET_TOKEN_SET: {
      console.log('IN REDUCER SERT TOKEN ',action.payload)
      return {
        ...state,
        token: action.payload,
      };
    }
    
    default:
      return state;
  }
};

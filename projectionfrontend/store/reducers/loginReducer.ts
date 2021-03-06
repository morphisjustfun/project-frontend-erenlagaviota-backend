import { loginAction } from "../actions/loginAction";
import { loginType, LoginState } from "../action-types/loginType";

const initialState: LoginState = {
  authenticated: {
    authenticated: false,
    waiting: true,
  },
  loading: false,
  currentUser: 0,
  imageUrl: "",
};

const loginReducer = (state: LoginState, action: loginAction) => {
  if (state == undefined) {
    state = initialState;
  }
  switch (action.type) {
    case loginType.TOGGLE_LOADING:
      return { ...state, loading: action.loading };
    case loginType.LOG_OUT:
      return {
        ...state,
        authenticated: false,
        currentUser: null,
        imageUrl: false,
      };
    case loginType.LOG_IN:
      return {
        ...state,
        currentUser: action.currentUser,
        authenticated: action.authenticated,
        imageUrl: action.imageUrl,
      };
    case loginType.GET_IMAGEURL:
      return { ...state, imageUrl: action.imageUrl };
    default:
      return state;
  }
};

export default loginReducer;

import { Dispatch } from "redux";
import { ACCESS_TOKEN } from "../../business/constants";
import { getCurrentUser } from "../../business/request/loginAPI";
import { loginType } from "../action-types/loginType";
import { loginAction } from "../actions/loginAction";

export const toggleLoading = (loadingValue: boolean) => {
  return (dispatch: Dispatch<loginAction>) => {
    dispatch({
      type: loginType.TOGGLE_LOADING,
      loadingValue: loadingValue,
    });
  };
};

export const logOut = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  return (dispatch: Dispatch<loginAction>) => {
    dispatch({
      type: loginType.LOG_OUT,
    });
  };
};

export const logIn = () => {
  getCurrentUser().then((response) => {
    return (dispatch: Dispatch<loginAction>) => {
        console.log("asdd");
      dispatch({
        type: loginType.LOG_IN,
        currentUser: response,
        authenticated: true,
      });
    };
  });
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: "",
    });
  };
};

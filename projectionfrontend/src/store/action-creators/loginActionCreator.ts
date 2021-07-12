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
  return (dispatch: Dispatch<loginAction>) => {
    getCurrentUser().then(async (response) => {
      if (response.ok) {
          const json = await response.json();
        dispatch({
          type: loginType.LOG_IN,
          authenticated: true,
          currentUser: response,
          imageUrl: json.imageUrl,
        });
      }
    });
  };
};

export const getImageUrl = (imageUrl: string) => {
  return (dispatch: Dispatch<loginAction>) => {
    dispatch({
      type: loginType.GET_IMAGEURL,
      imageUrl: imageUrl,
    });
  };
};

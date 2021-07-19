import { loginType } from "../action-types/loginType";

interface ToggleLoading {
  type: loginType.TOGGLE_LOADING;
  loading: boolean;
}

interface LogOut {
  type: loginType.LOG_OUT;
}

interface LogIn {
  type: loginType.LOG_IN;
  currentUser: any;
  authenticated: {
    authenticated: boolean;
    waiting: boolean;
  };
  imageUrl: string;
}

interface GetImageUrl {
  type: loginType.GET_IMAGEURL;
  imageUrl: string;
}

export type loginAction = ToggleLoading | LogOut | LogIn | GetImageUrl;

import { loginType } from "../action-types/loginType";

interface toggle_loading {
  type: loginType.TOGGLE_LOADING;
  loading: boolean;
}

interface log_out {
  type: loginType.LOG_OUT;
}

interface log_in {
  type: loginType.LOG_IN;
  currentUser: any;
  authenticated: {
    authenticated: boolean;
    waiting: boolean;
  };
  imageUrl: string;
}

interface get_imageUrl {
  type: loginType.GET_IMAGEURL;
  imageUrl: string;
}

export type loginAction = toggle_loading | log_out | log_in | get_imageUrl;
import { loginType } from "../action-types/loginType";

interface toggle_loading {
  type: loginType.TOGGLE_LOADING;
  loadingValue: boolean;
}

interface log_out {
  type: loginType.LOG_OUT;
}

interface log_in {
  type: loginType.LOG_IN;
  currentUser: any;
  authenticated: boolean;
}

export type loginAction = toggle_loading | log_out | log_in;

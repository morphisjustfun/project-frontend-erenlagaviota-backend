export enum loginType {
    TOGGLE_LOADING = "toggle_logged",
    LOG_OUT = "log_out",
    LOG_IN = "log_in",
    GET_IMAGEURL = "get_imageurl"
}

export interface LoginState {
    authenticated: {
        authenticated: boolean;
        waiting: boolean;
    },
    currentUser: any,
    loading: boolean,
    imageUrl: string
}

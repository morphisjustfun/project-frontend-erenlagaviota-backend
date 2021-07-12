export enum loginType {
    TOGGLE_LOADING = "toggle_logged",
    LOG_OUT = "log_out",
    LOG_IN = "log_in",
    GET_IMAGEURL = "get_imageurl"
}

export interface loginState {
    authenticated: boolean,
    currentUser: any,
    loading: false,
    imageUrl: string
}

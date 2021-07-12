import { loginAction } from "../actions/loginAction";
import { loginType, loginState } from "../action-types/loginType";

const initialState : loginState = {
    authenticated: false,
    loading: false,
    currentUser: 0,
    imageUrl: ''
}

const reducer = (state = initialState, action: loginAction) => {
    switch (action.type){
        case loginType.TOGGLE_LOADING:
            return {...state, loading: action.loadingValue}
        case loginType.LOG_OUT:
            return {...state, authenticated:false, currentUser: null, imageUrl: false}
        case loginType.LOG_IN: 
            return {...state, currentUser:action.currentUser, authenticated:true, imageUrl: action.imageUrl}
        case loginType.GET_IMAGEURL:
            return {...state, imageUrl: action.imageUrl}
        default:
            return state
    }
}


export default reducer;

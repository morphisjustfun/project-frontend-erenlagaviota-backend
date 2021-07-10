import { loginAction } from "../actions/loginAction";
import { loginType, loginState } from "../action-types/loginType";

const initialState : loginState = {
    authenticated: false,
    loading: false,
    currentUser: 0
}

const reducer = (state = initialState, action: loginAction) => {
    console.log(state);
    switch (action.type){
        case loginType.TOGGLE_LOADING:
            console.log("asdd");
            return {...state, loading: action.loadingValue}
        case loginType.LOG_OUT:
            return {...state, authenticated:false, currentUser: null}
        case loginType.LOG_IN: 
            return {...state, currentUser:action.currentUser, authenticated:true}
        default:
            return state
    }
}


export default reducer;

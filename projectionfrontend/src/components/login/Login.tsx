import React, { RefObject, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState } from "../../store/reducers";
import { loginActionCreators } from "../../store";
import { loginState } from "../../store/action-types/loginType";
import { GOOGLE_AUTH_URL } from "../../business/constants";
import {getNumericalPrediction} from "../../business/request/dataApi";

const Login = (): JSX.Element => {
  const state = useSelector((state: RootState) => state.login) as loginState;
  const dispatch = useDispatch();

  const cursoPicked : RefObject<HTMLInputElement> = useRef(null);

  const { logIn } = bindActionCreators(
    loginActionCreators,
    dispatch
  );

  // const handleLogOut = useCallback(() => {
  //   logOut();
  //   alert("You're logged out");
  // }, [logOut]);

   useEffect(() => {
     logIn();
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

  return (
    <div>
      <h1> Authenticated: {state.authenticated.toString()} </h1>
      <button onClick={() => {
        logIn();
      }}> Actualizar </button>
      <a href={GOOGLE_AUTH_URL}> Log in </a>
      <input ref={cursoPicked}/>
      <button onClick={async () => {
      const respuesta = await getNumericalPrediction(cursoPicked.current!.value);
      console.log(respuesta);
      }}>Calcular</button>
    </div>
  );
};

export default Login;

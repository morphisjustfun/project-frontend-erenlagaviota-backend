import React, { RefObject, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState } from "../../store/reducers";
import { loginActionCreators } from "../../store";
import { loginState } from "../../store/action-types/loginType";
import { GOOGLE_AUTH_URL } from "../../business/constants";
import { getNumericalPrediction } from "../../business/request/dataApi";
import GoogleButton from 'react-google-button'

const Login = (): JSX.Element => {
  const state = useSelector((state: RootState) => state.login) as loginState;
  const dispatch = useDispatch();

  const cursoPicked: RefObject<HTMLInputElement> = useRef(null);

  const { logIn } = bindActionCreators(loginActionCreators, dispatch);

  const [cursoResult, setCursoResult] = useState("");

  // const handleLogOut = useCallback(() => {
  //   logOut();
  //   alert("You're logged out");
  // }, [logOut]);

  useEffect(() => {
    logIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="parent">
      <h1> Authenticated: {state.authenticated.toString()} </h1>
      <img src={state.imageUrl} alt="Not logged"/>
      <button
        onClick={() => {
          logIn();
        }}
      >
        Actualizar
      </button>

      <GoogleButton onClick={() => {
        window.location.href = GOOGLE_AUTH_URL;
      }}/>
      <br />
      <input ref={cursoPicked} />
      <button
        onClick={async () => {
          const respuesta = await getNumericalPrediction(
            cursoPicked.current!.value
          );
          setCursoResult(respuesta.numericalProjection.toString());
        }}
      >
        Calcular
      </button>
      {state.loading ? <div><br /> <label>Cargando...</label> </div> : null}
      {cursoResult !== "" ? <div><br/><label> {cursoResult} </label> </div> : null}
    </div>
  );
};

export default Login;

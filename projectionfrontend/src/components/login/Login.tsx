import React, { RefObject, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState } from "../../store/reducers";
import { loginActionCreators } from "../../store";
import { loginState } from "../../store/action-types/loginType";
import { GOOGLE_AUTH_URL } from "../../business/constants";
import { getNumericalPrediction } from "../../business/request/dataApi";
import GoogleButton from "react-google-button";
import styled from "styled-components";
import "../../style.css";

const NavBar = styled.div`
  display: grid;
  grid-template-columns: 0.1fr 1fr 0.1fr;
`;

const InputBar = styled.div`
`;

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
    document.documentElement.style.backgroundColor = "F1F1F1";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-2">
      <NavBar>
      <div>
      </div>
        <h1 className="title is-1 has-text-centered mt-2"> Demo projection </h1>
        {state.imageUrl !== "" ? (
          <figure className="image is-64x64">
            <img className="is-rounded" src={state.imageUrl} alt="Not found" />
          </figure>
        ) : null}
      </NavBar>
      <div className="ml-4 mr-4">
        {
          //<h1 className="title is-1 has-text-centered"> Authenticated: {state.authenticated.toString()} </h1>
        }
        {state.authenticated ? null : (
          <GoogleButton
            onClick={() => {
              window.location.href = GOOGLE_AUTH_URL;
            }}
          />
        )}
        {state.authenticated ? (
          <div className="columns is-vcentered is-centered">
            <div className="column is-half">
              <InputBar>
                <input
                  className="input"
                  type="text"
                  placeholder="Curso"
                  ref={cursoPicked}
                />
                <button
                  className={`button mt-5 ${state.loading ? "is-loading" : ""}`}
                  onClick={async () => {
                    const respuesta = await getNumericalPrediction(
                      cursoPicked.current!.value
                    );
                    setCursoResult(respuesta.numericalProjection.toString());
                  }}
                >
                  Calcular
                </button>
              </InputBar>
            </div>
          </div>
        ) : null}
        {cursoResult !== "" ? (
          <h1 className="title is-1 has-text-centered">
          {cursoResult}
          </h1>
        ) : null}
      </div>
    </div>
  );
};

export default Login;

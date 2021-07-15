import React, { useEffect } from "react";
import GoogleButton from "react-google-button";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { bindActionCreators } from "redux";
import { GOOGLE_AUTH_URL } from "../business/constants";
import { loginActionCreators } from "../store";
import { loginState } from "../store/action-types/loginType";
import { RootState } from "../store/reducers";
import backgroundLogin from "../styles/background.svg";
import {
  LoginBackgroundImg,
  LoginContent,
  LoginGridDiv,
  LoginTitleP,
  LogoContainerDiv,
  LogoImg,
} from "../styles/Login";

const Login = (): JSX.Element => {
  const state = useSelector((state: RootState) => state.login) as loginState;
  const dispatch = useDispatch();

  const { logIn } = bindActionCreators(loginActionCreators, dispatch);

  const logoURL =
    "https://iconape.com/wp-content/files/aa/192835/png/192835.png";

  useEffect(() => {
    logIn(); 
    document.documentElement.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.boxSizing = "border-box";
    document.body.style.fontFamily = "'Poppins', sans-serif";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state.authenticated.authenticated) {
    return (
      <Redirect
        to={{
          pathname: "/projection"
        }}
      />
    );
  } else {
    return (
      <div>
        <LoginBackgroundImg src={backgroundLogin} alt="Not found" />
        <LoginGridDiv>
          <LogoContainerDiv>
            <LogoImg src={logoURL} alt="Not found" />
          </LogoContainerDiv>
          <LoginContent>
            <div>
              <LoginTitleP className="title mb-6">Bienvenido</LoginTitleP>
              <p className="subtitle is-4">Sistema de proyección de cursos</p>
              <GoogleButton
                type="light"
                style={{ marginLeft: "auto", marginRight: "auto" }}
                onClick={() => {
                  window.location.href = GOOGLE_AUTH_URL;
                }}
              />
            </div>
          </LoginContent>
        </LoginGridDiv>
      </div>
    );
  }
};

export default Login;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import Redirect from "../components/Redirect";
import { loginActionCreators } from "../store";
import { LoginState } from "../store/action-types/loginType";
import { RootState } from "../store/reducers";
import {
  LoginBackgroundImg,
  LoginGridDiv,
  LogoContainerDiv,
  LogoImg,
  LoginContent,
  LoginTitleP,
} from "../styles/components/Login";
import GoogleButton from "react-google-button";
import {GOOGLE_AUTH_URL} from "../businesses/constants";

const Login = () => {
  const state = useSelector((stateLog: RootState) => stateLog.login) as LoginState;
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
    return <Redirect to="/projection" />;
  } else {
    return (
      <div>
        <LoginBackgroundImg src="/background.svg" alt="Not found" />
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

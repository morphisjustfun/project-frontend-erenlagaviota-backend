import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState } from "../../store/reducers";
import { loginActionCreators } from "../../store";
import { useCallback } from "react";
import { loginState } from "../../store/action-types/loginType";
import {GOOGLE_AUTH_URL} from "../../business/constants";

const Login = (): JSX.Element => {
  const state = useSelector((state: RootState) => state.login) as loginState;
  const dispatch = useDispatch();

  const { logIn, logOut, toggleLoading } = bindActionCreators(
    loginActionCreators,
    dispatch
  );

  const loadCurrentlyLoggedInUser = useCallback(() => {
    logIn();
  }, [logIn, toggleLoading]);

  const handleLogOut = useCallback(() => {
    logOut();
    alert("You're logged out");
  }, [logOut]);

  useEffect(() => {
    loadCurrentlyLoggedInUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1> Ahthenticated: {state.authenticated.toString()} </h1>
      <a href={GOOGLE_AUTH_URL}> Log in </a>
    </div>
  );
};

export default Login;

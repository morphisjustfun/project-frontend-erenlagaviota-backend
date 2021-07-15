import { Redirect, RouteComponentProps } from "react-router";
import { ACCESS_TOKEN } from "../business/constants";
import React from "react";

const redirectAndLogin = (token: string): JSX.Element => {
  localStorage.setItem(ACCESS_TOKEN, token);
  return (
    <Redirect
      to={{
        pathname: "/",
      }}
    />
  );
};

const OAuth2RedirectHandler = (props: RouteComponentProps) : JSX.Element => {
  const getUrlParameter = (name: string) => {
    name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");

    const results = regex.exec(props.location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  const token = getUrlParameter("token");
  const error = getUrlParameter("error");

  if (token) {
    return redirectAndLogin(token);
  } else {
    alert("Usuario no válido");
    return <Redirect to={{ pathname: "/" }}></Redirect>;
  }
};

export default OAuth2RedirectHandler;

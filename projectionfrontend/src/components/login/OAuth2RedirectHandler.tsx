import { Redirect, RouteComponentProps } from "react-router";
import { ACCESS_TOKEN } from "../../business/constants";
import React from "react";

const OAuth2RedirectHandler = (props: RouteComponentProps) => {
  const getUrlParameter = (name: string) => {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");

    const results = regex.exec(props.location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  const token = getUrlParameter("token");
  const error = getUrlParameter("error");

  console.log(token);
  console.log(error);

  if (token) {
    localStorage.setItem(ACCESS_TOKEN, token);
    return (
      <Redirect
        to={{
          pathname: "/",
          state: { from: props.location },
        }}
      />
    );
  } else {
    return <Redirect to={{ pathname: "/" }}></Redirect>;
  }
};

export default OAuth2RedirectHandler;

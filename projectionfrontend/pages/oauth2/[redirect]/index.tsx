import { ACCESS_TOKEN } from "../../../businesses/constants";
import React from "react";
import Redirect from "../../../components/Redirect";
import { useRouter } from "next/dist/client/router";

const redirectAndLogin = (token: string): JSX.Element => {
  localStorage.setItem(ACCESS_TOKEN, token);
  return <Redirect to="/" />;
};

const OAuth2RedirectHandler = (): JSX.Element => {
  const router = useRouter();
  const token = router.query.token as string;
  const error = router.query.error as string;

  if (token) {
    return redirectAndLogin(token);
  } else {
    console.log("usuario no definido");
    return <Redirect to="/" />;
  }
};

export default OAuth2RedirectHandler;

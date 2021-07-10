import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./components/login/Login";
import OAuth2RedirectHandler from "./components/login/OAuth2RedirectHandler";

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login}>
        </Route>
        <Route path="/oauth2/redirect" component={OAuth2RedirectHandler}>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Router;

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/login/Login";
import OAuth2RedirectHandler from "./components/login/OAuth2RedirectHandler";

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route exact path="/" component={Login}></Route>
        <Route
          path="/oauth2/redirect"
          component={OAuth2RedirectHandler}
        ></Route>
      </Switch>
    </Router>
  );
}

export default App;

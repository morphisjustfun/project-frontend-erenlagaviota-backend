import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Projection from "./components/Projection";
import OAuth2RedirectHandler from "./components/OAuth2RedirectHandler";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login}></Route>
        <Route path="/projection" component={Projection}></Route>
        <Route
          path="/oauth2/redirect"
          component={OAuth2RedirectHandler}
        ></Route>
      </Switch>
    </Router>
  );
}

export default App;

import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Link, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/loginComponents/Login";
import Register from "./components/loginComponents/Register";
import Income_Setup from "./components/accountCreation/Income-Setup";
import Bill_Setup from "./components/accountCreation/Bill-Setup";
import Category_Setup from "./components/accountCreation/Category-Setup";

export default class App extends Component {
  render() {
    return (
      <Router>
        <ul>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/income-setup">Setup</Link>
        </ul>

        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/income-setup" component={Income_Setup} />
          <Route path="/bill-setup" component={Bill_Setup} />
          <Route path="/category-setup" component={Category_Setup} />
        </Switch>
      </Router>
    );
  }
}

import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import './css/styles.css';
import OnboardSignUp from './onboard/OnboardSignUp';
import OnboardSignIn from './onboard/OnboardSignIn';
import OnboardSMTP from './onboard/OnboardSMTP';
import OnboardStorage from './onboard/OnboardStorage';
import Home from './Home';
import Header from './Header';

var apiRoutes = {
  signIn: '/signin',
  signUp: '/signup',
  smtp: '/smtp',
  testEmail: '/test-email',
  nextcloud: '/nextcloud',
  uploadBooks: '/upload-books'
}

class App extends Component {
  render() {
    return (
      <div className="app">
        <div id="loader"><i></i></div>
        <Header uploadBooksAPI={apiRoutes.uploadBooks} />
        <div className="alert" id="alert"><i></i></div>
        <Switch>
          <Route
            path="/signup"
            render={(props) => <OnboardSignUp {...props} signUpAPI={apiRoutes.signUp} />}
          />
          <Route
            path="/smtp"
            render={(props) => <OnboardSMTP {...props} smtpAPI={apiRoutes.smtp} testEmailAPI={apiRoutes.testEmail} />}
          />
          <Route
            path="/storage"
            render={(props) => <OnboardStorage {...props} nextcloudAPI={apiRoutes.nextcloud} />}
          />
          <Route
            path="/signin"
            render={(props) => <OnboardSignIn {...props} signInAPI={apiRoutes.signIn} />}
          />
          <Route exact path='/' component={Home} />
        </Switch>
      </div>
    );
  }
}

export default App;
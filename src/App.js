import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import './css/styles.css';
import OnboardDatabase from './onboard/OnboardDatabase';
import OnboardSignUp from './onboard/OnboardSignUp';
import OnboardSignIn from './onboard/OnboardSignIn';
import OnboardSMTP from './onboard/OnboardSMTP';
import OnboardNextcloud from './onboard/OnboardNextcloud';
import Home from './Home';
import Header from './Header';

var apiRoutes = {
  signIn: 'http://localhost:8080/signin',
  signUp: 'http://localhost:8080/signup',
  database: 'http://localhost:8080/database',
  smtp: 'http://localhost:8080/smtp',
  testEmail: 'http://localhost:8080/test-email',
  nextcloud: 'http://localhost:8080/nextcloud',
  uploadBooks: 'http://localhost:8080/upload-books'
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
            path="/database"
            render={(props) => <OnboardDatabase {...props} databaseAPI={apiRoutes.database} />}
          />
          <Route
            path="/signup"
            render={(props) => <OnboardSignUp {...props} signUpAPI={apiRoutes.signUp} />}
          />
          <Route
            path="/smtp"
            render={(props) => <OnboardSMTP {...props} smtpAPI={apiRoutes.smtp} testEmailAPI={apiRoutes.testEmail} />}
          />
          <Route
            path="/nextcloud"
            render={(props) => <OnboardNextcloud {...props} nextcloudAPI={apiRoutes.nextcloud} />}
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
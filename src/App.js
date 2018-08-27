import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import './css/styles.css';
import Onboard from './onboard/Onboard';
import OnboardSignUp from './onboard/OnboardSignUp';
import OnboardSignIn from './onboard/OnboardSignIn';
import OnboardSMTP from './onboard/OnboardSMTP';
import OnboardStorage from './onboard/OnboardStorage';
import Home from './Home';
import Header from './Header';

const SessionStatus = Object.freeze({
  active: 'active',
  none: 'none',
  noAdmin: 'noAdmin',
})

class App extends Component {

  constructor() {
    super();
    this.state = {
      // this should be rendered by the server
      sessionStatus: SessionStatus.noAdmin 
    }
  }

  render() {
    return (
      <div className="app">
        <div id="loader"><i></i></div>
        <Header uploadBooksAPI="/upload-books" />
        <div className="alert" id="alert"><i></i></div>
        { this.state.sessionStatus === SessionStatus.noAdmin 
          ?  <Onboard /> : <Home /> 
        }
      </div>
    );
  }
}

export default App;

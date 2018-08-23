import React, { Component } from 'react';
import { Subscribe } from 'unstated';
import OnboardRoute from './onboard/OnboardRoute';
import CurrentlyReading from './CurrentlyReading';
import SignInContainer from './containers/SignInContainer';

class Home extends Component {
  render() {
    return (
      <Subscribe to={[SignInContainer]}>
        {signInStore => (
          signInStore.state.isSignedIn
          ? 
            <CurrentlyReading />
          :
            <OnboardRoute />
        )}
      </Subscribe>
    );
  }
}

export default Home;
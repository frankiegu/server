import React from 'react';
import { Subscribe } from 'unstated';
import { Redirect } from "react-router-dom";
import SignInContainer from '../containers/SignInContainer';
import SignUpContainer from '../containers/SignUpContainer';
import OnboardRoute from './OnboardRoute';

function OnboardSignUp(props) {
  return (
    <Subscribe to={[SignInContainer, SignUpContainer]}>
      {(signInStore, signUpStore) => (
        signInStore.state.isSignedIn
        ?
          <Redirect to="/" />
        :
          signUpStore.state.isSignUpStored
          ?
            <OnboardRoute />
          :
            <form className="onboard">
              <label className="onboard__label">Create an admin account</label>
              <input type="text" id="signUpUsername" placeholder="Username (johnwell)*" onChange={(event) => signUpStore.handleUsernameChange(event)} />
              <div className="onboard__error" id="signUpUsernameError">This field is required</div>
              <input type="email" id="signUpEmail" placeholder="Email address (info@example.com)*" onChange={(event) => signUpStore.handleEmailChange(event)} />
              <div className="onboard__error" id="signUpEmailError">This field is required</div>
              <input type="password" id="signUpPassword" placeholder="Password*" onChange={(event) => signUpStore.handlePasswordChange(event)} />
              <div className="onboard__error" id="signUpPasswordError">This field is required</div>
              <input type="submit" className="button button--primary onboard__submit" value="Submit" onClick={(event) => signUpStore.signUp(event, props.signUpAPI)} />
            </form>
      )}
    </Subscribe>
  );
}

export default OnboardSignUp;
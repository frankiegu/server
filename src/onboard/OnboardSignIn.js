import React from 'react';
import { Subscribe } from 'unstated';
import { Redirect } from "react-router-dom";
import SignInContainer from '../containers/SignInContainer';
import StorageContainer from '../containers/StorageContainer';
import OnboardRoute from './OnboardRoute';

function OnboardSignIn(props) {
  return (
    <Subscribe to={[SignInContainer, StorageContainer]}>
      {(signInStore, storageStore) => (
        signInStore.state.isSignedIn
        ?
          <Redirect to="/" />
        :
          storageStore.state.isStorageStored
          ?
            <form className="onboard" onSubmit={(event) => signInStore.signIn(event, props.signInAPI)}>
              <label className="onboard__label">Sign In</label>
              <input type="text" name="usernameoremail" id="signInUsernameOrEmail" placeholder="Username / Email address" onChange={(event) => signInStore.handleUsernameOrEmailChange(event)} />
              <input type="password" name="password" id="signInPassword" placeholder="Password" onChange={(event) => signInStore.handlePasswordChange(event)} />
              <input type="submit" className="button button--primary onboard__submit" value="Submit" />
            </form>
          :
            <OnboardRoute />
      )}
    </Subscribe>
  );
}

export default OnboardSignIn;
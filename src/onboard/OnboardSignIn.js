import React from 'react';
import { Subscribe } from 'unstated';
import { Redirect } from "react-router-dom";
import OnboardContainer from '../containers/OnboardContainer';

function OnboardSignIn(props) {
  return (
    <Subscribe to={[OnboardContainer]}>
      {onboard => (
        onboard.state.isSignedIn
        ?
          <Redirect to="/" />
        :
          <form className="onboard">
            <label className="onboard__label">Sign In</label>
            <input type="text" className="onboard__usernameoremail" id="signInUsernameOrEmail" placeholder="Username / Email address" />
            <input type="password" className="onboard__password" id="signInPassword" placeholder="Password" />
            <input type="submit" className="button button--primary onboard__submit" value="Submit" onClick={(event) => onboard.signIn(event, props.signInAPI)} />
          </form>
      )}
    </Subscribe>
  );
}

export default OnboardSignIn;
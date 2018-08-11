import React from 'react';
import { Subscribe } from 'unstated';
import { Redirect } from "react-router-dom";
import OnboardContainer from '../containers/OnboardContainer';

function OnboardSMTP(props) {
  return (
    <Subscribe to={[OnboardContainer]}>
      {onboard => (
        <div>
          {
            onboard.state.isSignedUp
            ?
              <Redirect to="/signin" />
            :
              <div>
                {
                  onboard.state.isSignUpFilled
                  ?
                    <form className="onboard">
                      <label className="onboard__label">Email sender settings(SMTP)</label>
                      <input type="text" className="onboard__username" id="signUpUsername" placeholder="Username (johnwell)*" />
                      <div className="onboard__error" id="signUpUsernameError">This field is required</div>
                      <input type="email" className="onboard__email" id="signUpEmail" placeholder="Email address (info@example.com)*" />
                      <div className="onboard__error" id="signUpEmailError">This field is required</div>
                      <input type="password" className="onboard__password" id="signUpPassword" placeholder="Password*" />
                      <div className="onboard__error" id="signUpPasswordError">This field is required</div>
                      <input type="submit" className="button button-primary onboard__submit" value="Submit" onClick={(event) => onboard.signUp(event, props.signUpAPI)} />
                    </form>
                  :
                    <Redirect to="/signup" />
                }
              </div>
          }
        </div>
      )}
    </Subscribe>
  );
}

export default OnboardSMTP;
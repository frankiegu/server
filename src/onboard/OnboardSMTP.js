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
                      <label className="onboard__label">Mail server configuration</label>
                      <input type="text" className="onboard__smtp-host" id="smtpHost" placeholder="SMTP hostname (smtp.fastmail.com)*" />
                      <div className="onboard__error" id="smtpHostError">This field is required</div>
                      <input type="text" className="onboard__smtp-port" id="smtpPort" placeholder="SMTP port (25/587/465)*" />
                      <div className="onboard__error" id="smtpPortError">This field is required</div>
                      <input type="text" className="onboard__smtp-username" id="smtpUsername" placeholder="SMTP username (hello@johnwell.com)*" />
                      <div className="onboard__error" id="smtpUsernameError">This field is required</div>
                      <input type="password" className="onboard__smtp-password" id="smtpPassword" placeholder="SMTP password*" />
                      <div className="onboard__error" id="smtpPasswordError">This field is required</div>
                      <input type="submit" className="button button-primary onboard__submit" value="Submit" onClick={(event) => onboard.smtp(event, props.smtpAPI)} />
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
import React from 'react';
import { Subscribe } from 'unstated';
import { Redirect } from "react-router-dom";
import OnboardContainer from '../containers/OnboardContainer';
import OnboardRoute from './OnboardRoute';

function OnboardSMTP(props) {
  return (
    <Subscribe to={[OnboardContainer]}>
      {onboard => (
        onboard.state.isSignedIn
        ?
          <Redirect to="/" />
        :
          onboard.state.isSignUpFilled
          ?
            onboard.state.isSMTPFilled
            ?
              <OnboardRoute />
            :
              <form className="onboard">
                <label className="onboard__label">Mail server configuration</label>
                <input type="text" className="onboard__smtp-host" id="smtpHost" placeholder="SMTP hostname (smtp.fastmail.com)*" />
                <div className="onboard__error" id="smtpHostError">This field is required</div>
                <input type="text" className="onboard__smtp-port" id="smtpPort" placeholder="SMTP port (25/587/465)*" />
                <div className="onboard__error" id="smtpPortError">This field is required</div>
                <input type="email" className="onboard__smtp-username" id="smtpUsername" placeholder="SMTP username (hello@johnwell.com)*" />
                <div className="onboard__error" id="smtpUsernameError">This field is required</div>
                <input type="password" className="onboard__smtp-password" id="smtpPassword" placeholder="SMTP password*" />
                <div className="onboard__error" id="smtpPasswordError">This field is required</div>
                <div className="onboard__sub-form">
                  <label className="onboard__label">Send test email to</label>
                  <input type="email" className="onboard__smtp-testemail" id="smtpTestEmail" placeholder="Email address" />
                  <button className="button button--secondary" onClick={(event) => onboard.sendTestEmail(event, props.testEmailAPI)}>Send</button>
                </div>
                <input type="submit" className="button button--primary onboard__submit" value="Submit" onClick={(event) => onboard.smtp(event, props.smtpAPI)} />
              </form>
          :
            <OnboardRoute />
      )}
    </Subscribe>
  );
}

export default OnboardSMTP;
import React from 'react';
import { Subscribe } from 'unstated';
import { Redirect } from "react-router-dom";
import SignInContainer from '../containers/SignInContainer';
import SignUpContainer from '../containers/SignUpContainer';
import SMTPContainer from '../containers/SMTPContainer';
import OnboardRoute from './OnboardRoute';

function OnboardSMTP(props) {
  return (
    <Subscribe to={[SignInContainer, SignUpContainer, SMTPContainer]}>
      {(signInStore, signUpStore, smtpStore) => (
        signInStore.state.isSignedIn
        ?
          <Redirect to="/" />
        :
          signUpStore.state.isSignUpStored
          ?
            smtpStore.state.isSMTPStored
            ?
              <OnboardRoute />
            :
              <form className="onboard">
                <label className="onboard__label">Mail server configuration</label>
                <input type="text" id="smtpHost" placeholder="SMTP hostname (smtp.fastmail.com)*" onChange={(event) => smtpStore.handleHostnameChange(event)} />
                <div className="onboard__error" id="smtpHostError">This field is required</div>
                <input type="text" id="smtpPort" placeholder="SMTP port (25/587/465)*" onChange={(event) => smtpStore.handlePortChange(event)} />
                <div className="onboard__error" id="smtpPortError">This field is required</div>
                <input type="email" id="smtpUsername" placeholder="SMTP username (hello@johnwell.com)*" onChange={(event) => smtpStore.handleUsernameChange(event)} />
                <div className="onboard__error" id="smtpUsernameError">This field is required</div>
                <input type="password" id="smtpPassword" placeholder="SMTP password*" onChange={(event) => smtpStore.handlePasswordChange(event)} />
                <div className="onboard__error" id="smtpPasswordError">This field is required</div>
                <div className="onboard__sub-form">
                  <label className="onboard__label onboard__label--small">Send test email to</label>
                  <input type="email" id="smtpTestEmail" placeholder="Email address" />
                  <div className="onboard__error" id="smtpTestEmailError">This field is required</div>
                  <div className="onboard__sub-submit">
                    <button className="button button--secondary" onClick={(event) => smtpStore.sendTestEmail(event, props.testEmailAPI)}>Send</button>
                    <i id="smtpLoader"></i>
                    <p id="smtpText">Test email sent successfully!</p>
                  </div>
                </div>
                <div className="onboard__button-group">
                  <button className="button button--secondary" onClick={(event) => smtpStore.skipSMTP(event)}>Skip</button>
                  <input type="submit" className="button button--primary onboard__submit" value="Submit" onClick={(event) => smtpStore.smtp(event, props.smtpAPI)} />
                </div>
              </form>
          :
            <OnboardRoute />
      )}
    </Subscribe>
  );
}

export default OnboardSMTP;
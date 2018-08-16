import React from 'react';
import { Subscribe } from 'unstated';
import { Redirect } from "react-router-dom";
import OnboardContainer from '../containers/OnboardContainer';
import OnboardRoute from './OnboardRoute';

function OnboardNextcloud(props) {
  return (
    <Subscribe to={[OnboardContainer]}>
      {onboard => (
        onboard.state.isSignedIn
        ?
          <Redirect to="/" />
        :
          onboard.state.isSignUpFilled && onboard.state.isSMTPFilled
          ?
            onboard.state.isNextcloudFilled
            ?
              <OnboardRoute />
            :
              <form className="onboard">
                <label className="onboard__label">Nextcloud OAuth2 configuration</label>
                <p className="onboard__sub-label">Redirect URL: &lt;YOUR URL&gt;/nextcloud-code</p>
                <p className="onboard__sub-label">Check <a href="">FAQ</a> on how to integrate Nextcloud.</p>
                <input type="text" className="onboard__nextcloud-url" id="nextcloudURL" placeholder="Nextcloud URL (http://mynextcloud.com)*" />
                <div className="onboard__error" id="nextcloudURLError">This field is required</div>
                <input type="text" className="onboard__nextcloud-client-id" id="nextcloudClientId" placeholder="Client id*" />
                <div className="onboard__error" id="nextcloudClientIdError">This field is required</div>
                <input type="text" className="onboard__nextcloud-client-secret" id="nextcloudClientSecret" placeholder="Client secret*" />
                <div className="onboard__error" id="nextcloudClientSecretError">This field is required</div>
                <input type="text" className="onboard__nextcloud-directory" id="nextcloudDirectory" placeholder="Nextcloud directory (/books or /)*" />
                <div className="onboard__error" id="nextcloudDirectoryError">This field is required</div>
                <input type="submit" className="button button--primary onboard__submit" value="Submit" onClick={(event) => onboard.nextcloud(event, props.nextcloudAPI)} />
              </form>
          :
            <OnboardRoute />
      )}
    </Subscribe>
  );
}

export default OnboardNextcloud;
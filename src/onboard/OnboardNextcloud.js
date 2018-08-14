import React from 'react';
import { Subscribe } from 'unstated';
import { Redirect } from "react-router-dom";
import OnboardContainer from '../containers/OnboardContainer';

function OnboardSMTP(props) {
  return (
    <Subscribe to={[OnboardContainer]}>
      {onboard => (
        onboard.state.isSignedUp
        ?
          <Redirect to="/signin" />
        :
          onboard.state.isSignUpFilled
          ?
            onboard.state.isSMTPFilled
            ?
              <form className="onboard">
                <label className="onboard__label">Nextcloud configuration</label>
              </form>
            :
              <Redirect to="/smtp" />
          :
            <Redirect to="/signup" />
      )}
    </Subscribe>
  );
}

export default OnboardSMTP;
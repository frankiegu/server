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
          onboard.state.isNextcloudFilled
          ?
            <OnboardRoute />
          :
            <form className="onboard">
              <label className="onboard__label">Nextcloud configuration</label>
            </form>
      )}
    </Subscribe>
  );
}

export default OnboardNextcloud;
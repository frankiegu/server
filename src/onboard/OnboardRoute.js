import React, { Component } from 'react';
import { Subscribe } from 'unstated';
import { Redirect } from "react-router-dom";
import OnboardContainer from '../containers/OnboardContainer';

class OnboardRoute extends Component {
  render() {
    return (
      <Subscribe to={[OnboardContainer]}>
        {onboard => (
          onboard.state.isSignUpFilled
          ?
            onboard.state.isSMTPFilled
            ?
              onboard.state.isNextcloudFilled
              ?
                <Redirect to="/signin" />
              :
                <Redirect to="/nextcloud" />
            :
              <Redirect to="/smtp" />
          :
            <Redirect to="/signup" />
        )}
      </Subscribe>
    );
  }
}

export default OnboardRoute;
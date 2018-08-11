import React, { Component } from 'react';
import { Subscribe } from 'unstated';
import { Redirect } from "react-router-dom";
import OnboardContainer from '../containers/OnboardContainer';

class OnboardRoute extends Component {
  render() {
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
                      <Redirect to="/smtp" />
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
}

export default OnboardRoute;
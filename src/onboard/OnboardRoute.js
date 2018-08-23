import React, { Component } from 'react';
import { Subscribe } from 'unstated';
import { Redirect } from "react-router-dom";
import SignUpContainer from '../containers/SignUpContainer';
import SMTPContainer from '../containers/SMTPContainer';
import StorageContainer from '../containers/StorageContainer';

class OnboardRoute extends Component {
  render() {
    return (
      <Subscribe to={[SignUpContainer, SMTPContainer, StorageContainer]}>
        {(signUpStore, smtpStore, storageStore) => (
          signUpStore.state.isSignUpStored
          ?
            smtpStore.state.isSMTPStored
            ?
              storageStore.state.isStorageStored
              ?
                <Redirect to="/signin" />
              :
                <Redirect to="/storage" />
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
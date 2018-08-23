import React from 'react';
import { Subscribe } from 'unstated';
import { Redirect } from "react-router-dom";
import SignInContainer from '../containers/SignInContainer';
import SignUpContainer from '../containers/SignUpContainer';
import StorageContainer from '../containers/StorageContainer';
import OnboardRoute from './OnboardRoute';

function OnboardStorage(props) {
  return (
    <Subscribe to={[SignInContainer, SignUpContainer, StorageContainer]}>
      {(signInStore, signUpStore, storageStore) => (
        signInStore.state.isSignedIn
        ?
          <Redirect to="/" />
        :
          signUpStore.state.isSignUpStored
          ?
            storageStore.state.isStorageStored
            ?
              <OnboardRoute />
            :
              <form className="onboard">
                <label className="onboard__label">Ebooks storage option</label>
                <div className="onboard__note">NOTE: Please make sure you choose the correct option, the storage option cannot be changed again.</div>
                <div className="onboard__radio-form">
                  <div>
                    <input type="radio" name="storage" id="nextcloudRadio" value="nextcloud" defaultChecked onClick={storageStore.handleNextcloudChange} />
                    <label htmlFor="nextcloudRadio">Nextcloud</label>
                  </div>
                  <p className="onboard__info">Nextcloud as a storage option will provide you a way to sync ebooks...</p>
                  <div>
                    <input type="radio" name="storage" id="localRadio" value="local" onClick={storageStore.handleLocalChange} />
                    <label htmlFor="localRadio">Local storage</label>
                  </div>
                  <p className="onboard__info">Local storage as a storage option will provide you a way to sync ebooks...</p>
                </div>
                <div id="nextcloudForm">
                  <div className="onboard__label onboard__label--small">Nextcloud OAuth2 configuration</div>
                  <p className="onboard__sub-label">Redirect URI: &lt;JOYREAD URL&gt;/nextcloud-auth/{storageStore.state.userID}</p>
                  <p className="onboard__sub-label">Check <a href="">FAQ</a> on how to integrate Nextcloud.</p>
                  <input type="text" id="nextcloudURL" placeholder="Nextcloud URL (https://mynextcloud.com)*" onChange={(event) => storageStore.handleNextcloudURLChange(event)} />
                  <div className="onboard__error" id="nextcloudURLError">This field is required</div>
                  <input type="text" id="nextcloudClientID" placeholder="Client id*" onChange={(event) => storageStore.handleNextcloudClientIDChange(event)} />
                  <div className="onboard__error" id="nextcloudClientIDError">This field is required</div>
                  <input type="text" id="nextcloudClientSecret" placeholder="Client secret*" onChange={(event) => storageStore.handleNextcloudClientSecretChange(event)} />
                  <div className="onboard__error" id="nextcloudClientSecretError">This field is required</div>
                  <input type="text" id="nextcloudDirectory" placeholder="Nextcloud directory (/books or /)*" onChange={(event) => storageStore.handleNextcloudDirectoryChange(event)} />
                  <div className="onboard__error" id="nextcloudDirectoryError">This field is required</div>
                  <input type="text" id="joyreadURL" placeholder="Joyread URL (https://myjoyread.com)*" onChange={(event) => storageStore.handleJoyreadURLChange(event)} />
                  <div className="onboard__error" id="joyreadURLError">This field is required</div>
                </div>
                <input type="submit" className="button button--primary onboard__submit" value="Submit" onClick={(event) => storageStore.storage(event, props.nextcloudAPI)} />
              </form>
          :
            <OnboardRoute />
      )}
    </Subscribe>
  );
}

export default OnboardStorage;
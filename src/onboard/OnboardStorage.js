import React from 'react';
import { Subscribe } from 'unstated';
import { Redirect } from "react-router-dom";
import SignInContainer from '../containers/SignInContainer';
import SignUpContainer from '../containers/SignUpContainer';
import SMTPContainer from '../containers/SMTPContainer';
import StorageContainer from '../containers/StorageContainer';
import OnboardRoute from './OnboardRoute';

function HandleRadioClick(event) {
  var storageType = event.target.value;
  if (storageType === "local") {
    document.getElementById('nextcloudForm').className = "none";
  } else {
    document.getElementById('nextcloudForm').className = "";
  }
}

function OnboardStorage(props) {
  return (
    <Subscribe to={[SignInContainer, SignUpContainer, SMTPContainer, StorageContainer]}>
      {(signInStore, signUpStore, smtpStore, storageStore) => (
        signInStore.state.isSignedIn
        ?
          <Redirect to="/" />
        :
          signUpStore.state.isSignUpStored && signUpStore.state.isSMTPStored
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
                    <input type="radio" name="storage" id="nextcloudRadio" value="nextcloud" defaultChecked onClick={(event) => HandleRadioClick(event)} />
                    <label htmlFor="nextcloudRadio">Nextcloud</label>
                  </div>
                  <p className="onboard__info">Nextcloud as a storage option will provide you a way to sync ebooks...</p>
                  <div>
                    <input type="radio" name="storage" id="localRadio" value="local" onClick={(event) => HandleRadioClick(event)} />
                    <label htmlFor="localRadio">Local storage</label>
                  </div>
                  <p className="onboard__info">Local storage as a storage option will provide you a way to sync ebooks...</p>
                </div>
                <div id="nextcloudForm">
                  <div className="onboard__label onboard__label--small">Nextcloud OAuth2 configuration</div>
                  <p className="onboard__sub-label">Redirect URI: &lt;JOYREAD URL&gt;/nextcloud-auth/{storageStore.state.userID}</p>
                  <p className="onboard__sub-label">Check <a href="">FAQ</a> on how to integrate Nextcloud.</p>
                  <input type="text" className="onboard__nextcloud-url" id="nextcloudURL" placeholder="Nextcloud URL (https://mynextcloud.com)*" />
                  <div className="onboard__error" id="nextcloudURLError">This field is required</div>
                  <input type="text" className="onboard__nextcloud-client-id" id="nextcloudClientId" placeholder="Client id*" />
                  <div className="onboard__error" id="nextcloudClientIdError">This field is required</div>
                  <input type="text" className="onboard__nextcloud-client-secret" id="nextcloudClientSecret" placeholder="Client secret*" />
                  <div className="onboard__error" id="nextcloudClientSecretError">This field is required</div>
                  <input type="text" className="onboard__nextcloud-directory" id="nextcloudDirectory" placeholder="Nextcloud directory (/books or /)*" />
                  <div className="onboard__error" id="nextcloudDirectoryError">This field is required</div>
                  <input type="text" className="onboard__nextcloud-joyread-url" id="joyreadURL" placeholder="Joyread URL (https://myjoyread.com)*" />
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
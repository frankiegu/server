import React from 'react'

const NextcloudSubForm = props => 
  <div id="nextcloudForm">
    <div className="onboard__label onboard__label--small">
      Nextcloud OAuth2 configuration
    </div>
    <p className="onboard__sub-label">
      Redirect URI: &lt;JOYREAD URL&gt;/nextcloud-auth/&lt;USER ID&gt;
    </p>
    <p className="onboard__sub-label">
      Check <a href="">FAQ</a> on how to integrate Nextcloud.
    </p>
    <input type="text" 
      name="url"
      placeholder="Nextcloud URL (https://mynextcloud.com)*" 
      value={props.url}
      onChange={props.onInputChange} />
    <div className="onboard__error">{props.errors.url}</div>
    <input type="text" 
      name="clientID"
      placeholder="Client id*" 
      value={props.clientID}
      onChange={props.onInputChange} />
    <div className="onboard__error">{props.errors.clientID}</div>
    <input type="text" 
      name="secret"
      placeholder="Client secret*" 
      value={props.secret}
      onChange={props.onInputChange} />
    <div className="onboard__error">{props.errors.secret}</div>
    <input type="text" 
      name="directory"
      placeholder="Nextcloud directory (/books or /)*" 
      value={props.directory}
      onChange={props.onInputChange} />
    <div className="onboard__error">{props.errors.directory}</div>
    <input type="text" 
      name="joyreadURL"
      placeholder="Joyread URL (https://myjoyread.com)*" 
      value={props.joyreadURL}
      onChange={props.onInputChange} />
    <div className="onboard__error">{props.errors.joyreadURL}</div>
  </div>

export default props => 
  <form className="onboard" onSubmit={props.onSubmitButtonClick} >
    <label className="onboard__label">Ebooks storage option</label>
    <div className="onboard__note">NOTE: Please make sure you choose the correct option, the storage option cannot be changed again.</div>
    <div className="onboard__radio-form">
      <div>
        <input type="radio" 
          name="storage" 
          id="nextcloudRadio" 
          checked={props.type === "nextcloud"}
          onChange={props.onStorageOptionChange}
          value={"nextcloud"} />
        <label htmlFor="nextcloudRadio">Nextcloud</label>
      </div>
      <p className="onboard__info">
        Nextcloud as a storage option will provide you a way to sync ebooks...
      </p>
      <div>
        <input type="radio" 
          name="storage" 
          id="localRadio" 
          checked={props.type === "local"}
          onChange={props.onStorageOptionChange}
          value="local" />
        <label htmlFor="localRadio">Local storage</label>
      </div>
      <p className="onboard__info">
        Local storage as a storage option will provide you a way to sync ebooks...
      </p>
    </div>
    { props.type === "nextcloud" && 
        <NextcloudSubForm 
          onInputChange={props.onNextcloudInputChange}
          {...props} />
    }
    <input type="submit" className="button button--primary onboard__submit" value="Submit" />
  </form>



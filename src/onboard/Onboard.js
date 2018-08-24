import React, { Component } from 'react'
import { 
  validateAdminAccount, 
  validateSMTPConfig, 
  validateStorageConfig } from './validation.js'
import { hasNoErrors } from '../utils/validation.js'

const Step = Object.freeze({ 
  createAdmin: 0,
  setupSMTP: 1,
  setupStorage: 2
})

const defaultNextcloudStorageConfig = Object.freeze({
  type: "nextcloud",
  url: "",
  clientID: "",
  secret: "",
  directory: "",
  joyreadURL: "",
  errors: {
    url: "",
    clientID: "",
    secret: "",
    directory: "",
    joyreadURL: ""
  }
});

const defaultState = Object.freeze({ 
  step: Step.createAdmin, 
  admin: {
    username: "",
    email: "",
    password: "",
    errors: {
      username: "",
      email: "",
      password: ""
    }
  },
  smtp: {
    hostname: "",
    port: "",
    username: "",
    password: "",
    errors: {
      hostname: "",
      port: "",
      username: "",
      password: "",
    }
  },
  testEmail: {
    address: "",
    errors: {
      address: ""
    }
  },
  storage: defaultNextcloudStorageConfig
});

const AdminForm = props => 
  <form className="onboard" onSubmit={props.onSubmitButtonClick}>
    <label className="onboard__label">Create an admin account</label>
    <input type="text" 
      name="username" 
      placeholder="Username (johnwell)*" 
      value={props.username}
      onChange={props.onInputChange} />
    <div className="onboard__error">{props.errors.username}</div>
    <input type="email" 
      name="email"
      placeholder="Email address (info@example.com)*" 
      value={props.email}
      onChange={props.onInputChange} />
    <div className="onboard__error">{props.errors.email}</div>
    <input type="password" 
      name="password"
      placeholder="Password*" 
      value={props.password}
      onChange={props.onInputChange} />
    <div className="onboard__error">{props.errors.password}</div>
    <input type="submit" 
      className="button button--primary onboard__submit" 
      value="Submit" />
  </form>

const TestEmailSubForm = props => 
  <div className="onboard__sub-form">
    <label className="onboard__label onboard__label--small">Send test email to</label>
    <input type="email" 
      name="testAddress"
      placeholder="Email address" 
      value={props.address}
      onChange={props.onInputChange} />
    <div className="onboard__error">{props.errors.address}</div>
    <div className="onboard__sub-submit">
      <button className="button button--secondary" 
        onClick={props.onSendTestEmailButtonClick}>Send</button>
      <i id="smtpLoader"></i>
      { props.testSuccess && <p>Test email sent successfully!</p> }
    </div>
  </div>

const SMTPForm = props => 
  <form className="onboard" onSubmit={props.onSubmitButtonClick} >
    <label className="onboard__label">Mail server configuration</label>
    <input type="text" 
      name="hostname"
      value={props.hostname}
      placeholder="SMTP hostname (smtp.fastmail.com)*" 
      onChange={props.onInputChange} />
    <div className="onboard__error">{props.errors.hostname}</div>
    <input type="text" 
      name="port"
      placeholder="SMTP port (25/587/465)*" 
      value={props.port}
      onChange={props.onInputChange} />
    <div className="onboard__error" >{props.errors.port}</div>
    <input type="email" 
      name="username"
      placeholder="SMTP username (hello@johnwell.com)*" 
      value={props.username}
      onChange={props.onInputChange} />
    <div className="onboard__error">{props.errors.username}</div>
    <input type="password" 
      name="password"
      placeholder="SMTP password*" 
      value={props.password}
      onChange={props.onInputChange} />
    <div className="onboard__error">{props.errors.password}</div>
    <TestEmailSubForm {...props.testEmail} />
    <div className="onboard__button-group">
      <button className="button button--secondary" 
        onClick={props.onSkipButtonClick}>Skip</button>
      <input type="submit" 
        className="button button--primary onboard__submit" 
        value="Submit"/>
    </div>
  </form>

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

const StorageForm = props => 
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

export default class OnboardContainer extends Component {

  constructor() {
    super();
    this.state = defaultState;
  }

  handleAdminInputChange = ({ target }) => {
    const { name, value } = target;
    this.setState(prevState => ({
      admin: { 
        ...prevState.admin,
        [name]: value
      }
    }));
  }

  handleSMTPInputChange = ({ target }) => {
    const { name, value } = target;
    this.setState(prevState => {
      const prevSmtp = prevState.smtp || defaultState.smtp;
      return {
        smtp: { 
          ...prevSmtp,
          [name]: value
        }
      }
    });
  }

  handleNextcloudInputChange = ({ target }) => {
    const { name, value } = target;
    this.setState(prevState => {
      const prevStorage = prevState.storage 
        || defaultNextcloudStorageConfig;
      return {
        storage: { 
          ...prevStorage,
            [name]: value
          }
        }
    });
  }

  handleStorageOptionChange = e => {
    if (e.target.value === "nextcloud")
      this.setState({ storage: defaultNextcloudStorageConfig });
    else
      this.setState({ storage: { type: "local" }});
  }

  skipSMTPConfigStep = () => 
    this.setState({ smtp: null, step: Step.setupStorage });

  attemptToCommitAdmin = () => {
    const admin = this.state.admin;
    const validatedAdmin = validateAdminAccount(admin)
    if (hasNoErrors(validatedAdmin.errors)) {
      this.setState({ step: Step.setupSMTP });
    } else {
      this.setState({ admin: validatedAdmin })
    }
  }

  attemptToCommitSMTPConfig = () => {
    const smtp = this.state.smtp;
    const validatedSMTP = validateSMTPConfig(smtp)
    if (hasNoErrors(validatedSMTP.errors)) {
      this.setState({ step: Step.setupStorage, smtp: validatedSMTP });
    } else {
      this.setState({ smtp: validatedSMTP })
    }
  }

  attemptToCommitStorageConfig = () => {
    const storage = this.state.storage;
    const validatedStorage = validateStorageConfig(storage);
    if (hasNoErrors(validatedStorage.errors)) {
      // upload all data!
      console.log('all done! time to upload', this.state);
    } else {
      this.setState({ storage: validatedStorage })
    }
  }
  commitStep = e => {
    e.preventDefault();
    switch (this.state.step) {
      case Step.createAdmin: {
        this.attemptToCommitAdmin();      
        break;
      }

      case Step.setupSMTP: {
        this.attemptToCommitSMTPConfig();
        break;
      }

      default: { //storage
        this.attemptToCommitStorageConfig();
        break;
      }
        
    }
  }

  render() {
    switch (this.state.step) {
      case Step.createAdmin: 
        return <AdminForm 
          onInputChange={this.handleAdminInputChange} 
          onSubmitButtonClick={this.commitStep}
          {...this.state.admin} />;
      case Step.setupSMTP: 
        return <SMTPForm 
          onInputChange={this.handleSMTPInputChange} 
          onSubmitButtonClick={this.commitStep}
          onSkipButtonClick={this.skipSMTPConfigStep}
          testEmail={this.state.testEmail }
          {...this.state.smtp } />;
      default: // storage
        return <StorageForm 
          onStorageOptionChange={this.handleStorageOptionChange}
          onNextcloudInputChange={this.handleNextcloudInputChange} 
          onSubmitButtonClick={this.commitStep} 
          {...this.state.storage} />;
    } 
  }

}

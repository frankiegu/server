import React, { Component } from 'react'
import { 
  validateAdminAccount, 
  validateSMTPConfig, 
  validateStorageConfig } from './validation.js'
import { hasNoErrors } from '../utils/validation.js'
import AdminForm from './AdminForm.js'
import SMTPForm from './SMTPForm.js'
import StorageForm from './StorageForm.js'
import * as api from './api.js'

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
    required: false,
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
      return {
        smtp: { 
          ...prevState.smtp,
          [name]: value
        }
      }
    });
  }

  handleNextcloudInputChange = ({ target }) => {
    const { name, value } = target;
    this.setState(prevState => {
      return {
        storage: { 
          ...prevState.storage,
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
    this.setState({ smtp: defaultState.smtp, step: Step.setupStorage });

  attemptToCommitAdmin = () => {
    const admin = this.state.admin;
    const validatedAdmin = validateAdminAccount(admin)
    if (hasNoErrors(validatedAdmin.errors)) {
      this.setState({ step: Step.setupSMTP, admin: validatedAdmin });
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

  collectOnboardData = () => {
    const { errors: _1, ...admin } = this.state.admin;
    const { errors: _2, required: smtpRequired, ...smtp } = this.state.smtp;
    const { errors: _3, ...storage } = this.state.storage;
    if (smtpRequired)
      return { admin, smtp, storage };
    return { admin, storage }
  }

  handleBadRequest = res => {
    const errors = res.body;
    this.setState(prevState => {
      const change = {};
      if (errors.storage) {
        change.storage = { ...prevState.storage, errors: errors.storage }
        change.step = Step.storage;
      }
      if (errors.smtp) {
        change.smtp = { ...prevState.smtp, errors: errors.smtp }
        change.step = Step.smtp;
      }
      if (errors.admin) {
        change.admin = { ...prevState.admin, errors: errors.admin }
        change.step = Step.createAdmin;
      }

      return change;
    })
  }

  postOnboardData = () => {
    // should show some progress bar here
    api.postOnboardData(this.collectOnboardData())
      .then(res => {
        switch(res.status) {
          case 200: {
            this.props.onComplete(res.body)
            break;
          }
          case 400: {
            this.handleBadRequest(res);        
            break;
          }
          default: {
            throw new Error('Unknown status code '+ res.status + ' ' +  res.body)
            break;
          }
        }
      })
      .catch(err => {
        // show pop up error, clear
        console.log('oops!', err)
      })

  }

  attemptToCommitStorageConfig = () => {
    const storage = this.state.storage;
    const validatedStorage = validateStorageConfig(storage);
    if (hasNoErrors(validatedStorage.errors)) {
      this.setState({ storage: validatedStorage }, this.postOnboardData)
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

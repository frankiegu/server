import React from 'react'

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

export default props => 
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



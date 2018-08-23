import { Container } from 'unstated';
import RemoveOnboardErrors from '../error/RemoveOnboardErrors';
import IsFieldNone from '../error/IsFieldNone';

class SMTPContainer extends Container {
  constructor() {
    super();
 
    this.state = {
      isSMTPStored: true,
    }
  }

  smtp(event, url) {
    event.preventDefault();

    var smtpHostname = document.getElementById('smtpHost').value;
    var smtpPort = document.getElementById('smtpPort').value;
    var smtpUsername = document.getElementById('smtpUsername').value;
    var smtpPassword = document.getElementById('smtpPassword').value;

    var isError = false;
    RemoveOnboardErrors();

    // Check if smtp hostname is none
    isError = IsFieldNone(smtpHostname, 'smtpHostError', 'This field is required');

    // Check if smtp port is none
    isError = IsFieldNone(smtpPort, 'smtpPortError', 'This field is required');

    // Check if smtp username is none
    isError = IsFieldNone(smtpUsername, 'smtpUsernameError', 'This field is required');

    // Check if smtp password is none
    isError = IsFieldNone(smtpPassword, 'smtpPasswordError', 'This field is required');

    // Return false if any of the above errors exists
    if (isError) return false;

    var data = {
      smtp_hostname: smtpHostname,
      smtp_port: smtpPort,
      smtp_username: smtpUsername,
      smtp_password: smtpPassword,
      user_id: this.state.userID
    }

    fetch(url, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.status === 'registered') {        
        this.setState({ isSMTPStored: true });
        document.getElementById('alert').innerHTML = '<i></i><p>Your SMTP form is registered successfully</p>';
        document.getElementById('alert').classList.add('alert--success');
      } else {
        document.getElementById('alert').innerHTML = '<i></i><p>Not registered</p>';
        document.getElementById('alert').classList.add('alert--error');
      }
    });
  }

  sendTestEmail(event, url) {
    event.preventDefault();

    var smtpHostname = document.getElementById('smtpHost').value;
    var smtpPort = document.getElementById('smtpPort').value;
    var smtpUsername = document.getElementById('smtpUsername').value;
    var smtpPassword = document.getElementById('smtpPassword').value;
    var smtpTestEmail = document.getElementById('smtpTestEmail').value;

    var isError = false;
    RemoveOnboardErrors();

    // Check if smtp hostname is none
    isError = IsFieldNone(smtpHostname, 'smtpHostError', 'This field is required');

    // Check if smtp port is none
    isError = IsFieldNone(smtpPort, 'smtpPortError', 'This field is required');

    // Check if smtp username is none
    isError = IsFieldNone(smtpUsername, 'smtpUsernameError', 'This field is required');

    // Check if smtp password is none
    isError = IsFieldNone(smtpPassword, 'smtpPasswordError', 'This field is required');

    // Check if smtp test email is none
    isError = IsFieldNone(smtpTestEmail, 'smtpTestEmailError', 'This field is required');

    // Return false if any of the above errors exists
    if (isError) return false;

    document.getElementById('smtpLoader').classList.add('show');

    var data = {
      smtp_hostname: smtpHostname,
      smtp_port: smtpPort,
      smtp_username: smtpUsername,
      smtp_password: smtpPassword,
      smtp_test_email: smtpTestEmail
    }

    fetch(url, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.is_email_sent) {
        document.getElementById('smtpLoader').classList.remove('show');
        document.getElementById('smtpText').innerText = 'Test email sent successfully!';
        document.getElementById('smtpText').classList.add('show');
      } else {
        document.getElementById('smtpLoader').classList.remove('show');
        document.getElementById('alert').innerHTML = '<i></i><p>Not registered</p>';
        document.getElementById('alert').classList.add('alert--error');
      }
      
    });
  }

  skipSMTP(event) {
    event.preventDefault();

    this.setState({ isSMTPStored: true });
  }
}

export default SMTPContainer;
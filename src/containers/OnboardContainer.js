import { Container } from 'unstated';
import SetCookie from '../cookies/SetCookie';
import GetCookie from '../cookies/GetCookie';
import DeleteCookie from '../cookies/DeleteCookie';

class OnboardContainer extends Container {
  constructor () {
    super();

    fetch("http://localhost:8080/check-onboard")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.current_progress === "signup") {
        this.setState({ isSignUpFilled: true });
      } else if (data.current_progress === "smtp") {
        this.setState({ isSignUpFilled: true, isSMTPFilled: true});
      } else if (data.current_progress === "nextcloud") {
        this.setState({ isSignUpFilled: true, isSMTPFilled: true, isStorageFilled: true});
      }

      document.getElementById('loader').style.display = 'none';
    });
    
    this.state = {
      userID: 0,
      isSignedIn: false,
      isSignUpFilled: false, // bool true if signup field values are registered
      isSMTPFilled: false, // bool true if smtp field values are registered
      isStorageFilled: false // bool true if storage field values are registered
    };
  }

  removeOnboardErrors() {
    var onboardErrors = document.getElementsByClassName('onboard__error');
    for (var i = 0; i < onboardErrors.length; i++) {
      onboardErrors[i].classList.remove('onboard__error--active');
    }
  }

  // Check if required field value is valid
  isFieldValid(pattern, fieldValue, errorField, errorText) {
    if (!pattern.test(fieldValue)) {
      document.getElementById(errorField).innerText = errorText;
      document.getElementById(errorField).classList.add('onboard__error--active');
      return true;
    }

    return false;
  }

  // Check if required field value is valid according to the regexp pattern given
  isFieldNone(fieldValue, errorField, errorText) {
    if (fieldValue === '') {
      document.getElementById(errorField).innerText = errorText;
      document.getElementById(errorField).classList.add('onboard__error--active');
      return true;
    }

    return false;
  }

  signUp(event, url) {
    event.preventDefault();

    var username = document.getElementById('signUpUsername').value;
    var email = document.getElementById('signUpEmail').value;
    var password = document.getElementById('signUpPassword').value;

    var isError = false;
    this.removeOnboardErrors();

    // Check for valid username
    isError = this.isFieldValid(/^[\w&.-]+$/, username, 'signUpUsernameError', 'Invalid username - Special characters allowed are & . -');

    // Check if username value is none
    isError = this.isFieldNone(username, 'signUpUsernameError', 'This field is required');

    // Check for valid email
    isError = this.isFieldValid(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, email, 'signUpEmailError', 'Invalid email address');

    // Check if email value is none
    isError = this.isFieldNone(email, 'signUpEmailError', 'This field is required');

    // Check if password value is none
    isError = this.isFieldNone(password, 'signUpPasswordError', 'This field is required');

    // Return false if any of the above errors exists
    if (isError) return false;
    

    var data = {
      username: username,
      email: email,
      password: password
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
        this.setState({ userID: data.user_id, isSignUpFilled: true });
        document.getElementById('alert').innerHTML = '<i></i><p>Your database form is registered successfully</p>';
        document.getElementById('alert').classList.add('alert--success');
      } else {
        document.getElementById('alert').innerHTML = '<i></i><p>Not registered</p>';
        document.getElementById('alert').classList.add('alert--error');
      }
    });
  }

  smtp(event, url) {
    event.preventDefault();

    var smtpHostname = document.getElementById('smtpHost').value;
    var smtpPort = document.getElementById('smtpPort').value;
    var smtpUsername = document.getElementById('smtpUsername').value;
    var smtpPassword = document.getElementById('smtpPassword').value;

    var isError = false;
    this.removeOnboardErrors();

    // Check if smtp hostname is none
    isError = this.isFieldNone(smtpHostname, 'smtpHostError', 'This field is required');

    // Check if smtp port is none
    isError = this.isFieldNone(smtpPort, 'smtpPortError', 'This field is required');

    // Check if smtp username is none
    isError = this.isFieldNone(smtpUsername, 'smtpUsernameError', 'This field is required');

    // Check if smtp password is none
    isError = this.isFieldNone(smtpPassword, 'smtpPasswordError', 'This field is required');

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
        this.setState({ isSMTPFilled: true, userID: data.user_id });
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
    this.removeOnboardErrors();

    // Check if smtp hostname is none
    isError = this.isFieldNone(smtpHostname, 'smtpHostError', 'This field is required');

    // Check if smtp port is none
    isError = this.isFieldNone(smtpPort, 'smtpPortError', 'This field is required');

    // Check if smtp username is none
    isError = this.isFieldNone(smtpUsername, 'smtpUsernameError', 'This field is required');

    // Check if smtp password is none
    isError = this.isFieldNone(smtpPassword, 'smtpPasswordError', 'This field is required');

    // Check if smtp test email is none
    isError = this.isFieldNone(smtpTestEmail, 'smtpTestEmailError', 'This field is required');

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

  nextcloud(event, url) {
    event.preventDefault();

    var isNextcloud = document.getElementById('nextcloudRadio').checked ? true : false;

    if (isNextcloud) {
      var nextcloudURL = document.getElementById('nextcloudURL').value;
      var nextcloudClientId = document.getElementById('nextcloudClientId').value;
      var nextcloudClientSecret = document.getElementById('nextcloudClientSecret').value;
      var nextcloudDirectory = document.getElementById('nextcloudDirectory').value;
      var nextcloudRedirectURI = document.getElementById('nextcloudRedirectURI').value;

      var data = {
        user_id: this.state.userID,
        nextcloud_url: nextcloudURL,
        nextcloud_client_id: nextcloudClientId,
        nextcloud_client_secret: nextcloudClientSecret,
        nextcloud_directory: nextcloudDirectory,
        nextcloud_redirect_uri: nextcloudRedirectURI
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
        if (data.status) {
          window.location.href = data.auth_url
        } else {
          document.getElementById('alert').innerHTML = '<i></i><p>Not registered</p>';
          document.getElementById('alert').classList.add('alert--error');
        }
      });
    } else {
      this.setState({ isStorageFilled: true });
    }
  }
  
  signIn(event, url) {
    event.preventDefault();
    
    var usernameoremail = document.getElementById('signInUsernameOrEmail').value;
    var password = document.getElementById('signInPassword').value;

    var data = {
      usernameoremail: usernameoremail,
      password: password
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
      if (data.status === 'authorized') {
        DeleteCookie('joyread');
        SetCookie('joyread', data.token, 30);

        this.setState({ isSignedIn: true });
      } else {
        document.getElementById('alert').innerHTML = '<i></i><p>Your login credentials are incorrect</p>';
        document.getElementById('alert').classList.add('alert--error');
      }
    });
  }

  signOut() {
    DeleteCookie('joyread')
    this.setState({ isSignedIn: false });
  }
}

export default OnboardContainer;
import { Container } from 'unstated';
import RemoveOnboardErrors from '../error/RemoveOnboardErrors';
import IsFieldValid from '../error/IsFieldValid';
import IsFieldNone from '../error/IsFieldNone';

class SignUpContainer extends Container {
  constructor() {
    super();
 
    this.state = {
      userID: 1,
      isSignUpStored: true
    }
  }

  signUp(event, url) {
    event.preventDefault();

    var username = document.getElementById('signUpUsername').value;
    var email = document.getElementById('signUpEmail').value;
    var password = document.getElementById('signUpPassword').value;

    var isError = false;
    RemoveOnboardErrors();

    // Check for valid username
    isError = IsFieldValid(/^[\w&.-]+$/, username, 'signUpUsernameError', 'Invalid username - Special characters allowed are & . -');

    // Check if username value is none
    isError = IsFieldNone(username, 'signUpUsernameError', 'This field is required');

    // Check for valid email
    isError = IsFieldValid(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, email, 'signUpEmailError', 'Invalid email address');

    // Check if email value is none
    isError = IsFieldNone(email, 'signUpEmailError', 'This field is required');

    // Check if password value is none
    isError = IsFieldNone(password, 'signUpPasswordError', 'This field is required');

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
        this.setState({ userID: data.user_id, isSignUpStored: true });
        document.getElementById('alert').innerHTML = '<i></i><p>Your database form is registered successfully</p>';
        document.getElementById('alert').classList.add('alert--success');
      } else {
        document.getElementById('alert').innerHTML = '<i></i><p>Not registered</p>';
        document.getElementById('alert').classList.add('alert--error');
      }
    });
  }
}

export default SignUpContainer;
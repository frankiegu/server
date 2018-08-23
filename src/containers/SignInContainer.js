import { Container } from 'unstated';
import GetCookie from '../cookies/GetCookie';
import SetCookie from '../cookies/SetCookie';
import DeleteCookie from '../cookies/DeleteCookie';

class SignInContainer extends Container {
  constructor() {
    super();

    if (GetCookie("joyread")) this.setState({ isSignedIn: true });
 
    this.state = {
      isSignedIn: false,
      usernameOrEmail: "",
      password: ""
    }
  }

  handleUsernameOrEmailChange(event) {
    this.setState({ usernameOrEmail: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  signIn(event, url) {
    event.preventDefault();
    
    var usernameOrEmail = this.state.usernameOrEmail
    var password = this.state.password

    var data = {
      usernameoremail: usernameOrEmail,
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

export default SignInContainer;
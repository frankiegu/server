import { Container } from 'unstated';
import GetCookie from '../cookies/GetCookie';

class OnboardContainer extends Container {
  constructor () {
    super();

    if (GetCookie("joyread")) {
      this.setState({ isSignedIn: true, isSignUpFilled: true, isSMTPFilled: true, isStorageFilled: true });
    } else {
      fetch("http://localhost:8080/check-onboard")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.current_progress === "signup") {
          this.setState({ isSignUpFilled: true });
        } else if (data.current_progress === "smtp") {
          this.setState({ isSignUpFilled: true, isSMTPFilled: true });
        } else if (data.current_progress === "onboarded") {
          this.setState({ isSignUpFilled: true, isSMTPFilled: true, isStorageFilled: true });
        }

        if (data.user_id > 0) this.setState({ userID: data.user_id });

        document.getElementById('loader').style.display = 'none';
      });
    }
    
    this.state = {
      userID: 0,
      isSignedIn: false,
      isSignUpFilled: false, // bool true if signup field values are registered
      isSMTPFilled: false, // bool true if smtp field values are registered
      isStorageFilled: false // bool true if storage field values are registered
    };
  }
}

export default OnboardContainer;
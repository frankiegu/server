import { Container } from 'unstated';
import RemoveOnboardErrors from '../error/RemoveOnboardErrors';
import IsFieldNone from '../error/IsFieldNone';

class StorageContainer extends Container {
  constructor() {
    super();
 
    this.state = {
      isStorageStored: false,
      isNextcloud: true,
      nextcloudURL: "",
      nextcloudClientID: "",
      nextcloudClientSecret: "",
      nextcloudDirectory: "",
      joyreadURL: "",
    }
  }

  handleNextcloudChange() {
    this.setState({ isNextcloud: true });
  }

  handleLocalChange() {
    this.setState({ isNextcloud: false });
  }

  handleNextcloudURLChange(event) {
    this.setState({ nextcloudURL: event.target.value });
  }

  handleNextcloudClientIDChange(event) {
    this.setState({ nextcloudClientID: event.target.value });
  }

  handleNextcloudClientSecretChange(event) {
    this.setState({ nextcloudClientSecret: event.target.value });
  }

  handleNextcloudDirectoryChange(event) {
    this.setState({ nextcloudDirectory: event.target.value });
  }

  handleJoyreadURLChange(event) {
    this.setState({ joyreadURL: event.target.value });
  }

  storage(event, url) {
    event.preventDefault();

    var isNextcloud = document.getElementById('nextcloudRadio').checked ? true : false;

    if (isNextcloud) {
      var nextcloudURL = document.getElementById('nextcloudURL').value;
      var nextcloudClientID = document.getElementById('nextcloudClientID').value;
      var nextcloudClientSecret = document.getElementById('nextcloudClientSecret').value;
      var nextcloudDirectory = document.getElementById('nextcloudDirectory').value;
      var joyreadURL = document.getElementById('joyreadURL').value;

      var isError = false;
      RemoveOnboardErrors();

      // Check if Nextcloud URL is none
      isError = IsFieldNone(nextcloudURL, 'nextcloudURLError', 'This field is required');

      // Check if Nextcloud client id is none
      isError = IsFieldNone(nextcloudClientID, 'nextcloudClientIDError', 'This field is required');

      // Check if Nextcloud client secret is none
      isError = IsFieldNone(nextcloudClientSecret, 'nextcloudClientSecretError', 'This field is required');

      // Check if Nextcloud directory is none
      isError = IsFieldNone(nextcloudDirectory, 'nextcloudDirectoryError', 'This field is required');

      // Check if Joyread URL is none
      isError = IsFieldNone(joyreadURL, 'joyreadURLError', 'This field is required');

      // Return false if any of the above errors exists
      if (isError) return false;

      var data = {
        user_id: this.state.userID,
        nextcloud_url: nextcloudURL,
        nextcloud_client_id: nextcloudClientID,
        nextcloud_client_secret: nextcloudClientSecret,
        nextcloud_directory: nextcloudDirectory,
        joyread_url: joyreadURL
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
      this.setState({ isStorageStored: true });
    }
  }
}

export default StorageContainer;
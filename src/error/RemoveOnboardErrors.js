function removeOnboardErrors() {
  var onboardErrors = document.getElementsByClassName('onboard__error');
  for (var i = 0; i < onboardErrors.length; i++) {
    onboardErrors[i].classList.remove('onboard__error--active');
  }
}

export default removeOnboardErrors;
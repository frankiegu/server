// Check if required field value is valid
function isFieldValid(pattern, fieldValue, errorField, errorText) {
  if (!pattern.test(fieldValue)) {
    document.getElementById(errorField).innerText = errorText;
    document.getElementById(errorField).classList.add('onboard__error--active');
    return true;
  }
  
  return false;
}

export default isFieldValid;
// Check if required field value is valid according to the regexp pattern given
function isFieldNone(fieldValue, errorField, errorText) {
  if (fieldValue === '') {
    document.getElementById(errorField).innerText = errorText;
    document.getElementById(errorField).classList.add('onboard__error--active');
    return true;
  }
  
  return false;
}

export default isFieldNone;
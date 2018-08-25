const validateJoyreadUsername = username => {
  if (username.length === 0)
    return "username is required"
  // we can add here more conditions for rejecting usernames like
  // max length, allowed chars etc
  return ""
}

const validateEmailAddress = email => {
  if (email.length === 0)
    return "e-mail is required"
  return ""
}

const validatePassword = password => {
  if (password.length === 0)
    return "password is required"
  return ""
}

const validateHostname = hostname => {
  if (hostname.length === 0)
    return "hostname is required"
  return ""
}

const validateSMTPUsername = username => {
  if (username.length === 0)
    return "username is required"
  return ""
}

const validatePort = port => {
  if (port.length === 0)
    return {  value: port, error: "Port is required" };

  const parsedPort = parseInt(port, 10)
  if (isNaN(parsedPort) || parsedPort === 0)
    return { value: port, error: "Invalid port" }

  return { value: parsedPort, error: "" }
}

const validateURL = (url, config) => {
  if (url.length === 0)
    return `${config.name} URL is required`
  return ""
}

const validateClientID = clientID => {
  if (clientID.length === 0)
    return "Client id is required"
  return ""
}

const validateNextcloudSecret = secret => {
  if (secret.length === 0)
    return "secret is required"
  return ""
}

const validateDirectory = directory => {
  if (directory.length === 0)
    return "directory is required"
  return ""
}

export const validateAdminAccount = admin => {
  const username = validateJoyreadUsername(admin.username);
  const email = validateEmailAddress(admin.email);
  const password = validateEmailAddress(admin.password);

  const errors = { username, email, password }
  return { ...admin, errors }
}

export const validateSMTPConfig = smtp => {
  const hostname = validateHostname(smtp.hostname)
  const username = validateSMTPUsername(smtp.username)
  const { value: newPort, error: portError } = validatePort(smtp.port)
  const password = validatePassword(smtp.password)

  const errors = { hostname, username, port: portError, password }
  return { ...smtp, required: true, port: newPort, errors }
} 

export const validateStorageConfig = storage => {
  if (storage.type === "local")
    return { type: "local", errors: {} };

  // assume nextcloud config
  const url = validateURL(storage.url, { name: "Nextcloud" });
  const clientID = validateClientID(storage.clientID);
  const secret = validateNextcloudSecret(storage.secret);
  const directory = validateDirectory(storage.directory);
  const joyreadURL = validateURL(storage.joyreadURL, { name: "Joyread" });

  const errors = { url, clientID, secret, directory, joyreadURL }
  return { ...storage, type: "nextcloud", errors }
}


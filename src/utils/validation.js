export const hasNoErrors = errors => 
  Object.keys(errors).every(errorKey => errors[errorKey].length === 0)

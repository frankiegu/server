import React from 'react'

export default props => 
  <form className="onboard" onSubmit={props.onSubmitButtonClick}>
    <label className="onboard__label">Create an admin account</label>
    <input type="text" 
      name="username" 
      placeholder="Username (johnwell)*" 
      value={props.username}
      onChange={props.onInputChange} />
    <div className="onboard__error">{props.errors.username}</div>
    <input type="email" 
      name="email"
      placeholder="Email address (info@example.com)*" 
      value={props.email}
      onChange={props.onInputChange} />
    <div className="onboard__error">{props.errors.email}</div>
    <input type="password" 
      name="password"
      placeholder="Password*" 
      value={props.password}
      onChange={props.onInputChange} />
    <div className="onboard__error">{props.errors.password}</div>
    <input type="submit" 
      className="button button--primary onboard__submit" 
      value="Submit" />
  </form>

 

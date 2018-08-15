import React from 'react';
import { Subscribe } from 'unstated';
import { Redirect } from "react-router-dom";
import OnboardContainer from '../containers/OnboardContainer';
import OnboardRoute from './OnboardRoute';

function OnboardSignUp(props) {
  return (
    <Subscribe to={[OnboardContainer]}>
      {onboard => (
        onboard.state.isSignedIn
        ?
          <Redirect to="/" />
        :
          onboard.state.isDatabaseFilled
          ?
            <OnboardRoute />
          :
            <form className="onboard">
              <label className="onboard__label">Database configuration</label>
              <select className="onboard__database-type" id="databaseType">
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
              </select>
              <input type="text" className="onboard__database-hostname" id="databaseHostname" placeholder="Hostname (localhost/23.43.22.123)*" />
              <div className="onboard__error" id="databaseHostnameError">This field is required</div>
              <input type="text" className="onboard__database-port" id="databasePort" placeholder="Port (5432)*" />
              <div className="onboard__error" id="databasePortError">This field is required</div>
              <input type="text" className="onboard__database-name" id="databaseName" placeholder="Database name (joyreaddb)*" />
              <div className="onboard__error" id="databaseNameError">This field is required</div>
              <input type="text" className="onboard__database-username" id="databaseUsername" placeholder="Database username (joyreaduser)*" />
              <div className="onboard__error" id="databaseUsernameError">This field is required</div>
              <input type="password" className="onboard__database-password" id="databasePassword" placeholder="Database password" />
              <input type="submit" className="button button--primary onboard__submit" value="Submit" onClick={(event) => onboard.database(event, props.databaseAPI)} />
            </form>
      )}
    </Subscribe>
  );
}

export default OnboardSignUp;
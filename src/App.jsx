/*
 * Copyright (c) 2018-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import React from 'react';
import { Route, useHistory, Switch } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security } from '@okta/okta-react';
import config from './config';
import theme from './utils/theme';

import CorsErrorModal from './components/CorsErrorModal';
import AuthRequiredModal from './components/AuthRequiredModal';
import { ThemeProvider } from '@mui/material';
import Profile from './components/Profile';
import Dashboard from './Pages/Dashboard';
import Hoops from './Pages/HOOPs';
import HoopsEdit from './Pages/HoopsEdit';
import Dispositions from './Pages/Dispositions';
import DispositionEdit from './Pages/DispositionEdit';

const oktaAuth = new OktaAuth(config.oidc);

const App = () => {

  const [corsErrorModalOpen, setCorsErrorModalOpen] = React.useState(false);
  const [authRequiredModalOpen, setAuthRequiredModalOpen] = React.useState(false);

  const history = useHistory(); // example from react-router

  const triggerLogin = async () => {
    await oktaAuth.signInWithRedirect();
  };

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  const customAuthHandler = async () => {
    const previousAuthState = oktaAuth.authStateManager.getPreviousAuthState();
    if (!previousAuthState || !previousAuthState.isAuthenticated) {
      // App initialization stage
      await triggerLogin();
    } else {
      // Ask the user to trigger the login process during token autoRenew process
      setAuthRequiredModalOpen(true);
    }
  };

  return (
    <Security
      oktaAuth={oktaAuth}
      onAuthRequired={customAuthHandler}
      restoreOriginalUri={restoreOriginalUri}
    >
      <CorsErrorModal {...{ corsErrorModalOpen, setCorsErrorModalOpen }} />
      <AuthRequiredModal {...{ authRequiredModalOpen, setAuthRequiredModalOpen, triggerLogin }} />
      <ThemeProvider theme={theme}>
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/login/callback"><Dashboard loginCallback /></Route>
          <Route path="/profile" component={Profile} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/hoops"><Hoops /></Route>
          <Route path="/hoop"><HoopsEdit /></Route>
          <Route path="/hoop/:id" component={HoopsEdit} />
          <Route path="/dispositions"><Dispositions /></Route>
          <Route path="/disposition"><DispositionEdit /></Route>
          <Route path="/disposition/:id" component={DispositionEdit} />
        </Switch>
      </ThemeProvider>
    </Security>
  );
};

export default App;
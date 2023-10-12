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
import { Modal, Button, Box } from '@mui/material';

const AuthRequiredModal = ({ authRequiredModalOpen, setAuthRequiredModalOpen, triggerLogin }) => {
  const closeModal = () => {
    setAuthRequiredModalOpen(false);
  };

  const confirmModal = () => {
    setAuthRequiredModalOpen(false);
    triggerLogin();
  };

  return (
    <Modal
      onClose={closeModal}
      open={authRequiredModalOpen}
    >
      <Box>
        <h1>Auth required</h1>
        <p>Do you want to re-authenticate?</p>
        <Button onClick={closeModal}>
          No
        </Button>
        <Button positive onClick={confirmModal}>
          Yes
        </Button>
      </Box>
    </Modal>
  );
};
export default AuthRequiredModal;
